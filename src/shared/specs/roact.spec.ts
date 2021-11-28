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
    const bindable = Roact.createBinding(10);
    const non_bindable = 20;

    it("should get the value if it is a Roact binding", () => {
      const value = RoactUtil.getBindableValue(bindable);
      expect(value).be.equal(10);
    });

    it("should get the value if it is a non-Roact binding", () => {
      const value = RoactUtil.getBindableValue(non_bindable);
      expect(value).be.equal(20);
    });
  });

  describe("RoactUtil.makeBindingFromMotor", () => {
    it("should create binding from motor", () => {
      const motor = new SingleMotor(0);
      const binding = RoactUtil.makeBindingFromMotor(motor);

      // binding test
      expect(RoactUtil.isBinding(binding)).be.equal(true);
      expect(RoactUtil.getBindableValue(binding)).be.equal(0);

      // if the binding can keep up with the motor
      motor.setGoal(new Instant(1));
      motor.step(1);

      expect(RoactUtil.getBindableValue(binding)).be.equal(1);
    });
  });
};
