#!/bin/bash
# Script para revisar si los módulos usan database.js

MODULES_DIR=~/chatbot_legal_v3/modules
FILES=("analyzer.js" "learner.js" "organizador.js" "database.js" "lex.js" "profiler.js")

echo "=========================================="
echo "🔹 Verificación de uso de database.js 🔹"
echo "=========================================="
echo

for file in "${FILES[@]}"; do
    echo "=========================================="
    echo "📄 $file"
    echo "=========================================="
    cat "$MODULES_DIR/$file"
    echo

    if grep -q "require.*database" "$MODULES_DIR/$file"; then
        echo "✅ $file se conecta a database.js"
    else
        # Lex no debe conectarse
        if [ "$file" != "lex.js" ]; then
            echo "⚠️ $file NO se conecta a database.js"
        else
            echo "ℹ️ lex.js NO se conecta a database.js (correcto)"
        fi
    fi
    echo
done
