/**
 * Pre-Deploy Build & Structure Validator
 */
import fs from 'node:fs';

const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.ts',
  'app/layout.tsx',
  'app/page.tsx'
];

let valid = true;
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`[ERROR] Critical file missing: ${file}`);
    valid = false;
  }
}

if (valid) {
  console.log('[OK] Project core structure validation passed.');
  process.exit(0);
} else {
  console.error('[FAIL] Build structure validation failed.');
  process.exit(1);
}
