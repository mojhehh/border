const fs = require('fs');

// Win-1252 byte -> Unicode code point (for bytes 0x80-0x9F that differ from ISO-8859-1)
const win1252Map = {
  0x80: 0x20AC, // €
  0x82: 0x201A, // ‚
  0x83: 0x0192, // ƒ
  0x84: 0x201E, // „
  0x85: 0x2026, // …
  0x86: 0x2020, // †
  0x87: 0x2021, // ‡
  0x88: 0x02C6, // ˆ
  0x89: 0x2030, // ‰
  0x8A: 0x0160, // Š
  0x8B: 0x2039, // ‹
  0x8C: 0x0152, // Œ
  0x8E: 0x017D, // Ž
  0x91: 0x2018, // '
  0x92: 0x2019, // '
  0x93: 0x201C, // "
  0x94: 0x201D, // "
  0x95: 0x2022, // •
  0x96: 0x2013, // –
  0x97: 0x2014, // —
  0x98: 0x02DC, // ˜
  0x99: 0x2122, // ™
  0x9A: 0x0161, // š
  0x9B: 0x203A, // ›
  0x9C: 0x0153, // œ
  0x9E: 0x017E, // ž
  0x9F: 0x0178  // Ÿ
};

// Reverse: Unicode code point -> Win-1252 byte
const unicodeToWin1252 = {};
for (const [byte, unicode] of Object.entries(win1252Map)) {
  unicodeToWin1252[unicode] = parseInt(byte);
}

function charToWin1252Byte(codePoint) {
  if (codePoint < 0x80) return codePoint;                      // ASCII
  if (codePoint >= 0xA0 && codePoint <= 0xFF) return codePoint; // Latin-1 supplement
  if (unicodeToWin1252[codePoint] !== undefined) return unicodeToWin1252[codePoint];
  // Bytes 0x81, 0x8D, 0x8F, 0x90, 0x9D are undefined in Win-1252 but map to themselves in practice
  if (codePoint === 0x81) return 0x81;
  if (codePoint === 0x8D) return 0x8D;
  if (codePoint === 0x8F) return 0x8F;
  if (codePoint === 0x90) return 0x90;
  if (codePoint === 0x9D) return 0x9D;
  return -1; // Can't map to Win-1252
}

function reverseOneLayer(str) {
  // Convert each character to its Win-1252 byte, then interpret as UTF-8
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    const cp = str.codePointAt(i);
    if (cp > 0xFFFF) {
      // Surrogate pair - can't be Win-1252 encoded, skip
      return null;
    }
    const b = charToWin1252Byte(cp);
    if (b < 0) {
      console.log(`  Cannot map U+${cp.toString(16).padStart(4,'0')} (${String.fromCodePoint(cp)}) at position ${i}`);
      return null;
    }
    bytes.push(b);
  }
  
  // Interpret byte array as UTF-8
  const buf = Buffer.from(bytes);
  const result = buf.toString('utf8');
  
  // Check for replacement characters
  if (result.includes('\ufffd')) {
    console.log('  Result contains replacement characters');
    return null;  
  }
  
  return result;
}

// Read the file
let content = fs.readFileSync('game.html', 'utf8');
console.log(`Original file: ${content.length} chars, ${Buffer.byteLength(content, 'utf8')} bytes`);

// Count non-ASCII before
let nonAsciiBefore = 0;
for (let i = 0; i < content.length; i++) {
  if (content.charCodeAt(i) > 127) nonAsciiBefore++;
}
console.log(`Non-ASCII chars before: ${nonAsciiBefore}`);

// Try 3 passes of whole-file decoding
for (let pass = 1; pass <= 3; pass++) {
  console.log(`\nPass ${pass}...`);
  const decoded = reverseOneLayer(content);
  if (decoded) {
    content = decoded;
    let nonAscii = 0;
    for (let i = 0; i < content.length; i++) {
      if (content.charCodeAt(i) > 127) nonAscii++;
    }
    console.log(`  Success! ${content.length} chars, Non-ASCII: ${nonAscii}`);
  } else {
    console.log(`  Failed on whole-file decode.`);
    console.log(`  Trying line-by-line approach...`);
    
    // Try line-by-line: decode each line independently
    const lines = content.split('\n');
    let fixedCount = 0;
    let failedLines = [];
    for (let li = 0; li < lines.length; li++) {
      // Check if line has non-ASCII
      let hasNonAscii = false;
      for (let j = 0; j < lines[li].length; j++) {
        if (lines[li].charCodeAt(j) > 127) { hasNonAscii = true; break; }
      }
      if (!hasNonAscii) continue;
      
      const decoded = reverseOneLayer(lines[li]);
      if (decoded) {
        lines[li] = decoded;
        fixedCount++;
      } else {
        failedLines.push(li + 1);
      }
    }
    content = lines.join('\n');
    console.log(`  Fixed ${fixedCount} lines, failed ${failedLines.length} lines`);
    if (failedLines.length > 0 && failedLines.length <= 20) {
      console.log(`  Failed lines: ${failedLines.join(', ')}`);
    }
  }
}

// Final check
let nonAsciiAfter = 0;
let sampleChars = new Set();
for (let i = 0; i < content.length; i++) {
  const cc = content.charCodeAt(i);
  if (cc > 127) {
    nonAsciiAfter++;
    if (sampleChars.size < 50) {
      sampleChars.add(`U+${cc.toString(16).padStart(4,'0')} ${String.fromCharCode(cc)}`);
    }
  }
}
console.log(`\nFinal: ${content.length} chars, Non-ASCII: ${nonAsciiAfter}`);
if (sampleChars.size > 0) {
  console.log(`Sample non-ASCII chars: ${[...sampleChars].join(', ')}`);
}

// Check for remaining mojibake patterns
const mojibakePatterns = ['Ã', 'Â', 'â€', 'Ã©', 'Ã³', 'Ã±'];
for (const pat of mojibakePatterns) {
  const count = (content.match(new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  if (count > 0) console.log(`  WARNING: "${pat}" appears ${count} times (may be mojibake)`);
}

// Write result
fs.writeFileSync('game.html', content, 'utf8');
console.log('\nFile written successfully.');

// Show some sample lines with non-ASCII to verify
const resultLines = content.split('\n');
let shown = 0;
for (let i = 0; i < resultLines.length && shown < 10; i++) {
  let hasNonAscii = false;
  for (let j = 0; j < resultLines[i].length; j++) {
    if (resultLines[i].charCodeAt(j) > 127) { hasNonAscii = true; break; }
  }
  if (hasNonAscii) {
    console.log(`  L${i+1}: ${resultLines[i].substring(0, 120)}`);
    shown++;
  }
}
