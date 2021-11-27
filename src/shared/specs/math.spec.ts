import { MathUtil } from "shared/utils/math";

export = () => {
  describe("MathUtil.lerp", () => {
    it("must have correct values from low start to high end", () => {
      const condition_1 = MathUtil.lerp(0, 1, 0.5);
      expect(condition_1).be.equal(0.5);

      const condition_2 = MathUtil.lerp(2, 10, 0.5);
      expect(condition_2).be.equal(6);
    });

    it("must have correct values from high start to low end", () => {
      const condition_1 = MathUtil.lerp(1, 0, 0.5);
      expect(condition_1).be.equal(0.5);

      const condition_2 = MathUtil.lerp(10, 2, 0.5);
      expect(condition_2).be.equal(6);
    });
  });
};
