import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/session';

export const load = async ({ cookies, setHeaders }: { cookies: any; setHeaders: any }) => {
	deleteSession(cookies);
	
	// Prevent caching
	setHeaders({
		'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
		'pragma': 'no-cache',
		'expires': '0'
	});
	
	throw redirect(303, '/');
};
