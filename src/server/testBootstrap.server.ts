import { RunService } from "@rbxts/services";
import { TestBootstrap } from "@rbxts/testez";
import { $ifEnv } from "rbxts-transform-env";
import { $instance } from "rbxts-transformer-fs";

function perform_bootstrap() {
  if (RunService.IsStudio()) {
    TestBootstrap.run([$instance<Folder>("src/shared/specs")]);
  }
}

$ifEnv("UNIT_TEST", "true", () => perform_bootstrap());
