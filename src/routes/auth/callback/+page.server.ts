import { redirect } from '@sveltejs/kit';
import { saveSession } from '$lib/server/session';

export const load = async ({ url, cookies }: { url: URL; cookies: any }) => {
	const status = url.searchParams.get('status');
	const accessToken = url.searchParams.get('access_token');
	const expiresAt = url.searchParams.get('expires_at');
	const accountId = url.searchParams.get('account_id');
	const nickname = url.searchParams.get('nickname');
	
	// Check if login was successful
	if (status !== 'ok' || !accessToken || !expiresAt || !accountId || !nickname) {
		throw redirect(302, '/?error=login_failed');
	}
	
	// Save session
	saveSession(cookies, {
		accessToken,
		accountId,
		nickname,
		expiresAt: parseInt(expiresAt) * 1000 // Convert to milliseconds
	});
	
	// Redirect to ships page
	throw redirect(302, '/ships');
};
