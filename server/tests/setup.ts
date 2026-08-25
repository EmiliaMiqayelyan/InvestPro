process.env.NODE_ENV = "test";
process.env.DB_DIALECT = "sqlite";
process.env.DB_STORAGE = ":memory:";
process.env.DB_SYNC = "true";
process.env.JWT_SECRET = "test-secret-key-for-vitest";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.LOG_LEVEL = "silent";
