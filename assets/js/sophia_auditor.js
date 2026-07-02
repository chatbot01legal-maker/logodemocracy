#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const CONFIG = {
  protocolFile: path.join(__dirname, 'protocol', 'sophia_protocol.yaml'),
  minDefinitionLength: 30,
};

// ─────────────────────────────────────────────
// CARGA
// ─────────────────────────────────────────────

function loadProtocol(filePath) {
  return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

// ─────────────────────────────────────────────
// A8 — DEFINICIONES OPERACIONALES
// ─────────────────────────────────────────────

function auditOperationalDefinitions(protocol) {
  const issues = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      (c.atoms || []).forEach(a => {
        if (!a.definition || a.definition.length < 20 || !a.version) {
          issues.push({ atom: a.id, issue: "incomplete_definition" });
        }
      });
    });
  });

  return {
    id: "A8",
    name: "Definiciones operacionales",
    passed: issues.length === 0,
    issues,
    message: issues.length ? `${issues.length} átomos incompletos` : "OK"
  };
}

// ─────────────────────────────────────────────
// ADEF
// ─────────────────────────────────────────────

function auditDefinitions(protocol) {
  const issues = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {

      if (!c.construct?.definition || c.construct.definition.length < CONFIG.minDefinitionLength) {
        issues.push({
          type: "construct",
          id: c.construct?.name || c.id,
          issue: "definition_incomplete"
        });
      }

      (c.atoms || []).forEach(a => {
        if (!a.definition || a.definition.length < 20) {
          issues.push({
            type: "atom",
            id: a.id,
            issue: "definition_incomplete"
          });
        }
      });

    });
  });

  return {
    id: "ADEF",
    name: "Definiciones estructurales",
    passed: issues.length === 0,
    issues,
    message: issues.length ? `${issues.length} problemas` : "OK"
  };
}

// ─────────────────────────────────────────────
// APAT
// ─────────────────────────────────────────────

function auditPatterns(protocol) {
  const issues = [];

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      (c.atoms || []).forEach(a => {

        const patterns = a.patterns || [];
        const def = (a.definition || "").toLowerCase();

        if (patterns.length === 0) {
          issues.push({ atom: a.id, issue: "no_patterns" });
          return;
        }

        const coverage = patterns.filter(p => {
          const regex = new RegExp(`\\b${p.toLowerCase()}\\b`, 'i');
          return regex.test(def);
        }).length;

        const ratio = coverage / patterns.length;

        if (ratio < 0.4) {
          issues.push({
            atom: a.id,
            issue: "low_pattern_alignment",
            ratio
          });
        }

      });
    });
  });

  return {
    id: "APAT",
    name: "Patterns consistency",
    passed: issues.length === 0,
    issues,
    message: issues.length ? `${issues.length} issues` : "OK"
  };
}

// ─────────────────────────────────────────────
// AMAP
// ─────────────────────────────────────────────

function auditPatternExpansion(protocol) {
  const suggestions = [];
  const stopwords = new Set(["cuando", "porque", "donde", "entre", "sobre", "desde"]);

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {
      (c.atoms || []).forEach(a => {

        const existing = new Set((a.patterns || []).map(p => p.toLowerCase()));
        const text = (a.definition || "").toLowerCase();

        const words = text
          .split(/\s+/)
          .filter(w => w.length > 6)
          .filter(w => !stopwords.has(w));

        const missing = [...new Set(words.filter(w => !existing.has(w)))];

        if (missing.length > 0) {
          suggestions.push({
            atom: a.id,
            suggested_patterns: missing.slice(0, 5)
          });
        }

      });
    });
  });

  return {
    id: "AMAP",
    name: "Pattern expansion",
    passed: suggestions.length === 0,
    suggestions,
    message: suggestions.length ? `${suggestions.length} mejoras` : "OK"
  };
}

// ─────────────────────────────────────────────
// A9 NORMAL
// ─────────────────────────────────────────────

function auditSemanticCoverage(protocol) {
  let total = 0;
  let covered = 0;

  protocol.dimensions.forEach(dim => {
    (dim.criteria || []).forEach(c => {

      const text = (c.construct?.definition || "") + " " + (c.definition || "");

      const atoms = (c.atoms || []).map(a => ({
        id: a.id,
        aliases: (a.aliases || []).map(x => x.toLowerCase())
      }));

      const words = text.toLowerCase().split(/\s+/);

      for (const w of words) {
        if (w.length < 5) continue;

        total++;

        const ok = atoms.some(a =>
          a.id === w || a.aliases.some(al => w.includes(al) || al.includes(w))
        );

        if (ok) covered++;
      }
    });
  });

  const coverage = total ? Math.round((covered / total) * 100) : 0;

  return {
    id: "A9",
    name: "Cobertura semántica",
    passed: coverage >= 80,
    coverage,
    message: `${coverage}%`
  };
}

