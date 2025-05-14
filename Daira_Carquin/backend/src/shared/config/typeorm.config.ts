import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
config();

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: true,
};

