import { defineConfig } from 'prisma/config';

// Format/validate only: no dotenv, datasource URL, client, seed or migrations.
export default defineConfig({ schema: 'prisma/schema.prisma' });
