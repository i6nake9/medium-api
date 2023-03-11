import 'reflect-metadata';
import { DataSource } from 'typeorm';

 = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'qwerty',
  database: 'mediumclone',
  synchronize: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js'],
  subscribers: [],
});
