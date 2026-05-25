/**
 * build-installer.js
 * Corre electron-builder --prepackaged apuntando al win-unpacked ya limpio.
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const pkg = require('../package.json');

const version = pkg.version;
const outputDir = (pkg.build?.directories?.output || `../release/${version}`).replace('${version}', version);
// Si es ruta absoluta, usarla directamente
const releaseDir = path.isAbsolute(outputDir)
  ? outputDir
  : path.resolve(__dirname, '..', outputDir);
const prepackaged = path.join(releaseDir, 'win-unpacked');

// Intentar borrar el .7z de caché con múltiples métodos
const cached7z = path.join(releaseDir, `dv-web-graphics-engine-${version}-x64.nsis.7z`);
if (fs.existsSync(cached7z)) {
  console.log('  🗑 Clearing cached .7z...');
  // Método 1: Node fs
  try { fs.rmSync(cached7z, { force: true }); } catch {}
  // Método 2: cmd del (bypasea algunos locks)
  if (fs.existsSync(cached7z)) {
    spawnSync('cmd', ['/c', 'del', '/f', '/q', cached7z], { stdio: 'pipe' });
  }
  // Método 3: PowerShell con -Force
  if (fs.existsSync(cached7z)) {
    spawnSync('powershell', ['-Command', `Remove-Item -Force -LiteralPath '${cached7z}'`], { stdio: 'pipe' });
  }
  if (!fs.existsSync(cached7z)) {
    console.log('  ✓ Cleared\n');
  } else {
    // Si sigue bloqueado, moverlo a temp para que electron-builder no lo encuentre
    const tmpPath = path.join(os.tmpdir(), `dvge-old-${Date.now()}.7z`);
    try {
      fs.renameSync(cached7z, tmpPath);
      console.log('  ✓ Moved to temp\n');
    } catch {
      console.warn('  ⚠ Could not clear .7z cache — build may fail.\n');
      console.warn('  Fix: Add this folder to Windows Defender exclusions:');
      console.warn(`  ${releaseDir}\n`);
    }
  }
}

console.log(`\n📦 Building NSIS installer from: ${prepackaged}\n`);

execSync(`npx electron-builder --win nsis --prepackaged "${prepackaged}"`, {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..'),
});
