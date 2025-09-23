import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './configs/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_8UZWVauwoXe5@ep-withered-brook-ad9xe3xb-pooler.c-2.us-east-1.aws.neon.tech/car-marketplace?sslmode=require&channel_binding=require',
  },
});
