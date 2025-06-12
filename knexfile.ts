import { config } from 'dotenv'
import { Knex } from 'knex'

config()

export default {
  development: {
    client: process.env.DATABASE_CLIENT || 'sqlite3',
    connection:
      process.env.DATABASE_CLIENT === 'pg'
        ? process.env.DATABASE_URL
        : {
            filename: process.env.DATABASE_URL || './tmp/app.db',
          },
    useNullAsDefault: true,
    migrations: {
      extension: 'ts',
      directory: './src/database/migrations',
    },
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: './tmp/test.db',
    },
    useNullAsDefault: true,
    migrations: {
      extension: 'ts',
      directory: './src/database/migrations',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      extension: 'ts',
      directory: './src/database/migrations',
    },
  },
} as Knex.Config 