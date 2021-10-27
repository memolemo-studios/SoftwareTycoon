import Object from "@rbxts/object-utils";

export function flattenObject<O extends object, D extends object = O>(object: O, depth: number): D {
	if (depth <= 0) return object as unknown as D;
	const new_obj = {} as O;
	for (const [index, value] of Object.entries(object) as [keyof O, O[keyof O]][]) {
		if (typeIs(value, "table")) {
			const flatten = flattenObject(value, depth - 1) as unknown as O[keyof O];
			for (const [i2, v2] of Object.entries(flatten as unknown as object)) {
				new_obj[i2 as keyof O] = v2 as O[keyof O];
			}
		} else {
			new_obj[index as keyof O] = value;
		}
	}
	return new_obj as unknown as D;
}
