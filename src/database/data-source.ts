import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_CONNECTION_STRING,
    synchronize: false,
    migrationsRun: true,
    migrations: ['src/database/migrations/*.ts'],
    entities: ['src/**/*.entity.ts'],
    logging: true,
});
