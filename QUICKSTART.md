# Quick Start Guide

## 1. Start PostgreSQL

```bash
docker compose up -d
```

## 2. Install dependencies (if not already done)

```bash
npm install
```

## 3. Run the reproduction test

```bash
npm test
```

## What the test demonstrates

The test runs a migration that creates `user` and `post` tables with the schema configuration set to `test123`.

### Expected behavior:

- All tables (`user`, `post`) should be created in `test123` schema
- Migration metadata table should be in `test123` schema

### Actual behavior (BUG):

- Migration metadata table IS correctly created in `test123` schema
- Tables (`user`, `post`) ARE INCORRECTLY created in `public` schema

## Cleaning up

```bash
docker compose down -v
```
