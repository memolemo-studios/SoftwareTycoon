export function filterMap<K, V>(map: Map<K, V>, predicate: (value: V, key: K) => boolean) {
	const newMap = new Map<K, V>();
	for (const [key, value] of map) {
		if (predicate(value, key) === true) {
			newMap.set(key, value);
		}
	}
	return newMap;
}
