import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(3002, '127.0.0.1');
}

void bootstrap().catch(() => {
  console.error('API bootstrap failed.');
  process.exitCode = 1;
});
