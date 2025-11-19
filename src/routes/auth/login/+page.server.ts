import { redirect } from '@sveltejs/kit';
import { getLoginUrl } from '$lib/server/wargaming';

export const load = async ({ url }: { url: URL }) => {
	const redirectUri = `${url.origin}/auth/callback`;
	const loginUrl = getLoginUrl(redirectUri);
	
	throw redirect(302, loginUrl);
};
