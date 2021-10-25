import { filterMap } from "shared/util/map";

export = () => {
	describe("filterMap", () => {
		it("should filter maps properly", () => {
			const collection = new Map<string, "A" | "B" | "C">();
			const filtered = filterMap(collection, (v): v is "B" => {
				return v === "B";
			});

			expect(!filtered.has("A")).equal(true);
			expect(!filtered.has("C")).equal(true);
			expect(filtered.has("B")).equal(true);
		});
	});
};
