import { filterMap } from "shared/util/map";

export = () => {
	describe("filterMap", () => {
		it("should filter maps properly", () => {
			const collection = new Map<string, true>();
			collection.set("A", true);
			collection.set("B", true);
			collection.set("C", true);

			const filtered = filterMap(collection, (_, key) => {
				return key === "B";
			});

			expect(!filtered.has("A")).equal(true);
			expect(!filtered.has("C")).equal(true);
			expect(filtered.has("B")).equal(true);
		});
	});
};
