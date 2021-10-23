export function combineStringConstant<A extends string, B extends string>(a: A, b: B): `${A}${B}` {
	return `${a}${b}`;
}
