import { Result } from "@rbxts/rust-classes";
import { Deserialize, Serialize, SerTypes } from "shared/replication/serialize";

export = () => {
	describe("Ser.Result types", () => {
		it("should accept 'Ok' type result", () => {
			expect(() => {
				assert(
					SerTypes.Result({
						type: "Ok",
						value: "foo",
					}),
				);
			}).never.throw();
		});

		it("should accept 'Err' type result", () => {
			expect(() =>
				assert(
					SerTypes.Result({
						type: "Err",
						value: "bar",
					}),
				),
			).never.throw();
		});

		it("should throw if it is an invalid serialized result", () => {
			expect(() => {
				assert(
					SerTypes.Result({
						type: "Oo",
						value: "fizz",
					}),
				);
			}).to.throw();
		});

		it("should throw if value is nil", () => {
			expect(() => {
				assert(
					SerTypes.Result({
						type: "Ok",
						value: undefined,
					}),
				);
			}).to.throw();
		});
	});

	describe("Ser.Result serialize", () => {
		it("should return exact value of serialized result", () => {
			const res = Result.ok(123);
			expect(() => {
				const result = Serialize.result(res);
				assert(result.type === "Ok");
				assert(result.value === 123);
			}).never.throw();
		});

		it("should return type 'Ok' if result is ok", () => {
			const res = Result.ok("yep");
			expect(Serialize.result(res).type).to.equal("Ok");
		});

		it("should return type 'Err' if result is err", () => {
			const res = Result.err("ok");
			expect(Serialize.result(res).type).to.equal("Err");
		});
	});

	describe("Ser.Result deserialize", () => {
		it("should successfully deserialize serialized result", () => {
			expect(() => {
				Deserialize.result({
					type: "Ok",
					value: "idk",
				});
			}).never.throw();
			expect(() => {
				Deserialize.result({
					type: "Err",
					value: "idk",
				});
			}).never.throw();
		});

		it("should returned 'Result' class with successful serialized result", () => {
			expect(Deserialize.result({ type: "Ok", value: "idk" }) instanceof Result).to.equal(true);
			expect(Deserialize.result({ type: "Err", value: "idk" }) instanceof Result).to.equal(true);
		});

		it("should correctly set to specific 'Ok' or 'Err' type", () => {
			expect(Deserialize.result({ type: "Ok", value: "idk" }).isOk()).to.equal(true);
			expect(Deserialize.result({ type: "Err", value: "idk" }).isErr()).to.equal(true);
			expect(Deserialize.result({ type: "Ok", value: "idk" }).isErr()).to.equal(false);
			expect(Deserialize.result({ type: "Err", value: "idk" }).isOk()).to.equal(false);
		});
	});
};
