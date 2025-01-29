import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { DotenvConfig } from './env.config';
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DotenvConfig.DATABSE_HOST,
  port: DotenvConfig.DATABASE_PORT,
  username: DotenvConfig.DATABASE_USERNAME,
  password: 'postgres',
  database: DotenvConfig.DATABASE_NAME,
  logging: false,
  dropSchema: false,
  synchronize: true,
  entities: ['src/entities/**/*{.ts, .js}'],
});
