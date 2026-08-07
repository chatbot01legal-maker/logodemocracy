const fs = require('fs');
let code = fs.readFileSync('sophia.js', 'utf8');

const oldCode = `          const claimSources = (c) => {
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

const newCode = `          const claimSources = (c) => {
            if (!c || typeof c !== 'object') return [];
            const f = c.fuentes || c.sources || [];
            if (!Array.isArray(f)) return [];
            return f.filter(Boolean).map(src => {
              if (typeof src === 'string') return src;
              if (typeof src === 'object') {
                // Extraer de posibles objetos anidados de Vertex AI (uri, url, web, etc.)
                const target = src.uri || src.url || src.web?.uri || src.source?.uri || (src.citationMetadata && (src.citationMetadata.uri || src.citationMetadata.url));
                const link = typeof target === 'string' ? target : '#';
                const title = src.title || src.name || src.snippet || link;
                if (link && link !== '#') {
                  return \`<a href="\${link}" target="_blank" style="color:var(--accent); text-decoration:underline;">\${title}</a>\`;
                }
                // Si no hay enlace plano pero tiene contenido legible
                return src.snippet || src.text || JSON.stringify(src);
              }
              return String(src);
            });
          };`;

if(code.includes(oldCode)) {
    code = code.replace(oldCode, newCode);
    fs.writeFileSync('sophia.js', code);
    console.log("✅ Parche robusto aplicado con éxito a Sophia.js");
} else {
    console.log("❌ No se encontró el bloque exacto. Verificando alternativas...");
}
