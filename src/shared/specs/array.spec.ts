/// <reference types="@rbxts/testez/globals" />

import ArrayUtil from "shared/util/array";

export = () => {
	describe("getRandomArrayMember", () => {
		it("should get a random member of an array", () => {
			const list = new Array<string>();
			list.push("wow");

			const result = ArrayUtil.getRandomMember(list);
			expect(result.isSome()).to.equal(true);
			expect(result.unwrap()).to.equal("wow");
		});

		it("should show result of Option.None if the array is empty", () => {
			const result = ArrayUtil.getRandomMember([]);
			expect(result.isNone()).to.equal(true);
		});
	});
};
