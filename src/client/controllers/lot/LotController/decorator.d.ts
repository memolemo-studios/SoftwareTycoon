import { ClientLot } from "client/components/game/lot";

export interface OnOwnedLot {
	onOwnedLot(newLot: ClientLot): void;
}
