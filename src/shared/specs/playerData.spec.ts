import { DEFAULT_PLAYER_DATA, PlayerDataCheck } from "shared/definitions/game";
import { migratePlayerData } from "shared/functions/migratePlayerData";

export = () => {
  describe("Player data migration", () => {
    it("must be converted from v0 to v1", () => {
      // create v0 data
      const old_data = {
        Version: 0,
        Settings: `{ "Message": "Hello world!" }`,
      };
      const [success, new_data] = migratePlayerData(old_data, 1);
      expect(success).be.equal(true);
      expect(PlayerDataCheck(new_data)).be.equal(true);
    });

    it("must not convert to the same version", () => {
      // create v1 data
      // REMINDER: Swap this after v2 is coming out
      const data = { ...DEFAULT_PLAYER_DATA };
      const [success, new_data] = migratePlayerData(data, 1);
      expect(success).be.equal(false);
      expect(PlayerDataCheck(new_data)).be.equal(true);
      expect(new_data === data).be.equal(true);
    });
  });
};
