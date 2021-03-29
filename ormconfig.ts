const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_NAME,
} = process.env;

let config = {
  type: 'postgres',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  username: DATABASE_USER,
  password: DATABASE_PASS,
  database: DATABASE_NAME,
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: true,
  ssl: (process.env.NODE_ENV == 'development') ? null : { rejectUnauthorized: false }
};

module.exports = config;