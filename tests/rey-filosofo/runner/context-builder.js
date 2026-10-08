const fs = require('fs');
const path = require('path');
const config = require('../config');

function loadDocument(docName) {
  const filePath = path.join(
    config.FIXTURES_DIR,
    'documents',
    docName
  );

  return fs.readFileSync(filePath, 'utf8');
}

function loadSophiaResult(fixtureName) {
  const filePath = path.join(
    config.FIXTURES_DIR,
    'sophia',
    `${fixtureName}.json`
  );

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadLogosResult(fixtureName) {
  const filePath = path.join(
    config.FIXTURES_DIR,
    'logos',
    `${fixtureName}.json`
  );

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function buildAcademiaActiveAsset(documento) {
  if (!documento) return null;

  const content = loadDocument(documento.archivo);
  const title = documento.titulo || 'Documento de prueba';

  return {
    source: 'Academia',
    contractVersion: '1.0',
    objective: `Acompañar en la comprensión del documento: ${title}`,
    asset: {
      title,
      file: documento.archivo,
      content,
      sophia: {}
    },
    metadata: {
      originModule: 'Academia'
    }
  };
}

function buildContext(options) {
  const context = {};

  if (options.documento) {
    context.activeAsset = buildAcademiaActiveAsset(
      options.documento
    );
  }

  if (options.sophia) {
    context.sophia = loadSophiaResult(options.sophia);
  }

  if (options.logos) {
    context.logos = loadLogosResult(options.logos);
  }

  if (options.userPosition) {
    context.posicionUsuario = options.userPosition;
  }

  if (options.alternativePosition) {
    context.posicionAlternativa = options.alternativePosition;
  }

  return context;
}

module.exports = {
  buildContext,
  buildAcademiaActiveAsset,
  loadDocument,
  loadSophiaResult,
  loadLogosResult
};
