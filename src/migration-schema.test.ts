import { MikroORM, type Options } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

let orm: MikroORM;

const config: Options = {
  dbName: 'testdb',
  host: 'localhost',
  port: 54321,
  user: 'testuser',
  password: 'testpass',
  entities: [],
  discovery: { warnWhenNoEntities: false },
  schema: 'test123',
  debug: true,
  extensions: [Migrator],
  migrations: {
    path: './migrations',
    transactional: true,
    disableForeignKeys: false,
  },
};

beforeAll(async () => {
  orm = await MikroORM.init(config);

  const connection = orm.em.getConnection();

  await connection.execute('DROP SCHEMA IF EXISTS test123 CASCADE');
  await connection.execute('DROP SCHEMA IF EXISTS public CASCADE');
  await connection.execute('CREATE SCHEMA public');
  await connection.execute('CREATE SCHEMA test123');
});

afterAll(async () => {
  await orm?.close(true);
});

test('migration is run in test123 schema', async () => {
  const connection = orm.em.getConnection();

  await orm.migrator.up();

  const tables = await connection.execute<
    { table_schema: string; table_name: string }[]
  >(`
    SELECT table_schema, table_name FROM information_schema.tables
    WHERE table_schema IN ('public', 'test123')
    ORDER BY table_name;
  `);

  const test123Tables = tables
    .filter((r) => r.table_schema === 'test123')
    .map((r) => r.table_name);

  const publicTables = tables
    .filter((r) => r.table_schema === 'public')
    .map((r) => r.table_name);

  expect(test123Tables).toContain('mikro_orm_migrations');
  expect(test123Tables).toContain('user');
  expect(test123Tables).toContain('post');
  expect(publicTables).not.toContain('user');
  expect(publicTables).not.toContain('post');
});
