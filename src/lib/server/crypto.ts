import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { JIRA_API_ENCRYPTION_KEY } from '$env/static/private';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// Validate encryption key
if (!JIRA_API_ENCRYPTION_KEY) {
	throw new Error('JIRA_API_ENCRYPTION_KEY environment variable is not set');
}

if (JIRA_API_ENCRYPTION_KEY.length !== 64) {
	throw new Error(`JIRA_API_ENCRYPTION_KEY must be 64 characters (32 bytes) hex string, got ${JIRA_API_ENCRYPTION_KEY.length} characters`);
}

try {
	const key = Buffer.from(JIRA_API_ENCRYPTION_KEY, 'hex');
	if (key.length !== 32) {
		throw new Error(`Invalid key length: expected 32 bytes, got ${key.length} bytes`);
	}
} catch (err) {
	throw new Error(`Invalid JIRA_API_ENCRYPTION_KEY: ${err instanceof Error ? err.message : 'Invalid hex string'}`);
}

const key = Buffer.from(JIRA_API_ENCRYPTION_KEY, 'hex');

export function encrypt(text: string): string {
	const iv = randomBytes(IV_LENGTH);
	const cipher = createCipheriv(ALGORITHM, key, iv);
	const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
	const authTag = cipher.getAuthTag();
	return Buffer.concat([iv, authTag, encrypted]).toString('hex');
}

export function decrypt(encryptedText: string): string {
	const data = Buffer.from(encryptedText, 'hex');
	const iv = data.slice(0, IV_LENGTH);
	const authTag = data.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
	const encrypted = data.slice(IV_LENGTH + AUTH_TAG_LENGTH);
	const decipher = createDecipheriv(ALGORITHM, key, iv);
	decipher.setAuthTag(authTag);
	const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
	return decrypted.toString('utf8');
}
