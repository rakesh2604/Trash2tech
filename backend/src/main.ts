import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './common/domain-exception.filter';
import { validateDatabaseEnv } from './db/validate-env';
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
  if (RUN_MIGRATIONS) {
    try {
      await runMigrations();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // eslint-disable-next-line no-console
      console.error('Database startup failed:', msg);
      if (/ECONNREFUSED|connect/i.test(msg)) {
        // eslint-disable-next-line no-console
        console.error('Ensure PostgreSQL is running and DATABASE_URL or DB_* in .env are correct.');
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
