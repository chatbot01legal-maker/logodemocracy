echo "=== Código actual de manejo de sesión ==="
sed -n '/sessionId/,/sessionStorage\|localStorage/p' public/app.js | head -20
