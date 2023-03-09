import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost', // IP adress
  port: 5432,
  username: 'postgres', // You need to change
  password: 'qwerty', // Password to your database
  database: 'mediumclone',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};

export default config;
