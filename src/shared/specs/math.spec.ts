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
