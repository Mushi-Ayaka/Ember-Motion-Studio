/**
 * prebuild.js
 * Limpia el directorio de build temporal anterior.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const { version } = require('../package.json');
const tempBuildDir = path.join(os.tmpdir(), `dvge-build-${version}`);

if (!fs.existsSync(tempBuildDir)) {
  console.log('✓ No previous temp build found.\n');
  process.exit(0);
}

console.log(`\n🧹 Cleaning previous temp build: ${tempBuildDir}\n`);

// Matar proceso DVGE si está corriendo
spawnSync('taskkill', ['/F', '/IM', 'DVGE (Dynamic Vector Graphics Engine) Runtime Bridge.exe', '/T'], { stdio: 'pipe' });

// Solo borrar win-unpacked, preservar el .7z de caché para acelerar el siguiente build
const winUnpacked = path.join(tempBuildDir, 'win-unpacked');
if (fs.existsSync(winUnpacked)) {
  try {
    fs.rmSync(winUnpacked, { recursive: true, force: true });
    console.log('  ✓ win-unpacked cleared (cache .7z preserved)\n');
  } catch {
    spawnSync('cmd', ['/c', 'rd', '/s', '/q', winUnpacked], { stdio: 'pipe' });
    console.log('  ✓ win-unpacked cleared via cmd\n');
  }
} else {
  console.log('  ✓ Nothing to clean\n');
}
