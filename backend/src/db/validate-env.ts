/**
 * Validate required PostgreSQL env vars at startup.
 * Supports DATABASE_URL (production) or individual DB_* vars.
 * Supports both DB_USER and DB_USERNAME for compatibility.
 */
export function validateDatabaseEnv(): void {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl && databaseUrl.trim() !== '') {
    return;
  }
  const REQUIRED = ['DB_HOST', 'DB_PORT', 'DB_PASSWORD', 'DB_NAME'] as const;
  const USER_VARS = ['DB_USER', 'DB_USERNAME'];
  const missing: string[] = [];
  for (const key of REQUIRED) {
    const val = process.env[key];
    if (val === undefined || val === '') missing.push(key);
  }
  const hasUser = USER_VARS.some((k) => {
    const v = process.env[k];
    return v !== undefined && v !== '';
  });
  if (!hasUser) missing.push('DB_USER or DB_USERNAME');

  if (missing.length > 0) {
    throw new Error(
      `Missing required database env: DATABASE_URL or (${missing.join(', ')}). Set them in .env (see .env.example).`,
    );
  }
}

/** Returns true if DATABASE_URL or all DB_* vars are set (for optional migrations at startup). */
export function hasDatabaseEnv(): boolean {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl && databaseUrl.trim() !== '') return true;
  const required = ['DB_HOST', 'DB_PORT', 'DB_PASSWORD', 'DB_NAME'] as const;
  const hasUser = ['DB_USER', 'DB_USERNAME'].some(
    (k) => process.env[k] !== undefined && process.env[k] !== '',
  );
  return required.every((k) => process.env[k] !== undefined && process.env[k] !== '') && hasUser;
}
