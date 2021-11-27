import { Result } from "@rbxts/rust-classes";
import { ResponseUtil } from "shared/utils/response";

export = () => {
  describe("ResponseUtil.makeFromResult", () => {
    it("should create failed response if Result is in err state", () => {
      const err_result = Result.err(true);
      const response = ResponseUtil.makeFromResult(err_result);
      expect(response.success).be.equal(false);
      expect("reason" in response).be.equal(true);
      expect((response as { reason: unknown }).reason).be.equal(true);
    });

    it("should create successful response if Result is in ok state", () => {
      const ok_result = Result.ok(true);
      const response = ResponseUtil.makeFromResult(ok_result);
      expect(response.success).be.equal(true);
      expect("value" in response).be.equal(true);
      expect((response as { value: unknown }).value).be.equal(true);
    });
  });
};
