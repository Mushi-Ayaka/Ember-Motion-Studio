const fs = require('fs');
const path = require('path');

const mdDir = path.join(__dirname, '..', 'md');
const manifestPath = path.join(__dirname, '..', 'manifest.json');

function generate(){
  const files = fs.readdirSync(mdDir)
    .filter(f => f.endsWith('.md'))
    .map(f => 'md/' + f)
    .sort();

  fs.writeFileSync(manifestPath, JSON.stringify({ files }, null, 2));
  console.log('Wrote', manifestPath);
}

generate();
