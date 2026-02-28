import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './common/domain-exception.filter';
import { validateDatabaseEnv, hasDatabaseEnv } from './db/validate-env';
import AppDataSource from './typeorm-datasource';

const RUN_MIGRATIONS = process.env.RUN_MIGRATIONS !== 'false';

async function runMigrations(): Promise<void> {
  validateDatabaseEnv();
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  await AppDataSource.runMigrations();
  await AppDataSource.destroy();
}

function getCorsOrigin(): string | string[] | boolean {
  const origin = process.env.CORS_ORIGIN;
  if (origin === undefined || origin === '') return true;
  if (origin === 'false' || origin === '0') return false;
  if (origin.includes(',')) return origin.split(',').map((s) => s.trim()).filter(Boolean);
  return origin;
}

async function bootstrap() {
  if (!hasDatabaseEnv()) {
    // eslint-disable-next-line no-console
    console.error(
      'Database not configured. Set DATABASE_URL (or DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME) in Render Dashboard → Environment.',
    );
    process.exit(1);
  }
  const shouldRunMigrations = RUN_MIGRATIONS && hasDatabaseEnv();
  if (shouldRunMigrations) {
    try {
      await runMigrations();
    } catch (err) {
      const msg =
        (err instanceof Error && err.message) || (typeof err === 'string' ? err : String(err));
      const stack = err instanceof Error ? err.stack : undefined;
      const detail = msg || (err && typeof err === 'object' ? JSON.stringify(err) : 'Unknown error');
      // eslint-disable-next-line no-console
      console.error('Database startup failed:', detail);
      if (stack) {
        // eslint-disable-next-line no-console
        console.error(stack);
      }
      if (!msg || /ECONNREFUSED|connect|missing|required/i.test(detail)) {
        // eslint-disable-next-line no-console
        console.error(
          'Set DATABASE_URL in Render Dashboard → Environment, or ensure PostgreSQL is reachable.',
        );
      }
      process.exit(1);
    }
  }

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());

  const corsOrigin = getCorsOrigin();
  app.enableCors({ origin: corsOrigin, credentials: true });
  app.setGlobalPrefix('api/v1');

  const http = app.getHttpAdapter();
  http.get('/', (_req: unknown, res: { json: (body: object) => void }) => {
    res.json({
      message: 'E-Waste Traceability API',
      api: '/api/v1',
      health: '/api/v1/health',
      healthDb: '/api/v1/health/db',
    });
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to bootstrap NestJS application', err);
  process.exit(1);
});
