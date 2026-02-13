// Scan file and output: lineNum | corrupted text | what it should be
const fs = require('fs');
const file = process.argv[2];
const lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let hasHigh = false;
  for (let j = 0; j < line.length; j++) {
    if (line.charCodeAt(j) > 127) { hasHigh = true; break; }
  }
  if (hasHigh) {
    console.log((i + 1) + '|' + line.trimEnd());
  }
}
