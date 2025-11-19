import { WARGAMING_APP_ID, WARGAMING_REGION } from '$env/static/private';

const API_BASE_URL = `https://api.worldofwarships.${WARGAMING_REGION}`;

export interface WargamingShip {
	ship_id: number;
	name: string;
	tier: number;
	type: string;
	nation: string;
	is_premium: boolean;
	is_special: boolean;
}

export interface AccountShip {
	ship_id: number;
	last_battle_time?: number;
	account_id?: number;
	battles?: number;
	private?: {
		in_garage?: boolean;
		battle_life_time?: number;
	};
	[key: string]: any; // Allow additional properties
}

/**
 * Get the OAuth login URL
 */
export function getLoginUrl(redirectUri: string): string {
	const params = new URLSearchParams({
		application_id: WARGAMING_APP_ID,
		redirect_uri: redirectUri,
		display: 'page'
	});
	
	return `https://api.worldoftanks.${WARGAMING_REGION}/wot/auth/login/?${params.toString()}`;
}

/**
 * Exchange access token for account info
 */
export async function getAccountInfo(accessToken: string): Promise<{
	account_id: string;
	nickname: string;
} | null> {
	const params = new URLSearchParams({
		application_id: WARGAMING_APP_ID,
		access_token: accessToken
	});
	
	const response = await fetch(`${API_BASE_URL}/wows/account/info/?${params.toString()}`);
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
export async function getPlayerShips(accountId: string, accessToken: string): Promise<AccountShip[]> {
	const params = new URLSearchParams({
		application_id: WARGAMING_APP_ID,
		access_token: accessToken,
		account_id: accountId
	});
	
	const url = `${API_BASE_URL}/wows/ships/stats/?${params.toString()}`;
	
	const response = await fetch(url);
	const data = await response.json();
	
	if (data.status === 'ok' && data.data && data.data[accountId]) {
		return data.data[accountId];
	}
	
	return [];
}

/**
 * Get encyclopedia data for ships
 */
export async function getShipsEncyclopedia(shipIds?: number[]): Promise<Record<string, WargamingShip>> {
	const params = new URLSearchParams({
		application_id: WARGAMING_APP_ID,
		fields: 'ship_id,name,tier,type,nation,is_premium,is_special'
	});
	
	// If no ship IDs provided, fetch all (though this might be a lot of data)
	if (!shipIds || shipIds.length === 0) {
		const url = `${API_BASE_URL}/wows/encyclopedia/ships/?${params.toString()}`;
		
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
		
		const url = `${API_BASE_URL}/wows/encyclopedia/ships/?${batchParams.toString()}`;
		
		const response = await fetch(url);
		const data = await response.json();
		
		if (data.status === 'ok' && data.data) {
			Object.assign(allShips, data.data);
		}
	}
	
	return allShips;
}
