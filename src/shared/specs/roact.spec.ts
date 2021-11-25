/// <reference types="@rbxts/testez/globals" />

import Roact from "@rbxts/roact";
import { RoactUtil } from "shared/utils/roact";

export = () => {
  describe("RoactUtil.isBinding", () => {
    it("must returns true if it is a true Roact binding", () => {
      const binding = Roact.createBinding(10);
      expect(RoactUtil.isBinding(binding)).be.equal(true);
    });

    it("must returns false if it is not Roact binding", () => {
      expect(RoactUtil.isBinding("123")).be.equal(false);
    });
  });
};
