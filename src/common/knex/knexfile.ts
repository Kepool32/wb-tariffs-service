import { Knex } from 'knex';
import { config } from 'dotenv';
config();

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
};

export default knexConfig;
