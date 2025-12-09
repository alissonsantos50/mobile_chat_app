import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mongodb',
  url: `mongodb://${String(process.env.DB_USER)}:${String(
    process.env.DB_PASS,
  )}@${String(process.env.DB_HOST)}:${Number(
    process.env.DB_PORT,
  )}/${String(process.env.DB_NAME)}`,
  synchronize: String(process.env.NODE_ENV) === 'production' ? false : true,
  logging: ['query', 'error'],
  entities: ['./src/infra/database/typeorm/model/*.ts'],
  authSource: 'admin',
});

export const initializeDataSource = async (): Promise<DataSource> => {
  const initializedDataSource = !AppDataSource.isInitialized
    ? await AppDataSource.initialize()
    : AppDataSource;
  return initializedDataSource;
};
