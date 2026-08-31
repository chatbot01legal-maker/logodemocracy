#!/usr/bin/env python3

import argparse
import json
import shutil
from datetime import datetime
from pathlib import Path


# ======================================================================
# CONFIGURACIÓN
# ======================================================================

ROOT = Path(__file__).resolve().parent

TREE_JSON = ROOT / "pages" / "academy" / "data" / "tree.json"
CONTENT_DIR = ROOT / "pages" / "academy" / "content"
BACKUP_DIR = CONTENT_DIR / ".academy_backups"

EXCLUDED_FILES = {
    "logos.md",
}

BACKUP_PREFIX = ".academy_backups"


# ======================================================================
# UTILIDADES
# ======================================================================

def separator(title=None):
    print("=" * 70)
    if title:
        print(title)
        print("=" * 70)


def load_tree():
    with TREE_JSON.open("r", encoding="utf-8") as f:
        return json.load(f)


def get_entries(tree):
    """
    Extrae las entradas que contienen un nombre de archivo.
    Compatible con árboles que tengan distintos niveles de estructura.
    """
    entries = []

    def walk(node):
        if isinstance(node, dict):
            if isinstance(node.get("file"), str):
                entries.append(node)

            for value in node.values():
                walk(value)

        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(tree)
    return entries


def get_tree_files(tree):
    return [
        entry["file"]
        for entry in get_entries(tree)
        if isinstance(entry.get("file"), str)
        and entry["file"].lower().endswith(".md")
    ]


def normalize_newlines(text):
    return text.replace("\r\n", "\n").replace("\r", "\n")


def remove_existing_frontmatter(text):
    """
    Elimina un frontmatter YAML situado al comienzo del documento.

    Acepta:
        ---
        ...
        ---

    Si no existe frontmatter, devuelve el texto sin modificar
    salvo por normalización de saltos de línea.
    """
    text = normalize_newlines(text)

    stripped = text.lstrip("\n")

    if not stripped.startswith("---"):
        return text

    lines = stripped.split("\n")

    if not lines:
        return text

    # La primera línea debe ser exactamente ---
    if lines[0].strip() != "---":
        return text

    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            remaining = "\n".join(lines[i + 1:])
            return remaining.lstrip("\n")

    # Si parece comenzar con frontmatter pero está incompleto,
    # no destruir el documento.
    return text


def remove_existing_justify_wrapper(text):
    """
    Elimina únicamente los wrappers completos de:
        <div align="justify">
        ...
        </div>

    No modifica otros divs del documento.
    """
    text = normalize_newlines(text).strip()

    opening = '<div align="justify">'
    closing = '</div>'

    if text.startswith(opening):
        text = text[len(opening):].lstrip("\n")

        if text.rstrip().endswith(closing):
            text = text.rstrip()[:-len(closing)].rstrip("\n")

    return text


def extract_metadata_from_old_frontmatter(text):
    """
    Extrae el contenido del frontmatter antiguo si existe.

    Devuelve:
        (metadata_text, body)

    metadata_text contiene el bloque entre --- y ---.
    """
    text = normalize_newlines(text)
    stripped = text.lstrip("\n")

    if not stripped.startswith("---"):
        return "", text

    lines = stripped.split("\n")

    if lines[0].strip() != "---":
        return "", text

    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            metadata = "\n".join(lines[1:i])
            body = "\n".join(lines[i + 1:]).lstrip("\n")
            return metadata, body

    return "", text


