import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

createConnection({
  type: 'mysql',
  host: '172.17.0.2',
  port: 3306,
  username: 'root',
  password: 'docker',
  database: 'jif',
  entities: ['./src/models/*.ts'],
  migrations: ['./src/database/migrations/*.ts'],
  cli: {
    migrationsDir: './src/database/migrations/',
  },
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});
