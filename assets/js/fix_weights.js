// fix_weights.js
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const file = path.join(__dirname, 'protocol', 'sophia_protocol.yaml');
const doc = yaml.load(fs.readFileSync(file, 'utf8'));

// Cambiar pesos de dimensiones a 20 cada una
doc.aggregation.dimensions.forEach(d => d.weight = 20);

fs.writeFileSync(file, yaml.dump(doc, { indent: 2 }));
console.log('✅ Pesos actualizados a 20 cada dimensión.');
