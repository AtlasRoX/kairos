/**
 * Environment Variable Integrity Verification Script
 */
const requiredEnvVars = ['DATABASE_URL'];

let missing = 0;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`[WARN] Missing required environment variable: ${envVar}`);
    missing++;
  }
}

if (missing === 0) {
  console.log('[OK] All required environment variables are configured.');
} else {
  console.log(`[INFO] Checked environment: ${missing} variables unset.`);
}
