const fs = require('fs');
let code = fs.readFileSync('Sophia.js', 'utf8');

const oldCode = `          const claimSources = (c) => {
            if (!c || typeof c !== 'object') return [];
            const f = c.fuentes || c.sources || [];
            return Array.isArray(f) ? f.filter(Boolean) : [];
          };`;

const newCode = `          const claimSources = (c) => {
            if (!c || typeof c !== 'object') return [];
            const f = c.fuentes || c.sources || [];
            if (!Array.isArray(f)) return [];
            return f.filter(Boolean).map(src => {
              if (typeof src === 'string') return src;
              if (typeof src === 'object') {
                const link = src.url || src.uri || '#';
                const title = src.title || src.url || 'Enlace a la fuente';
                return src.url || src.uri ? \`<a href="\${link}" target="_blank" style="color:var(--accent); text-decoration:underline;">\${title}</a>\` : JSON.stringify(src);
              }
              return String(src);
            });
          };`;

if(code.includes(oldCode)) {
    code = code.replace(oldCode, newCode);
    fs.writeFileSync('Sophia.js', code);
    console.log("✅ Parche determinista aplicado con éxito a Sophia.js");
} else {
    console.log("❌ No se encontró el bloque exacto. Revisa si el archivo ya fue modificado.");
}

node patch_sophia.js
