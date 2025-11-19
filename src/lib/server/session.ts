import type { Cookies } from '@sveltejs/kit';

interface SessionData {
	accessToken: string;
	accountId: string;
	nickname: string;
	expiresAt: number;
}

const SESSION_COOKIE_NAME = 'wows_session';

/**
 * Encrypt session data (simple base64 encoding - for production use proper encryption)
 */
function encryptSession(data: SessionData): string {
	const json = JSON.stringify(data);
	return Buffer.from(json).toString('base64');
}

/**
 * Decrypt session data
 */
function decryptSession(encrypted: string): SessionData | null {
	try {
		const json = Buffer.from(encrypted, 'base64').toString('utf-8');
		return JSON.parse(json) as SessionData;
	} catch {
		return null;
	}
}

/**
 * Save session data to an encrypted cookie
 */
export function saveSession(cookies: Cookies, data: SessionData): void {
	const encrypted = encryptSession(data);
	
	cookies.set(SESSION_COOKIE_NAME, encrypted, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});
}

/**
 * Get session data from cookie
 */
export function getSession(cookies: Cookies): SessionData | null {
	const encrypted = cookies.get(SESSION_COOKIE_NAME);
	
	if (!encrypted) {
		return null;
	}
	
	const session = decryptSession(encrypted);
	
	// Check if session is expired
	if (session && session.expiresAt < Date.now()) {
		deleteSession(cookies);
		return null;
	}
	
	return session;
}

/**
 * Delete session cookie
 */
export function deleteSession(cookies: Cookies): void {
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}
