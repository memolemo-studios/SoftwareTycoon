import { Option } from "@rbxts/rust-classes";
import { Deserialize, Serialize, SerTypes } from "shared/replication/serialize";

export = () => {
	describe("Ser.Option types", () => {
		it("should accept 'Some' type option", () => {
			expect(() => {
				assert(
					SerTypes.Option({
						type: "Some",
						value: "foo",
					}),
				);
			}).never.throw();
		});

		it("should accept 'None' type option", () => {
			expect(() => assert(SerTypes.Option({ type: "None" }))).never.throw();
		});

		it("should throw if it is an invalid serialized option", () => {
			expect(() => {
				assert(
					SerTypes.Option({
						type: "Oo",
						value: "fizz",
					}),
				);
			}).to.throw();
		});

		it("should throw if value is defined and the type is 'Some'", () => {
			expect(() => {
				assert(SerTypes.Option({ type: "Some" }));
			}).to.throw();
		});

		it("should throw if value is nil and the type is 'None'", () => {
			expect(() => {
				assert(
					SerTypes.Option({
						type: "None",
						value: 23383289,
					}),
				);
			}).to.throw();
		});
	});

	describe("Ser.Option serialize", () => {
		it("should return exact value of serialized option", () => {
			const res = Option.some(123);
			expect(Serialize.option(res)).to.equal({
				type: "Some",
				value: 123,
			});
		});

		it("should return type 'Some' if option is some", () => {
			const res = Option.some("yep");
			expect(Serialize.option(res).type).to.equal("Some");
		});

		it("should return type 'None' if option is none", () => {
			const res = Option.none();
			expect(Serialize.option(res).type).to.equal("None");
		});
	});

	describe("Ser.Option deserialize", () => {
		it("should successfully deserialize serialized option", () => {
			expect(() => {
				Deserialize.option({
					type: "Some",
					value: "idk",
				});
			}).never.throw();
			expect(() => {
				Deserialize.option({ type: "None" });
			}).never.throw();
		});

		it("should returned 'Option' class with successful serialized option", () => {
			expect(Deserialize.option({ type: "Some", value: "idk" }) instanceof Option).to.equal(true);
			expect(Deserialize.option({ type: "None" }) instanceof Option).to.equal(true);
		});

		it("should correctly set to specific 'Some' or 'None' type", () => {
			expect(() => Deserialize.option({ type: "Some", value: "idk" }).isSome()).to.equal(true);
			expect(() => Deserialize.option({ type: "None" }).isNone()).to.equal(true);
			expect(() => Deserialize.option({ type: "Some", value: "idk" }).isNone()).to.equal(false);
			expect(() => Deserialize.option({ type: "None" }).isSome()).to.equal(false);
		});
	});
};
