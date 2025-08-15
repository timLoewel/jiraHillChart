import { beforeAll } from 'vitest';
import Database from 'better-sqlite3';

let setupDone = false;

beforeAll(() => {
	if (setupDone) {
		return;
	}

	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set');
	}
	const sqlite = new Database(process.env.DATABASE_URL);
	sqlite.exec(`DROP TABLE IF EXISTS session;`);
	sqlite.exec(`DROP TABLE IF EXISTS user;`);
	sqlite.exec(`
        CREATE TABLE user (
            id TEXT PRIMARY KEY,
            age INTEGER,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            jira_api_key TEXT
        );
    `);
	sqlite.exec(`
        CREATE TABLE session (
            id TEXT PRIMARY KEY,
            userId TEXT NOT NULL REFERENCES user(id),
            expires_at INTEGER NOT NULL
        );
    `);
	setupDone = true;
});