def find_backup_for(filename):
    """
    Busca el respaldo más reciente correspondiente al archivo.
    """
    if not BACKUP_DIR.exists():
        return None

    prefix = f"{Path(filename).stem}.backup-"

    candidates = sorted(
        BACKUP_DIR.glob(f"{prefix}*.md"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )

    return candidates[0] if candidates else None


def read_source_file(filename):
    """
    Fuente de reconstrucción:

    1. Backup existente creado por este estandarizador.
    2. Archivo actual si no existe backup.

    Esto permite reparar documentos que fueron afectados por una
    ejecución anterior del script.
    """
    backup = find_backup_for(filename)

    if backup and backup.exists():
        return backup, backup.read_text(encoding="utf-8")

    current = CONTENT_DIR / filename

    if current.exists():
        return current, current.read_text(encoding="utf-8")

    return None, None


def parse_old_metadata(text):
    """
    Obtiene los metadatos existentes del documento.

    Puede encontrar:
    - frontmatter YAML válido;
    - metadatos antiguos sin delimitadores YAML.

    No intenta interpretar YAML complejo. Conserva los campos
    textualmente cuando ya existen.
    """
    text = normalize_newlines(text)

    metadata, body = extract_metadata_from_old_frontmatter(text)

    if metadata:
        return metadata.strip(), body

    lines = text.split("\n")

    metadata_lines = []
    index = 0

    # Formato antiguo utilizado en varios documentos:
    #
    # library: "..."
    # folder: "..."
    # title: "..."
    # tags:
    #   - ...
    #
    # Se considera metadata solamente mientras aparezcan esos
    # campos al principio del documento.

    recognized = {
        "library:",
        "folder:",
        "title:",
        "tags:",
    }

    found = False

    while index < len(lines):
        line = lines[index]

        stripped = line.strip()

        if not stripped:
            if found:
                index += 1
                continue
            break

        is_known = any(
            stripped.startswith(prefix)
            for prefix in recognized
        )

        if is_known:
            found = True
            metadata_lines.append(line)
            index += 1
            continue

        if found and (
            line.startswith("  - ")
            or line.startswith("- ")
        ):
            metadata_lines.append(line)
            index += 1
            continue

        break

    if found:
        body = "\n".join(lines[index:]).lstrip("\n")
        return "\n".join(metadata_lines).strip(), body

    return "", text


def build_frontmatter(entry, old_metadata):
    """
    Construye un frontmatter único y estandarizado.

    Prioridad:
    1. Datos explícitos presentes en tree.json.
    2. Datos del documento original.
    """

    library = entry.get("library")
    folder = entry.get("folder")
    title = entry.get("title")
    tags = entry.get("tags")

    old_lines = old_metadata.splitlines() if old_metadata else []

    old_values = {}

    current_key = None

    for line in old_lines:
        stripped = line.strip()

        if stripped.startswith("library:"):
            old_values["library"] = stripped[len("library:"):].strip()

        elif stripped.startswith("folder:"):
            old_values["folder"] = stripped[len("folder:"):].strip()

        elif stripped.startswith("title:"):
            old_values["title"] = stripped[len("title:"):].strip()

        elif stripped == "tags:":
            old_values["tags"] = []
            current_key = "tags"

        elif current_key == "tags":
            if stripped.startswith("- "):
                old_values["tags"].append(
                    stripped[2:].strip()
                )
            else:
                current_key = None

    if library is None:
        library = old_values.get("library")

    if folder is None:
        folder = old_values.get("folder")

    if title is None:
        title = old_values.get("title")

    if tags is None:
        tags = old_values.get("tags", [])

    # Valores de seguridad si tree.json no contiene alguno.
    if library is None:
        library = "Alfabetización Digital para humanistas"

    if folder is None:
        folder = "Curso Inicial"

    if title is None:
        title = Path(entry["file"]).stem

    if tags is None:
        tags = []

    if isinstance(tags, str):
        tags = [tags]

    lines = [
        "---",
        f'library: "{library}"',
        f'folder: "{folder}"',
        f'title: "{title}"',
        "tags:",
    ]

    for tag in tags:
        lines.append(f"- {tag}")

    lines.append("---")

    return "\n".join(lines)


def standardize_document(entry, source_text):
    """
    Genera el documento final.

    Resultado:

    ---
    metadata
    ---

    <div align="justify">

    contenido

    </div>
    """

    source_text = normalize_newlines(source_text)

    old_metadata, body = parse_old_metadata(source_text)

    # Por si el documento ya tenía frontmatter válido.
    body = remove_existing_frontmatter(body)

    # Por si ya tenía wrapper.
    body = remove_existing_justify_wrapper(body)

    body = body.strip()

    frontmatter = build_frontmatter(entry, old_metadata)

    result = (
        frontmatter
        + "\n\n"
        + '<div align="justify">'
        + "\n\n"
        + body
        + "\n\n"
        + "</div>"
        + "\n"
    )

    return result


def documents_needing_changes(entries):
    result = []

    for entry in entries:
        filename = entry["file"]

        if filename in EXCLUDED_FILES:
            continue

        current = CONTENT_DIR / filename

        if not current.exists():
            continue

        source_path, source_text = read_source_file(filename)

        if source_text is None:
            continue

        standardized = standardize_document(entry, source_text)

        current_text = current.read_text(encoding="utf-8")

        if normalize_newlines(current_text) != standardized:
            result.append(
                (entry, source_path, source_text, standardized)
            )

    return result


def list_outside_files(tree_files):
    files = []

    if not CONTENT_DIR.exists():
        return files

    for path in CONTENT_DIR.iterdir():
        if not path.is_file():
            continue

        if path.suffix.lower() != ".md":
            continue

        if path.name in tree_files:
            continue

        files.append(path.name)

    return sorted(files)


def validate_tree_files(tree_files):
    missing = []

    for filename in tree_files:
        if filename in EXCLUDED_FILES:
            continue

        path = CONTENT_DIR / filename

        if not path.exists():
            missing.append(filename)

    return missing


# ======================================================================
# INFORME
# ======================================================================

def print_report(entries, tree_files, changes, outside, missing):
    separator("1. VALIDACIÓN")

    if missing:
        print("❌ Faltan documentos declarados en tree.json:")
        for filename in missing:
            print(f"   - {filename}")
    else:
        print("✓ Todos los documentos declarados en tree.json existen.")

    separator("2. ARCHIVOS FUERA DE tree.json")

    if outside:
        for filename in outside:
            print(f"ℹ {filename}")

        print()
        print("Estos archivos NO serán modificados.")
    else:
        print("✓ No existen archivos Markdown fuera de tree.json.")

    separator("3. DOCUMENTOS QUE REQUIEREN ESTANDARIZACIÓN")

    if not changes:
        print("✓ No hay documentos que requieran cambios.")
    else:
        for entry, source_path, source_text, standardized in changes:
            filename = entry["file"]

            print()
            print(f"→ {filename}")
            print("   Se reconstruirá la estructura inicial del documento.")
            print("   ✓ Frontmatter único y estandarizado")
            print("   ✓ <div align=\"justify\"> garantizado")
            print("   ✓ </div> garantizado")

            if source_path is not None:
                if BACKUP_DIR in source_path.parents:
                    print(
                        f"   ✓ Fuente: respaldo anterior "
                        f"({source_path.name})"
                    )
                else:
                    print(
                        f"   ℹ Fuente: archivo actual "
                        f"({source_path.name})"
                    )

    separator("RESUMEN")

    print(f"Documentos declarados : {len(tree_files)}")
    print(f"Documentos a modificar: {len(changes)}")
    print(f"Archivos fuera        : {len(outside)}")
    print("tree.json              : NO SE MODIFICA")
    print("Nombres de archivos    : NO SE MODIFICAN")


# ======================================================================
# APLICACIÓN
# ======================================================================

def apply_changes(changes):
    if not changes:
        print()
        print("No hay cambios para aplicar.")
        return

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")

    separator("CREANDO RESPALDOS Y APLICANDO CAMBIOS")

    applied = 0

    for entry, source_path, source_text, standardized in changes:
        filename = entry["file"]
        current = CONTENT_DIR / filename

        print()
        print(f"→ {filename}")

        # --------------------------------------------------------------
        # Respaldo adicional del estado actual.
        # --------------------------------------------------------------

        backup_name = (
            f"{Path(filename).stem}"
            f".pre-standardize-{timestamp}.md"
        )

        backup_path = BACKUP_DIR / backup_name

        BACKUP_DIR.mkdir(parents=True, exist_ok=True)

        shutil.copy2(current, backup_path)

        print(
            f"  ✓ Respaldo actual: "
            f"{backup_path.relative_to(ROOT)}"
        )

        # --------------------------------------------------------------
        # Escribir documento estandarizado.
        # --------------------------------------------------------------

        temp_path = current.with_suffix(".tmp")

        temp_path.write_text(
            standardized,
            encoding="utf-8",
        )

        temp_path.replace(current)

        print("  ✓ Documento estandarizado.")

        applied += 1

    print()
    separator("RESULTADO")
    print(f"Documentos modificados : {applied}")


# ======================================================================
# VALIDACIÓN POSTERIOR
# ======================================================================

def validate_result(entries):
    separator("VALIDACIÓN POSTERIOR")

    errors = []

    for entry in entries:
        filename = entry["file"]

        if filename in EXCLUDED_FILES:
            continue

        path = CONTENT_DIR / filename

        if not path.exists():
            errors.append(
                f"{filename}: archivo inexistente"
            )
            continue

        text = path.read_text(encoding="utf-8")
        text = normalize_newlines(text)

        # Debe existir exactamente un frontmatter.
        if not text.startswith("---\n"):
            errors.append(
                f"{filename}: no comienza con frontmatter YAML"
            )
        else:
            frontmatter_end = text.find("\n---", 4)

            if frontmatter_end == -1:
                errors.append(
                    f"{filename}: frontmatter incompleto"
                )

            # No debe existir otro frontmatter posterior.
            remainder = text[frontmatter_end + 4:] if frontmatter_end != -1 else ""

            if "\n---\n" in remainder:
                errors.append(
                    f"{filename}: posible segundo frontmatter"
                )

        # Wrapper.
        if '<div align="justify">' not in text:
            errors.append(
                f"{filename}: falta <div align=\"justify\">"
            )

        if not text.rstrip().endswith("</div>"):
            errors.append(
                f"{filename}: falta </div> final"
            )

        # Debe existir solamente un opening wrapper.
        if text.count('<div align="justify">') != 1:
            errors.append(
                f"{filename}: cantidad incorrecta de "
                f"<div align=\"justify\">"
            )

        if text.count("</div>") < 1:
            errors.append(
                f"{filename}: no contiene </div>"
            )

    if errors:
        print("❌ Se encontraron problemas:")
        for error in errors:
            print(f"   - {error}")

        return False

    print(
        f"✓ {len(entries)} documentos verificados correctamente."
    )
    print("✓ Frontmatter único.")
    print("✓ Wrapper <div align=\"justify\"> correcto.")
    print("✓ tree.json no fue modificado.")
    print("✓ Los archivos fuera de tree.json permanecen intactos.")

    return True


# ======================================================================
# MAIN
# ======================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Estandarizador de documentos de la Academia."
    )

    parser.add_argument(
        "--apply",
        action="store_true",
        help="Aplica los cambios.",
    )

    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Muestra los cambios sin modificar archivos.",
    )

    args = parser.parse_args()

    # Si no se especifica ninguna opción, el comportamiento seguro
    # es DRY-RUN.
    apply_mode = args.apply

    separator("ESTANDARIZADOR DE ACADEMIA")

    print()
    print(f"ROOT      : {ROOT}")
    print(f"tree.json : {TREE_JSON}")
    print(f"CONTENT   : {CONTENT_DIR}")
    print()

    if not TREE_JSON.exists():
        print("❌ No existe tree.json.")
        return 1

    if not CONTENT_DIR.exists():
        print("❌ No existe pages/academy/content.")
        return 1

    tree = load_tree()
    entries = get_entries(tree)
    tree_files = get_tree_files(tree)

    print(f"Entradas en tree.json : {len(tree_files)}")

    missing = validate_tree_files(tree_files)

    outside = list_outside_files(set(tree_files))

    changes = documents_needing_changes(entries)

    print_report(
        entries,
        tree_files,
        changes,
        outside,
        missing,
    )

    if missing:
        print()
        print(
            "❌ Hay documentos declarados en tree.json "
            "que no existen."
        )
        print(
            "No se aplicarán cambios hasta resolverlos."
        )
        return 1

    if not changes:
        print()
        separator("SIN CAMBIOS")
        print("✓ La Academia ya está estandarizada.")
        return 0

    if not apply_mode:
        print()
        separator("DRY-RUN")
        print("No se modificó ningún archivo.")
        print()
        print(
            "Para aplicar los cambios:"
        )
        print()
        print(
            "python3 standardize_academy.py --apply"
        )
        return 0

    apply_changes(changes)

    # Validar inmediatamente después.
    print()

    success = validate_result(entries)

    return 0 if success else 1


if __name__ == "__main__":
    raise SystemExit(main())
