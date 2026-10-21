import 'reflect-metadata';
import { createApplication } from './application';
import { ApiConfigurationError, readApiConfig } from './config';

async function bootstrap(): Promise<void> {
  const config = readApiConfig(process.env);
  const app = await createApplication(process.env);
  app.enableShutdownHooks();
  await app.listen(config.port, '127.0.0.1');
}

void bootstrap().catch((error: unknown) => {
  console.error(error instanceof ApiConfigurationError ? error.message : 'API bootstrap failed.');
  process.exitCode = 1;
});
