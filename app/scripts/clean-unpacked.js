/**
 * clean-unpacked.js
 * Elimina paquetes innecesarios del win-unpacked antes de que NSIS los comprima.
 * Requiere asar: false en electron-builder config.
 */

const fs = require('fs');
const path = require('path');

const { version } = require('../package.json');
const rawOutput = require('../package.json').build?.directories?.output || `../release/${version}`;
const outputDir = rawOutput.replace('${version}', version);
// Si es ruta absoluta (empieza con letra de unidad), usarla directamente
const appDir = path.isAbsolute(outputDir)
  ? path.join(outputDir, 'win-unpacked/resources/app')
  : path.join(__dirname, `../${outputDir}/win-unpacked/resources/app`);

if (!fs.existsSync(appDir)) {
  console.error('❌ win-unpacked/resources/app not found. Run electron-builder --win --dir first.');
  process.exit(1);
}

const nmDir = path.join(appDir, 'node_modules');

// Paquetes a eliminar en el nivel raíz
const rootRemove = [
  '@remotion/studio',
  '@remotion/studio-shared',
  '@remotion/web-renderer',
  '@remotion/media-parser',
  '@remotion/media-utils',
];

function getDirSize(p) {
  if (!fs.existsSync(p)) return 0;
  let size = 0;
  try {
    for (const e of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, e.name);
      size += e.isDirectory() ? getDirSize(full) : fs.statSync(full).size;
    }
  } catch {}
  return size;
}

function removeDir(p) {
  if (!fs.existsSync(p)) return 0;
  const size = getDirSize(p);
  fs.rmSync(p, { recursive: true, force: true });
  return size;
}

console.log('\n🧹 Cleaning win-unpacked...\n');
let totalSaved = 0;

// 1. Eliminar en raíz de node_modules
for (const pkg of rootRemove) {
  const full = path.join(nmDir, pkg);
  const saved = removeDir(full);
  if (saved > 0) {
    totalSaved += saved;
    console.log(`  ✓ ${pkg} (${(saved/1024/1024).toFixed(1)} MB)`);
  }
}

// 2. Buscar y eliminar en node_modules anidados (deps transitivas)
if (fs.existsSync(nmDir)) {
  for (const scope of fs.readdirSync(nmDir, { withFileTypes: true })) {
    if (!scope.isDirectory()) continue;
    const scopePath = path.join(nmDir, scope.name);

    // Buscar en node_modules/@scope/pkg/node_modules/...
    const nestedNm = path.join(scopePath, 'node_modules');
    if (!fs.existsSync(nestedNm)) continue;

    for (const pkg of rootRemove) {
      const nested = path.join(nestedNm, pkg);
      const saved = removeDir(nested);
      if (saved > 0) {
        totalSaved += saved;
        console.log(`  ✓ ${scope.name}/node_modules/${pkg} (${(saved/1024/1024).toFixed(1)} MB)`);
      }
    }
  }
}

const newSize = getDirSize(appDir) / 1024 / 1024;
console.log(`\n✅ Saved: ${(totalSaved/1024/1024).toFixed(1)} MB — app dir now: ${newSize.toFixed(0)} MB\n`);
