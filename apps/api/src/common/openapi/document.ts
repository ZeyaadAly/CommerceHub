import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger';
import { apiErrorSchema } from '@commercehub/validation';

/** Generate locally, never register Swagger UI/raw specification HTTP routes. */
export function generateOpenApi(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('CommerceHub technical API')
    .setDescription(
      'Implemented technical routes only. Authentication and business contracts are not implemented.',
    )
    .setVersion('1')
    .setOpenAPIVersion('3.1.0')
    .addServer('/api/v1')
    .addGlobalResponse({
      status: 'default',
      description: 'Sanitized transport error.',
      standardSchema: apiErrorSchema,
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const paths: OpenAPIObject['paths'] = {};
  for (const [route, item] of Object.entries(document.paths)) {
    if (route === '/health') {
      // The legacy unversioned infrastructure route has a distinct server base.
      paths[route] = { ...item, servers: [{ url: '/' }] };
    } else if (route.startsWith('/api/v1/')) {
      paths[route.slice('/api/v1'.length)] = item;
    } else {
      throw new Error('OpenAPI route requires an explicit reviewed version/server mapping.');
    }
  }
  document.paths = paths;
  return document;
}
