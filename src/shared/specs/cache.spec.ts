import { Cache } from "shared/classes/cache";
import { GameFlags } from "shared/flags";

export = () => {
  const updater_function = async () => {
    return math.random(0, 10);
  };

  describe("Cache methods", () => {
    describe("Cache::needsUpdate", () => {
      it("should return true if it reaches expiry threshold", () => {
        const cache = new Cache("Test", updater_function);

        // wait for the maximum threshold
        task.wait(GameFlags.CacheExpiryThreshold);

        expect(cache.needsUpdate()).be.equal(true);
      });

      it("should return false if it doesn't reaches the expiry threshold", () => {
        let do_wait_update = false;
        const cache = new Cache("Test", async () => {
          if (do_wait_update) task.wait(5);
          return false;
        });

        do_wait_update = true;
        cache.updateValue();
        task.wait(1);

        expect(cache.needsUpdate()).be.equal(false);
      });
    });

    describe("Cache::forceSetValue", () => {
      it("should return an expected result after calling it", () => {
        const cache = new Cache("Test", async () => "Yes");
        task.wait();

        // force to set a value
        cache.forceSetValue("No");
        expect(cache.getValue()).be.equal("No");
      });
    });
  });
};
