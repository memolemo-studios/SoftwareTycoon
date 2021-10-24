import { PlayerDataErrors } from "./dataErrors";
import { LotRequestErrors } from "./lotErrors";
import { RemoteRequestErrors } from "./remote";

export type AnyGameErrors = PlayerDataErrors | RemoteRequestErrors | LotRequestErrors;
