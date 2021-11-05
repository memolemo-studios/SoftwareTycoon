/// <reference types="@rbxts/testez/globals" />

import MathUtil from "shared/util/math";

export = () => {
	describe("MathUtil.roundToMultiple", () => {
		it("should round to multiple properly", () => {
			const callback = MathUtil.roundToMultiple;
			expect(callback(1, 1)).to.be.equal(1);
			expect(callback(4, 1)).to.be.equal(4);
			expect(callback(4, 3)).to.be.equal(3);
			expect(callback(5.5, 3)).to.be.equal(6);
		});
	});

	describe("MathUtil.floorToMultiple", () => {
		const callback = MathUtil.floorToMultiple;
		expect(callback(0, 4)).to.be.equal(0);
		expect(callback(2, 4)).to.be.equal(0);
		expect(callback(4, 4)).to.be.equal(4);
		expect(callback(4.5, 4)).to.be.equal(4);
	});
};
