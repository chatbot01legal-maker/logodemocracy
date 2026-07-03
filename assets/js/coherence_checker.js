#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const SOPHIA_JS = path.join(__dirname, "sophia.js");
const YAML_FILE = path.join(
  __dirname,
  "protocol",
  "sophia_protocol.yaml"
);

function loadProtocolJS(){

    const source =
        fs.readFileSync(SOPHIA_JS,"utf8");

    const match =
        source.match(
            /const\s+PROTOCOL\s*=\s*({[\s\S]*?});/
        );

    if(!match)
        throw new Error(
            "No se encontró PROTOCOL en sophia.js"
        );

    return new Function(
        `return (${match[1]})`
    )();

}

function loadProtocolYAML(){

    return yaml.load(

        fs.readFileSync(
            YAML_FILE,
            "utf8"
        )

    );

}

function statsJS(protocol){

    let criterios = 0;
    let atomos = 0;

    protocol.fases.forEach(f=>{

        criterios += f.criterios.length;

        f.criterios.forEach(c=>{

            atomos += c.atomos.length;

        });

    });

    return {

        fases:
            protocol.fases.length,

        criterios,

        atomos

    };

}

function statsYAML(protocol){

    let criterios = 0;
    let atomos = 0;

    protocol.dimensions.forEach(f=>{

        criterios +=
            (f.criteria || []).length;

        (f.criteria || []).forEach(c=>{

            atomos +=
                (c.atoms || []).length;

        });

    });

    return {

        fases:
            protocol.dimensions.length,

        criterios,

        atomos

    };

}

function compare(js,yaml){

    console.log("\n📊 COMPARACIÓN\n");

    console.log(
        "JS:",
        js
    );

    console.log(
        "YAML:",
        yaml
    );

    const ok =

        js.fases === yaml.fases &&

        js.criterios === yaml.criterios &&

        js.atomos === yaml.atomos;

    if(ok){

        console.log(
            "\n✅ COHERENTE"
        );

    }
    else{

        console.log(
            "\n❌ DESINCRONIZADO"
        );

        process.exit(1);

    }

}

function main(){

    console.log(
        "🔎 SOPHIA COHERENCE CHECKER"
    );

    const js =
        loadProtocolJS();

    const y =
        loadProtocolYAML();

    compare(

        statsJS(js),

        statsYAML(y)

    );

}

main();
