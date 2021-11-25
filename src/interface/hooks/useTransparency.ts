import { useContext } from "@rbxts/roact-hooked";
import { TransparencyContext } from "interface/components/common/context/transparency";

/**
 * A custom roact-hooked hook where it uses TransparencyContext
 * to get the current transparency based on the context itself
 */
export function useTransparency() {
  return useContext(TransparencyContext);
}
