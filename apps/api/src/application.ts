import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureTransport, readBodyLimit } from './common/http/configure';

export async function createApplication(env: NodeJS.ProcessEnv): Promise<NestExpressApplication> {
  const limit = readBodyLimit(env);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    logger: false,
    abortOnError: false,
  });
  try {
    configureTransport(app, limit);
    return app;
  } catch (error) {
    await app.close();
    throw error;
  }
}
