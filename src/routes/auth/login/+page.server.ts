import { redirect, type Actions } from '@sveltejs/kit';
import { getLoginUrl } from '$lib/server/wargaming';

export const actions: Actions = {
	default: async ({ request, url, cookies }) => {
		const formData = await request.formData();
		const region = formData.get('region') as string || 'com';
		
		// Store region in a temporary cookie for the OAuth callback
		cookies.set('wows_region', region, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 10 // 10 minutes
		});
		
		const redirectUri = `${url.origin}/auth/callback`;
		const loginUrl = getLoginUrl(redirectUri, region);
		
		throw redirect(302, loginUrl);
	}
};

// Keep the GET handler for backwards compatibility (defaults to 'com')
export const load = async ({ url, cookies }: { url: URL, cookies: any }) => {
	const region = 'com'; // Default region
	
	cookies.set('wows_region', region, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 10
	});
	
	const redirectUri = `${url.origin}/auth/callback`;
	const loginUrl = getLoginUrl(redirectUri, region);
	
	throw redirect(302, loginUrl);
};
