import { getSession } from '$lib/server/session';

export const load = async ({ cookies }: { cookies: any }) => {
	const session = getSession(cookies);
	
	return {
		user: session ? {
			nickname: session.nickname,
			accountId: session.accountId
		} : null
	};
};
