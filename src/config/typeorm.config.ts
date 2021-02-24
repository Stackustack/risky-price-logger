import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    // host: "docker.for.mac.host.internal",    // dev docker + local db
    host: "rpl-db",                          // docker-compose db
    // host: "localhost",                       // local db
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'riskypricelogger',
    entities: [__dirname + './../**/*.entity.{js, ts}'],
    synchronize: true,
}