import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
export class DotenvConfig {
  //Environment
  static NODE_ENV = process.env.NODE_ENV;

  //PORT
  static PORT = process.env.PORT;
  //DB Configuration
  static BASE_URL = process.env.BASE_URL;

  static DATABSE_HOST = process.env.DATABASE_HOST;
  static DATABASE_PORT = +process.env.DATABSE_PORT!;
  static DATABASE_USERNAME = process.env.DATABASE_USERNAME;
  static DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
  static DATABASE_NAME = process.env.DATABASE_NAME;

  static ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
  static ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN!;
  static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
  static REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN!;

  //API Key for Postman and Thunderclient
  static API_KEY = process.env.API_KEY;
  static DEBUG_MODE = process.env.DEBUG_MODE;

  static CORS_ORIGIN = process.env.CORS_ORIGIN!.split(',') || [];
}
