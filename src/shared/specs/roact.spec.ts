/// <reference types="@rbxts/testez/globals" />

import { Instant, SingleMotor } from "@rbxts/flipper";
import Roact from "@rbxts/roact";
import { RoactUtil } from "shared/utils/roact";

export = () => {
  describe("RoactUtil.isBinding", () => {
    it("must returns true if it is a true Roact binding", () => {
      const [binding] = Roact.createBinding(10);
      expect(RoactUtil.isBinding(binding)).be.equal(true);
    });

    it("must returns false if it is not Roact binding", () => {
      expect(RoactUtil.isBinding("123")).be.equal(false);
    });
  });

  describe("RoactUtil.getBindableValue", () => {
    const [bindable, set_bindable] = Roact.createBinding(10);
    const non_bindable = 20;

    it("should get the value if it is a Roact binding", () => {
      expect(RoactUtil.getBindableValue(bindable)).be.equal(10);

      set_bindable(20);
      expect(RoactUtil.getBindableValue(bindable)).be.equal(20);
    });

    it("should get the value if it is a non-Roact binding", () => {
      const value = RoactUtil.getBindableValue(non_bindable);
      expect(value).be.equal(20);
    });
  });
};
