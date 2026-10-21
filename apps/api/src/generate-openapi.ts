import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createApplication } from './application';
import { generateOpenApi } from './common/openapi/document';

async function generate(): Promise<void> {
  // Local metadata inspection only: no listen(), hosted endpoints or persistence.
  const app = await createApplication({ NODE_ENV: 'test' });
  try {
    await app.init();
    await writeFile(
      path.join(__dirname, 'openapi.json'),
      JSON.stringify(generateOpenApi(app), null, 2) + '\n',
    );
  } finally {
    await app.close();
  }
}

void generate().catch(() => {
  console.error('OpenAPI generation failed.');
  process.exitCode = 1;
});
