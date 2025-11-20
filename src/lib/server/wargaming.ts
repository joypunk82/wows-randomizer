import { WARGAMING_APP_ID } from '$env/static/private';

export interface WargamingShip {
	ship_id: number;
	name: string;
	tier: number;
	type: string;
	nation: string;
	is_premium: boolean;
	is_special: boolean;
	// Battle statistics (optional, from player's account data)
	battles?: number;
	wins?: number;
	damage_dealt?: number;
	xp?: number;
	frags?: number;
	survived_battles?: number;
	last_battle_time?: number;
}

export interface AccountShip {
	ship_id: number;
	last_battle_time?: number;
	account_id?: number;
	battles?: number;
	wins?: number;
	damage_dealt?: number;
	xp?: number;
	frags?: number;
	survived_battles?: number;
	private?: {
		in_garage?: boolean;
		battle_life_time?: number;
	};
	[key: string]: any; // Allow additional properties
}

/**
 * Get the OAuth login URL
 */
export function getLoginUrl(redirectUri: string, region: string): string {
	const params = new URLSearchParams({
		application_id: WARGAMING_APP_ID,
		redirect_uri: redirectUri,
		display: 'page'
		// Note: We need full OAuth access to retrieve private ship data (in_garage status)
		// This is required by Wargaming's API to see which ships are in your port
	});
	
	return `https://api.worldoftanks.${region}/wot/auth/login/?${params.toString()}`;
}

/**
 * Exchange access token for account info
 */
export async function getAccountInfo(accessToken: string, region: string): Promise<{
	account_id: string;
	nickname: string;
} | null> {
	const params = new URLSearchParams({
		application_id: WARGAMING_APP_ID,
		access_token: accessToken
	});
	
	const apiBaseUrl = `https://api.worldofwarships.${region}`;
	const response = await fetch(`${apiBaseUrl}/wows/account/info/?${params.toString()}`);
	const data = await response.json();
	
	if (data.status === 'ok' && data.data) {
		const accountId = Object.keys(data.data)[0];
		const accountData = data.data[accountId];
		
		return {
			account_id: accountId,
			nickname: accountData.nickname
		};
	}
	
	return null;
}

/**
 * Get player's ships from their account
 */
export async function getPlayerShips(accountId: string, accessToken: string, region: string): Promise<AccountShip[]> {
	const params = new URLSearchParams({
		application_id: WARGAMING_APP_ID,
		access_token: accessToken,
		account_id: accountId
	});
	
	const apiBaseUrl = `https://api.worldofwarships.${region}`;
	const url = `${apiBaseUrl}/wows/ships/stats/?${params.toString()}`;
	
	const response = await fetch(url);
	const data = await response.json();
	
	if (data.status === 'ok' && data.data && data.data[accountId]) {
		// Flatten the pvp stats to the root level but preserve private object
		return data.data[accountId].map((ship: any) => ({
			ship_id: ship.ship_id,
			last_battle_time: ship.last_battle_time,
			private: ship.private, // Keep the private object with in_garage flag
			battles: ship.pvp?.battles,
			wins: ship.pvp?.wins,
			damage_dealt: ship.pvp?.damage_dealt,
			xp: ship.pvp?.xp,
			frags: ship.pvp?.frags,
			survived_battles: ship.pvp?.survived_battles
		}));
	}
	
	return [];
}

/**
 * Get encyclopedia data for ships
 */
export async function getShipsEncyclopedia(region: string, shipIds?: number[]): Promise<Record<string, WargamingShip>> {
	const apiBaseUrl = `https://api.worldofwarships.${region}`;
	const params = new URLSearchParams({
		application_id: WARGAMING_APP_ID,
		fields: 'ship_id,name,tier,type,nation,is_premium,is_special'
	});
	
	// If no ship IDs provided, fetch all (though this might be a lot of data)
	if (!shipIds || shipIds.length === 0) {
		const url = `${apiBaseUrl}/wows/encyclopedia/ships/?${params.toString()}`;
		
		const response = await fetch(url);
		const data = await response.json();
		
		if (data.status === 'ok' && data.data) {
			return data.data;
		}
		
		return {};
	}
	
	// Batch requests to avoid URL length limits (max ~100 ships per request)
	const batchSize = 100;
	const allShips: Record<string, WargamingShip> = {};
	
	for (let i = 0; i < shipIds.length; i += batchSize) {
		const batch = shipIds.slice(i, i + batchSize);
		const batchParams = new URLSearchParams({
			application_id: WARGAMING_APP_ID,
			fields: 'ship_id,name,tier,type,nation,is_premium,is_special',
			ship_id: batch.join(',')
		});
		
		const url = `${apiBaseUrl}/wows/encyclopedia/ships/?${batchParams.toString()}`;
		
		const response = await fetch(url);
		const data = await response.json();
		
		if (data.status === 'ok' && data.data) {
			Object.assign(allShips, data.data);
		}
	}
	
	return allShips;
}
