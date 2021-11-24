import Roact from "@rbxts/roact";
import { pure } from "@rbxts/roact-hooked";
import { usePlayerData } from "client/hooks/usePlayerData";

export const TestDataComponent = pure(() => {
  const data = usePlayerData();
  print(data);
  return <textlabel />;
});
