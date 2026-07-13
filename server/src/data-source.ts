import { dirname, resolve } from 'node:path';
import { DataSource } from 'typeorm';
import { homedir } from 'node:os';
import { mkdir } from 'node:fs/promises';

const database = (process.env['PM2_LOGGER_DATABASE'] ?? '').length > 0
?   resolve(process.env['PM2_LOGGER_DATABASE']!)
:   resolve(homedir(), '.config/pm2-logger/database.db');

await mkdir(dirname(database), { recursive: true });
export const dataSource = new DataSource({
    type: 'better-sqlite3',
    database,
    entities: [
        resolve(import.meta.dirname, './entities/*.entity.{ts,js}')
    ],
    migrations: [
        resolve(import.meta.dirname, './migrations/*.{ts,js}')
    ]
});