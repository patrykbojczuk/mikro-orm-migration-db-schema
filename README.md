# MikroORM PostgreSQL Schema Bug Reproduction

This repository reproduces a bug in MikroORM where migrations are executed on the `public` schema instead of the configured non-public schema (e.g., `test123`), while migration metadata is correctly stored in the configured schema.

## Issue Description

When using a PostgreSQL database with a non-public schema configured via the `schema` option in MikroORM configuration:

- **Expected behavior**: Both migrations (table creation/modification) AND migration metadata should be stored in the configured schema (e.g., `test123`)
- **Actual behavior**: Migration metadata is correctly stored in the configured schema, but the actual tables are created in the `public` schema

## Setup

### Prerequisites

- Docker with Compose V2
- Node.js (v18 or higher recommended)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the PostgreSQL container:

```bash
docker compose up -d
```

This will start PostgreSQL on port `54321` with:

- Database: `testdb`
- User: `testuser`
- Password: `testpass`
- Schemas: `public` and `test123` (both created automatically)

3. Wait for the database to be ready:

```bash
docker compose ps
```

### Running the Tests

Run the reproduction test:

```bash
npm test
```

### Expected Test Results

The test will **FAIL** due to the bug, showing:

- Migration metadata table (`mikro_orm_migrations`) is correctly in `test123` schema
- `user` and `post` tables are incorrectly created in `public` schema instead of `test123`

### Cleanup

Stop and remove the PostgreSQL container:

```bash
docker compose down -v
```

## Test Structure

- `migrations/TestMigration.ts` - Migration that creates `user` and `post` tables
- `src/schema-bug-reproduction.test.ts` - Reproduction test that verifies the bug

## Configuration

The key configuration in the test is:

```typescript
{
  schema: 'test123',  // Custom schema
  // ... other config
}
```

This should cause all tables to be created in the `test123` schema, but currently only the migration metadata table respects this setting.
