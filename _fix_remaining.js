const fs = require('fs');

// Win-1252 reverse mapping
const win1252Map = {
  0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E,
  0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6,
  0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039, 0x8C: 0x0152,
  0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C,
  0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A,
  0x9C: 0x0153, 0x9E: 0x017E, 0x9F: 0x0178
};
const unicodeToWin1252 = {};
for (const [byte, unicode] of Object.entries(win1252Map)) {
  unicodeToWin1252[unicode] = parseInt(byte);
}

function charToWin1252Byte(codePoint) {
  if (codePoint < 0x80) return codePoint;
  if (codePoint >= 0xA0 && codePoint <= 0xFF) return codePoint;
  if (unicodeToWin1252[codePoint] !== undefined) return unicodeToWin1252[codePoint];
  if (codePoint >= 0x80 && codePoint <= 0x9F) return codePoint; // Control chars map to self
  return -1;
}

// Lenient UTF-8 decoder: invalid bytes pass through as Latin-1 chars
function lenientUtf8Decode(bytes) {
  let result = '';
  let i = 0;
  while (i < bytes.length) {
    const b = bytes[i];
    if (b < 0x80) {
      result += String.fromCharCode(b);
      i++;
    } else if (b >= 0xC0 && b < 0xE0) {
      if (i + 1 < bytes.length && (bytes[i+1] & 0xC0) === 0x80) {
        result += String.fromCharCode(((b & 0x1F) << 6) | (bytes[i+1] & 0x3F));
        i += 2;
      } else {
        result += String.fromCharCode(b);
        i++;
      }
    } else if (b >= 0xE0 && b < 0xF0) {
      if (i + 2 < bytes.length && (bytes[i+1] & 0xC0) === 0x80 && (bytes[i+2] & 0xC0) === 0x80) {
        result += String.fromCharCode(((b & 0x0F) << 12) | ((bytes[i+1] & 0x3F) << 6) | (bytes[i+2] & 0x3F));
        i += 3;
      } else {
        result += String.fromCharCode(b);
        i++;
      }
    } else if (b >= 0xF0 && b < 0xF8) {
      if (i + 3 < bytes.length && (bytes[i+1] & 0xC0) === 0x80 && (bytes[i+2] & 0xC0) === 0x80 && (bytes[i+3] & 0xC0) === 0x80) {
        const cp = ((b & 0x07) << 18) | ((bytes[i+1] & 0x3F) << 12) | ((bytes[i+2] & 0x3F) << 6) | (bytes[i+3] & 0x3F);
        result += String.fromCodePoint(cp);
        i += 4;
      } else {
        result += String.fromCharCode(b);
        i++;
      }
    } else {
      // 0x80-0xBF (continuation without leader) - keep as Latin-1
      result += String.fromCharCode(b);
      i++;
    }
  }
  return result;
}

function reverseOneLayerLenient(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    const cp = str.codePointAt(i);
    if (cp > 0xFFFF) { i++; return null; } // surrogate pair
    const b = charToWin1252Byte(cp);
    if (b < 0) return null;
    bytes.push(b);
  }
  return lenientUtf8Decode(bytes);
}

let content = fs.readFileSync('game.html', 'utf8');
const lines = content.split('\n');
let fixedCount = 0;
let stillBad = [];

for (let i = 0; i < lines.length; i++) {
  // Check if line still has mojibake (Ã followed by ƒ, or the ═ pattern)
  if (!/[\u00C3][\u0192\u00C2]|[\u00C3][\u00A2][\u00E2]/.test(lines[i])) continue;
  
  let line = lines[i];
  let decoded = false;
  
  // Try up to 5 passes of lenient decoding
  for (let pass = 0; pass < 5; pass++) {
    const result = reverseOneLayerLenient(line);
    if (result === null) break;
    if (result === line) break; // no change
    line = result;
    decoded = true;
  }
  
  if (decoded && line !== lines[i]) {
    // Verify: no mojibake patterns remain and no replacement chars
    if (!line.includes('\ufffd') && !/[\u00C3][\u0192]/.test(line)) {
      lines[i] = line;
      fixedCount++;
      console.log(`  Fixed L${i+1}: ${line.substring(0, 100)}`);
    } else {
      stillBad.push(i + 1);
      console.log(`  STILL BAD L${i+1}: ${line.substring(0, 100)}`);
    }
  }
}

content = lines.join('\n');

// Count remaining non-ASCII issues
let mojiCount = 0;
const resultLines = content.split('\n');
for (let i = 0; i < resultLines.length; i++) {
  if (/[\u00C3][\u0192\u00C2]/.test(resultLines[i]) || /Ã[ƒ‚]/.test(resultLines[i])) {
    mojiCount++;
  }
}

console.log(`\nFixed ${fixedCount} remaining lines`);
console.log(`Still bad: ${stillBad.length} lines: ${stillBad.join(', ')}`);
console.log(`Lines still with mojibake patterns: ${mojiCount}`);

fs.writeFileSync('game.html', content, 'utf8');
console.log('File written.');

// Show sample fixed lines
let shown = 0;
for (let i = 0; i < resultLines.length && shown < 5; i++) {
  if (/[═▲│║╔╗╚╝╠╣╦╩╬]/.test(resultLines[i])) {
    console.log(`  Sample L${i+1}: ${resultLines[i].substring(0, 120)}`);
    shown++;
  }
}