// ─────────────────────────────────────────────
// A9 TRACE (SEPARADO Y LIMPIO)
// ─────────────────────────────────────────────

function auditSemanticTrace(protocol) {
  const trace = [];

  // 1. construir estructura por dimensión
  protocol.dimensions.forEach(dim => {

    const dimEntry = {
      dimension: dim.id,
      criteria: [],
      avgCoverage: 0
    };

    (dim.criteria || []).forEach(c => {

      let total = 0;
      let covered = 0;

      const text =
        (c.construct?.definition || "") +
        " " +
        (c.definition || "");

      const atoms = (c.atoms || []).map(a => ({
        id: a.id,
        aliases: (a.aliases || []).map(x => x.toLowerCase())
      }));

      const words = text.toLowerCase().split(/\s+/);

      for (const w of words) {
        if (w.length < 5) continue;

        total++;

        const ok = atoms.some(a =>
          a.id === w || a.aliases.some(al => w.includes(al) || al.includes(w))
        );

        if (ok) covered++;
      }

      const coverage = total ? Math.round((covered / total) * 100) : 0;

      dimEntry.criteria.push({
        id: c.id,
        coverage,
        gap: 100 - coverage
      });

    });

    // promedio de dimensión
    dimEntry.avgCoverage = Math.round(
      dimEntry.criteria.reduce((acc, c) => acc + c.coverage, 0) /
      (dimEntry.criteria.length || 1)
    );

    trace.push(dimEntry);
  });

  // 2. ranking global
  const globalRanking = trace
    .flatMap(d =>
      d.criteria.map(c => ({
        dimension: d.dimension,
        ...c
      }))
    )
    .sort((a, b) => a.coverage - b.coverage);

  // 3. salida estructural completa
  return {
    id: "A9-TRACE",
    name: "Mapa completo de cobertura semántica",
    
    dimensions: trace,

    globalRanking,

    worstCriteria: globalRanking.slice(0, 10),

    bestCriteria: globalRanking.slice(-10),

    message: `Worst: ${globalRanking[0]?.dimension}.${globalRanking[0]?.id} (${globalRanking[0]?.coverage}%)`
  };
}

// ─────────────────────────────────────────────
// RUN
// ─────────────────────────────────────────────

function runAudits(protocol) {
  const resultados = [
    auditDefinitions(protocol),
    auditOperationalDefinitions(protocol),
    auditPatterns(protocol),
    auditPatternExpansion(protocol),
    auditSemanticCoverage(protocol),
    auditSemanticTrace(protocol),
  ];

  const indices = {
    SCC: resultados.find(r => r.id === "A9")?.coverage || 0,
    Madurez: Math.round(
      resultados.filter(r => r.passed).length / resultados.length * 100
    )
  };

  return { resultados, indices };
}

// ─────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────

function main() {
  const protocolPath = path.join(__dirname, 'protocol', 'sophia_protocol.yaml');

  console.log("🔍 SOPHIA AUDITOR vNEXT");
  console.log("📄 Cargando protocolo...");

  const protocol = loadProtocol(protocolPath);
  const { resultados, indices } = runAudits(protocol);

  const trace = resultados.find(r => r.id === "A9-TRACE");

  console.log("\n📊 COBERTURA POR DIMENSIÓN Y CRITERIO");

  trace.dimensions.forEach(dim => {
    console.log(`\n📦 ${dim.dimension} (avg: ${dim.avgCoverage}%)`);

    dim.criteria.forEach(c => {
      const symbol =
        c.coverage >= 80 ? "🟢" :
        c.coverage >= 50 ? "🟡" : "🔴";

      console.log(`   ${symbol} ${c.id}: ${c.coverage}%`);
    });
  });

  console.log("\n📊 RESUMEN GLOBAL");
  console.log(`ADEF: ${resultados.find(r => r.id === "ADEF").passed ? "OK" : "FAIL"}`);
  console.log(`A8: ${resultados.find(r => r.id === "A8").passed ? "OK" : "FAIL"}`);
  console.log(`APAT issues: ${resultados.find(r => r.id === "APAT").issues.length}`);
  console.log(`AMAP mejoras: ${resultados.find(r => r.id === "AMAP").suggestions.length}`);
  console.log(`A9: ${resultados.find(r => r.id === "A9").coverage}%`);

  console.log(`\n🎯 FOCO: ${trace.worstCriteria?.[0]?.dimension}.${trace.worstCriteria?.[0]?.id} (${trace.worstCriteria?.[0]?.coverage}%)`);

  console.log(`📈 MADUREZ: ${indices.Madurez ?? 0}`);
}

if (require.main === module) {
  main();
}

module.exports = { runAudits };
