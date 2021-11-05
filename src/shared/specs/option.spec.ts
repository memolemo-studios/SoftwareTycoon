import { Option } from "@rbxts/rust-classes";
import OptionUtil from "shared/util/option";

export = () => {
	describe("combine", () => {
		it("should return Option::None properly", () => {
			const a = Option.some(10);
			const b = Option.none();
			expect(OptionUtil.combine(a, b).isNone()).to.equal(true);

			const c = Option.none();
			const d = Option.some(20);
			expect(OptionUtil.combine(c, d).isNone()).to.equal(true);

			const e = Option.none();
			const f = Option.none();
			expect(OptionUtil.combine(e, f).isNone()).to.equal(true);
		});

		it("should return Option::Some properly", () => {
			const a = Option.some(20);
			const b = Option.some(10);
			expect(OptionUtil.combine(a, b).isSome()).to.equal(true);
		});
	});
};
