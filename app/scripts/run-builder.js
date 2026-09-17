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

// Matar procesos que pueden mantener bloqueado resources/app.asar
for (const imageName of [
  'Ember Motion Studio.exe',
  'DVGE (Dynamic Vector Graphics Engine) Runtime Bridge.exe',
]) {
  spawnSync('taskkill', ['/F', '/IM', imageName, '/T'], { stdio: 'pipe' });
}

// Limpiar win-unpacked anterior
if (fs.existsSync(winUnpacked)) {
  console.log('  🗑 Clearing previous build...');
  try {
    fs.rmSync(winUnpacked, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 500,
    });
  } catch (error) {
    console.error(`❌ Could not clear ${winUnpacked}. Close Ember Motion Studio and retry.`);
    throw error;
  }
}

// Build completo (packaging + NSIS). signAndEditExecutable:false evita que
// electron-builder intente extraer winCodeSign en entornos sin privilegios.
console.log('  📦 Building...');
execSync('npx electron-builder --win nsis', { stdio: 'inherit', cwd: appRoot });

console.log(`\n✅ Done: ${releaseDir}\n`);
