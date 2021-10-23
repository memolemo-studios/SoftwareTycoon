/// <reference types="@rbxts/testez/globals" />

import { RunService } from "@rbxts/services";
import { TestBootstrap } from "@rbxts/testez";
import { $fileContents, $instance, $resolveFile } from "rbxts-transformer-fs";

function performBootstrap() {
	const dotEnvFile = $fileContents("../../.env").split("\n");
	if (dotEnvFile.findIndex(v => v === "UNIT_TEST=true") !== -1) {
		// so that it won't actually go unit testing while in production
		if (RunService.IsStudio()) {
			TestBootstrap.run([$instance("src/shared/specs")]);
		}
	}
}

// rbxts-transform-env broke in typescript 4.4.4
// so here's my temporary solution using my transformer
$resolveFile("../../.env", performBootstrap, () => {});
