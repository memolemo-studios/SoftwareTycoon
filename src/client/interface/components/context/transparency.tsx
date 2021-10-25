import Roact, { createContext } from "@rbxts/roact";
import { OrBinding } from "shared/types/roact";

const TransparencyContext = createContext<OrBinding<number>>(0);

export function withTransparency(callback: (transparency: OrBinding<number>) => Roact.Element) {
	return <TransparencyContext.Consumer render={callback} />;
}

export default TransparencyContext;
