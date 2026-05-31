import { readFileSync, writeFileSync, statSync } from 'fs';
const before = statSync('tailwind.css').size;
const raw = readFileSync('tailwind.css', 'utf8');
const minified = raw
  .replace(/\/\*[\s\S]*?\*\//g, '')   // strip comments
  .replace(/\s+/g, ' ')               // collapse whitespace
  .replace(/\s*([{};:,>~+])\s*/g, '$1') // strip spaces around punctuation
  .trim();
writeFileSync('tailwind.css', minified);
const after = statSync('tailwind.css').size;
console.log(`tailwind.css: ${(before/1024).toFixed(1)}KB → ${(after/1024).toFixed(1)}KB (saved ${((before-after)/1024).toFixed(1)}KB)`);
