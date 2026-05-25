/**
 * bundle-remotion.js
 * Pre-bundlea el entry point de Remotion en tiempo de build.
 * Genera dist/remotion-bundle/ con index.html + bundle.js
 * En runtime, remotion-api.ts usa ese directorio en lugar de llamar a bundle().
 * 
 * Esto elimina @remotion/bundler del runtime → ~100MB menos de deps en producción.
 */

const path = require('path');
const fs = require('fs');

const appRoot = path.join(__dirname, '..');
const entryPoint = path.join(appRoot, 'src/remotion/index.ts');
// Usar carpeta separada de dist/ para que Vite no la borre al limpiar
const outDir = path.join(appRoot, 'remotion-bundle');

async function main() {
  console.log('  Output:', outDir);
  
  // [v5.1.0] Limpiar variables de entorno que podrían contaminar el bundle
  // con URLs de localhost:3000 del servidor de Vite.
  delete process.env.REMOTION_DEV_SERVER;
  delete process.env.VITE_DEV_SERVER_URL;

  const { bundle } = require('@remotion/bundler');

  const bundleDir = await bundle({
    entryPoint,
    publicDir: path.join(appRoot, 'public'),
    outDir,
  });

  console.log('  ✅ Bundle ready at:', bundleDir);
  
  // Verificar que los archivos necesarios existen
  const indexHtml = path.join(bundleDir, 'index.html');
  const bundleJs = path.join(bundleDir, 'bundle.js');
  
  console.log('  index.html:', fs.existsSync(indexHtml) ? '✓' : '✗');
  console.log('  bundle.js:', fs.existsSync(bundleJs) ? '✓' : '✗');
  
  // Guardar el path del bundle para que remotion-api.ts lo use
  const metaPath = path.join(outDir, 'bundle-meta.json');
  fs.writeFileSync(metaPath, JSON.stringify({ bundleDir, builtAt: new Date().toISOString() }, null, 2));
  
  console.log('\n✅ Remotion bundle complete.\n');
  return bundleDir;
}

main().catch(err => {
  console.error('❌ Bundle failed:', err);
  process.exit(1);
});
