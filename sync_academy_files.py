#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
sync_academy_files.py

Sincroniza los nombres físicos de los documentos Markdown de la Academia
con los nombres declarados en:

    pages/academy/data/tree.json

REGLAS:

1. tree.json es la fuente de verdad para los documentos registrados.
2. Coincidencias exactas se mantienen sin cambios.
3. Archivos con nombre diferente pero con alta similitud se proponen
   como renombramientos.
4. Archivos que existen en content/ pero NO están en tree.json se consideran
   archivos externos/no registrados y NO bloquean la sincronización.
5. En particular, archivos como logos.md pueden permanecer fuera de tree.json.
6. Nunca se elimina ningún archivo.
7. --dry-run muestra lo que ocurriría sin modificar archivos.
8. --apply aplica solamente los renombramientos claros.
9. El contenido de los documentos nunca se modifica.
10. tree.json nunca se modifica.

Uso:

    python3 sync_academy_files.py

    python3 sync_academy_files.py --dry-run

    python3 sync_academy_files.py --apply
"""

from pathlib import Path
import json
import argparse
import re
import unicodedata
from difflib import SequenceMatcher


# ============================================================
# CONFIGURACIÓN
# ============================================================

ROOT = Path(__file__).resolve().parent

TREE_FILE = ROOT / "pages" / "academy" / "data" / "tree.json"
CONTENT_DIR = ROOT / "pages" / "academy" / "content"

# Umbral mínimo para considerar un renombramiento automático seguro.
RENAME_THRESHOLD = 0.90

# Diferencia mínima entre el mejor candidato y el segundo mejor
# para evitar renombramientos dudosos.
AMBIGUITY_MARGIN = 0.08


# ============================================================
# UTILIDADES
# ============================================================

def normalize_filename(filename):
    """
    Normaliza un nombre de archivo para facilitar comparaciones.

    Ejemplos:

        "Causalidad-y-Retroalimentación.md"
            ->
        "causalidad y retroalimentacion"

        "votacion_cuadratica.md"
            ->
        "votacion cuadratica"
    """

    name = Path(filename).stem

    # Unicode NFD para separar acentos
    name = unicodedata.normalize("NFD", name)

    # Eliminar marcas diacríticas
    name = "".join(
        char for char in name
        if unicodedata.category(char) != "Mn"
    )

    name = name.lower()

    # Guiones, underscores y espacios se consideran equivalentes
    name = re.sub(r"[_\-]+", " ", name)

    # Eliminar caracteres extraños
    name = re.sub(r"[^a-z0-9\s]", " ", name)

    # Normalizar espacios
    name = re.sub(r"\s+", " ", name).strip()

    return name


def filename_similarity(source, target):
    """
    Calcula similitud entre dos nombres de archivo.
    """

    source_norm = normalize_filename(source)
    target_norm = normalize_filename(target)

    return SequenceMatcher(
        None,
        source_norm,
        target_norm
    ).ratio()


def load_tree():
    """
    Carga tree.json y devuelve la lista de documentos.
    """

    if not TREE_FILE.exists():
        raise FileNotFoundError(
            f"No existe tree.json:\n{TREE_FILE}"
        )

    try:
        with TREE_FILE.open("r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"tree.json contiene JSON inválido:\n{exc}"
        )

    if not isinstance(data, list):
        raise ValueError(
            "tree.json debe contener una lista JSON."
        )

    return data


def get_declared_files(tree):
    """
    Extrae los nombres de archivo declarados en tree.json.
    """

    files = []

    for entry in tree:
        if not isinstance(entry, dict):
            continue

        filename = entry.get("file")

        if filename:
            files.append(filename)

    return files


def get_real_files():
    """
    Obtiene todos los archivos Markdown existentes directamente
    dentro de pages/academy/content/.
    """

    if not CONTENT_DIR.exists():
        raise FileNotFoundError(
            f"No existe la carpeta de contenidos:\n{CONTENT_DIR}"
        )

    return sorted(
        [
            path.name
            for path in CONTENT_DIR.iterdir()
            if path.is_file()
            and path.suffix.lower() == ".md"
        ],
        key=lambda x: x.lower()
    )


def find_candidates(real_file, declared_files):
    """
    Encuentra candidatos de tree.json para un archivo real.
    """

    candidates = []

    for declared in declared_files:

        # Ya existe exactamente: no necesita candidato.
        if real_file == declared:
            continue

        similarity = filename_similarity(
            real_file,
            declared
        )

        candidates.append(
            (declared, similarity)
        )

    candidates.sort(
        key=lambda item: item[1],
        reverse=True
    )

    return candidates


def is_safe_rename(candidates):
    """
    Determina si el mejor candidato es suficientemente claro.

    Retorna:

        (True, best_file, best_score)

    o:

        (False, best_file, best_score, second_score)
    """

    if not candidates:
        return False, None, 0.0, 0.0

    best_file, best_score = candidates[0]

    second_score = (
        candidates[1][1]
        if len(candidates) > 1
        else 0.0
    )

    if best_score < RENAME_THRESHOLD:
        return False, best_file, best_score, second_score

    if (
        len(candidates) > 1
        and (best_score - second_score) < AMBIGUITY_MARGIN
    ):
        return False, best_file, best_score, second_score

    return True, best_file, best_score, second_score


# ============================================================
# ANÁLISIS
# ============================================================

def analyze(tree, real_files):

    declared_files = get_declared_files(tree)

    declared_set = set(declared_files)
    real_set = set(real_files)

    exact_matches = sorted(
        declared_set & real_set,
        key=lambda x: x.lower()
    )

    missing_files = sorted(
        declared_set - real_set,
        key=lambda x: x.lower()
    )

    external_files = sorted(
        real_set - declared_set,
        key=lambda x: x.lower()
    )

    rename_proposals = []
    ambiguous_files = []

    # Archivos que existen físicamente pero cuyo nombre no coincide
    # con ningún nombre declarado en tree.json.
    unmatched_real_files = external_files.copy()

    # Solamente intentamos encontrar correspondencias para archivos
    # externos que podrían ser renombramientos.
    for real_file in unmatched_real_files:

        candidates = find_candidates(
            real_file,
            missing_files
        )

        if not candidates:
            ambiguous_files.append(
                {
                    "file": real_file,
                    "candidates": []
                }
            )
            continue

        safe, best_file, best_score, second_score = (
            is_safe_rename(candidates)
        )

        if safe:
            rename_proposals.append(
                {
                    "source": real_file,
                    "target": best_file,
                    "score": best_score
                }
            )
        else:
            # Si el archivo tiene una coincidencia razonablemente
            # cercana pero no suficientemente segura, lo mostramos
            # como ambiguo.
            close_candidates = [
                {
                    "file": candidate,
                    "score": score
                }
                for candidate, score in candidates[:5]
                if score >= 0.25
            ]

            ambiguous_files.append(
                {
                    "file": real_file,
                    "candidates": close_candidates
                }
            )

    # Evitar que dos archivos físicos sean propuestos para el mismo
    # destino.
    target_groups = {}

    for proposal in rename_proposals:
        target_groups.setdefault(
            proposal["target"],
            []
        ).append(proposal)

    final_renames = []
    collision_ambiguities = []

    for target, proposals in target_groups.items():

        if len(proposals) == 1:
            final_renames.append(proposals[0])

        else:
            collision_ambiguities.append(
                {
                    "target": target,
                    "proposals": proposals
                }
            )

    return {
        "declared_files": declared_files,
        "real_files": real_files,
        "exact_matches": exact_matches,
        "missing_files": missing_files,
        "external_files": external_files,
        "rename_proposals": sorted(
            final_renames,
            key=lambda x: x["source"].lower()
        ),
        "ambiguous_files": ambiguous_files,
        "collision_ambiguities": collision_ambiguities,
    }


# ============================================================
# PRESENTACIÓN
# ============================================================

def print_header(title):
    print()
    print("=" * 70)
    print(title)
    print("=" * 70)


def print_report(result):

    print_header(
        "SINCRONIZADOR DE ARCHIVOS DE LA ACADEMIA"
    )

    print()
    print(f"ROOT      : {ROOT}")
    print(f"tree.json : {TREE_FILE}")
    print(f"CONTENT   : {CONTENT_DIR}")

    print()
    print(
        f"Entradas tree.json : "
        f"{len(result['declared_files'])}"
    )

    print(
        f"Documentos reales  : "
        f"{len(result['real_files'])}"
    )

    # --------------------------------------------------------
    # EXACTOS
    # --------------------------------------------------------

    print_header("1. COINCIDENCIAS EXACTAS")

    if result["exact_matches"]:

        for filename in result["exact_matches"]:
            print(f"✓ {filename}")

    else:
        print("Ninguna.")

    # --------------------------------------------------------
    # RENOMBRAMIENTOS
    # --------------------------------------------------------

    print_header("2. RENOMBRAMIENTOS PROPUESTOS")

    if result["rename_proposals"]:

        for proposal in result["rename_proposals"]:

            print()
            print(
                f"   {proposal['source']}"
            )

            print(
                f"      ↓"
            )

            print(
                f"   {proposal['target']}"
            )

            print(
                f"      similitud: "
                f"{proposal['score'] * 100:.1f}%"
            )

    else:
        print("Ninguno.")

    # --------------------------------------------------------
    # AMBIGUOS
    # --------------------------------------------------------

    print_header("3. COINCIDENCIAS AMBIGUAS")

    if result["ambiguous_files"]:

        for item in result["ambiguous_files"]:

            print()
            print(
                f"⚠️ {item['file']}"
            )

            for candidate in item["candidates"]:

                print(
                    f"   "
                    f"{candidate['score'] * 100:.1f}%"
                    f"  →  "
                    f"{candidate['file']}"
                )

    else:
        print("Ninguna.")

    # --------------------------------------------------------
    # COLISIONES
    # --------------------------------------------------------

    if result["collision_ambiguities"]:

        print_header(
            "3B. COLISIONES DE DESTINO"
        )

        for collision in result["collision_ambiguities"]:

            print()
            print(
                f"⚠️ Destino: "
                f"{collision['target']}"
            )

            for proposal in collision["proposals"]:

                print(
                    f"   "
                    f"{proposal['source']}"
                    f"  "
                    f"{proposal['score'] * 100:.1f}%"
                )

    # --------------------------------------------------------
    # ARCHIVOS EXTERNOS
    # --------------------------------------------------------

    print_header(
        "4. ARCHIVOS FUERA DE tree.json"
    )

    if result["external_files"]:

        for filename in result["external_files"]:

            print(
                f"ℹ {filename}"
            )

        print()
        print(
            "Estos archivos existen en content/ pero "
            "no están registrados en tree.json."
        )

        print(
            "No serán eliminados, modificados ni utilizados "
            "para bloquear la sincronización."
        )

    else:
        print("Ninguno.")

    # --------------------------------------------------------
    # FALTANTES
    # --------------------------------------------------------

    print_header(
        "5. ARCHIVOS DECLARADOS EN tree.json QUE NO EXISTEN"
    )

    if result["missing_files"]:

        for filename in result["missing_files"]:
            print(f"❌ {filename}")

    else:
        print("Ninguno.")

    # --------------------------------------------------------
    # RESUMEN
    # --------------------------------------------------------

    print_header("RESUMEN")

    print(
        f"Exactos              : "
        f"{len(result['exact_matches'])}"
    )

    print(
        f"Renombramientos      : "
        f"{len(result['rename_proposals'])}"
    )

    print(
        f"Ambiguos             : "
        f"{len(result['ambiguous_files'])}"
    )

    print(
        f"Fuera de tree.json   : "
        f"{len(result['external_files'])}"
    )

    print(
        f"Declarados faltantes : "
        f"{len(result['missing_files'])}"
    )


# ============================================================
# APLICACIÓN
# ============================================================

def apply_renames(result):

    proposals = result["rename_proposals"]

    if not proposals:
        print()
        print(
            "No existen renombramientos claros para aplicar."
        )
        return True

    # Verificación adicional:
    # no aplicar si existen archivos destino reales.
    for proposal in proposals:

        source = CONTENT_DIR / proposal["source"]
        target = CONTENT_DIR / proposal["target"]

        if not source.exists():
            print()
            print(
                f"❌ El origen ya no existe:\n"
                f"   {source}"
            )
            return False

        if target.exists():
            print()
            print(
                f"❌ El destino ya existe:\n"
                f"   {target}"
            )

            print(
                "No se realizará ningún renombramiento "
                "para evitar sobrescribir archivos."
            )

            return False

    print_header(
        "APLICANDO RENOMBRAMIENTOS"
    )

    for proposal in proposals:

        source = CONTENT_DIR / proposal["source"]
        target = CONTENT_DIR / proposal["target"]

        print()
        print(
            f"→ {proposal['source']}"
        )

        print(
            f"  ↓"
        )

        print(
            f"  {proposal['target']}"
        )

        source.rename(target)

    print()
    print(
        f"✓ Se aplicaron "
        f"{len(proposals)} renombramientos."
    )

    return True


# ============================================================
# MAIN
# ============================================================

def main():

    parser = argparse.ArgumentParser(
        description=(
            "Sincroniza los nombres de los archivos Markdown "
            "de la Academia con tree.json."
        )
    )

    parser.add_argument(
        "--apply",
        action="store_true",
        help="Aplica los renombramientos claros."
    )

    parser.add_argument(
        "--dry-run",
        action="store_true",
        help=(
            "Simula la operación sin modificar archivos. "
            "Es el comportamiento predeterminado."
        )
    )

    args = parser.parse_args()

    # --------------------------------------------------------
    # CARGA
    # --------------------------------------------------------

    try:
        tree = load_tree()
        real_files = get_real_files()

    except Exception as exc:

        print()
        print("=" * 70)
        print("ERROR")
        print("=" * 70)
        print()
        print(exc)
        print()

        return 1

    # --------------------------------------------------------
    # ANÁLISIS
    # --------------------------------------------------------

    result = analyze(
        tree,
        real_files
    )

    print_report(result)

    # --------------------------------------------------------
    # VALIDACIÓN
    # --------------------------------------------------------

    # Los archivos externos NO bloquean.
    #
    # Las ambigüedades tampoco bloquean el modo de análisis,
    # pero sí impedimos aplicar automáticamente si existen
    # ambigüedades que puedan interferir con un renombramiento.
    #
    # En el caso de archivos como logos.md, estos son simplemente
    # archivos externos y no deben considerarse una ambigüedad
    # bloqueante.

    blocking_collision = bool(
        result["collision_ambiguities"]
    )

    if blocking_collision:

        print_header("ERROR")

        print(
            "Existen colisiones de destino."
        )

        print(
            "No se realizará ningún cambio automático."
        )

        return 1

    # --------------------------------------------------------
    # DRY RUN
    # --------------------------------------------------------

    if not args.apply:

        print_header("DRY-RUN")

        print(
            "No se modificó ningún archivo."
        )

        if result["rename_proposals"]:

            print()
            print(
                "Para aplicar solamente los "
                "renombramientos claros:"
            )

            print()
            print(
                "python3 sync_academy_files.py --apply"
            )

        else:

            print()
            print(
                "No hay renombramientos claros pendientes."
            )

        return 0

    # --------------------------------------------------------
    # APPLY
    # --------------------------------------------------------

    success = apply_renames(result)

    if not success:
        return 1

    # --------------------------------------------------------
    # VALIDACIÓN POSTERIOR
    # --------------------------------------------------------

    print_header(
        "VALIDACIÓN POSTERIOR"
    )

    new_real_files = get_real_files()

    new_result = analyze(
        tree,
        new_real_files
    )

    print(
        f"Entradas tree.json : "
        f"{len(new_result['declared_files'])}"
    )

    print(
        f"Documentos reales  : "
        f"{len(new_result['real_files'])}"
    )

    print()

    if new_result["missing_files"]:

        print(
            "⚠️ Todavía existen archivos declarados "
            "en tree.json que no tienen archivo físico."
        )

    if new_result["rename_proposals"]:

        print(
            "⚠️ Todavía existen renombramientos pendientes."
        )

    if not new_result["rename_proposals"]:

        print(
            "✓ No quedan renombramientos automáticos pendientes."
        )

    print()
    print(
        "✓ Sincronización terminada."
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
