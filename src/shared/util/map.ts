export function filterMap<K, V>(map: Map<K, V>, predicate: (value: V, key: K) => boolean): Map<K, V> {
	const new_map = new Map<K, V>();
	for (const [key, value] of map) {
		if (predicate(value, key) === true) {
			new_map.set(key, value);
		}
	}
	return new_map;
}
