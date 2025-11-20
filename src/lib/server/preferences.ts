import { Redis } from '@upstash/redis';
import { KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';

// Initialize Redis client
const redis = new Redis({
	url: KV_REST_API_URL,
	token: KV_REST_API_TOKEN,
});

/**
 * Get user's favorite ships
 */
export async function getFavorites(accountId: string): Promise<number[]> {
	const key = `prefs:${accountId}:favorites`;
	const favorites = await redis.get<number[]>(key);
	return favorites || [];
}

/**
 * Set user's favorite ships
 */
export async function setFavorites(accountId: string, shipIds: number[]): Promise<void> {
	const key = `prefs:${accountId}:favorites`;
	await redis.set(key, shipIds);
}

/**
 * Add a ship to favorites
 */
export async function addFavorite(accountId: string, shipId: number): Promise<number[]> {
	const favorites = await getFavorites(accountId);
	if (!favorites.includes(shipId)) {
		favorites.push(shipId);
		await setFavorites(accountId, favorites);
	}
	return favorites;
}

/**
 * Remove a ship from favorites
 */
export async function removeFavorite(accountId: string, shipId: number): Promise<number[]> {
	const favorites = await getFavorites(accountId);
	const updated = favorites.filter(id => id !== shipId);
	await setFavorites(accountId, updated);
	return updated;
}

/**
 * Get user's blacklisted ships
 */
export async function getBlacklist(accountId: string): Promise<number[]> {
	const key = `prefs:${accountId}:blacklist`;
	const blacklist = await redis.get<number[]>(key);
	return blacklist || [];
}

/**
 * Set user's blacklisted ships
 */
export async function setBlacklist(accountId: string, shipIds: number[]): Promise<void> {
	const key = `prefs:${accountId}:blacklist`;
	await redis.set(key, shipIds);
}

/**
 * Add a ship to blacklist
 */
export async function addBlacklist(accountId: string, shipId: number): Promise<number[]> {
	const blacklist = await getBlacklist(accountId);
	if (!blacklist.includes(shipId)) {
		blacklist.push(shipId);
		await setBlacklist(accountId, blacklist);
	}
	return blacklist;
}

/**
 * Remove a ship from blacklist
 */
export async function removeBlacklist(accountId: string, shipId: number): Promise<number[]> {
	const blacklist = await getBlacklist(accountId);
	const updated = blacklist.filter(id => id !== shipId);
	await setBlacklist(accountId, updated);
	return updated;
}

/**
 * Clear all favorites for a user
 */
export async function clearFavorites(accountId: string): Promise<void> {
	await setFavorites(accountId, []);
}

/**
 * Clear all blacklist for a user
 */
export async function clearBlacklist(accountId: string): Promise<void> {
	await setBlacklist(accountId, []);
}
