/**
 * run-builder.js
 * Build completo con asar:true — instalación rápida (1 archivo vs 12k).
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const pkg = require('../package.json');
const version = pkg.version;
const appRoot = path.join(__dirname, '..');

const rawOutput = pkg.build?.directories?.output || `../release/${version}`;
const outputDir = rawOutput.replace('${version}', version);
const releaseDir = path.isAbsolute(outputDir)
  ? outputDir
  : path.resolve(appRoot, outputDir);
const winUnpacked = path.join(releaseDir, 'win-unpacked');

console.log(`\n🔨 Output: ${releaseDir}\n`);

// Matar proceso DVGE si está corriendo
spawnSync('taskkill', ['/F', '/IM', 'DVGE (Dynamic Vector Graphics Engine) Runtime Bridge.exe', '/T'], { stdio: 'pipe' });

// Limpiar win-unpacked anterior
if (fs.existsSync(winUnpacked)) {
  console.log('  🗑 Clearing previous build...');
  try { fs.rmSync(winUnpacked, { recursive: true, force: true }); }
  catch { spawnSync('cmd', ['/c', 'rd', '/s', '/q', winUnpacked], { stdio: 'pipe' }); }
}

// Build completo (packaging + NSIS)
console.log('  📦 Building...');
execSync('npx electron-builder --win nsis', { stdio: 'inherit', cwd: appRoot });

console.log(`\n✅ Done: ${releaseDir}\n`);
