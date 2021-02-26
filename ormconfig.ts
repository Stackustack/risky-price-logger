import { ConnectionOptions, DatabaseType } from 'typeorm'

const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASS,
    DATABASE_NAME,
  } = process.env;

const postgresDatabase: DatabaseType = 'postgres';
const connectionOptions: ConnectionOptions = {
    type: postgresDatabase,
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    username: DATABASE_USER,
    password: DATABASE_PASS,
    database: DATABASE_NAME,
    entities: [__dirname + './../**/*.entity.{js, ts}'],
    synchronize: true,
  };

export = connectionOptions