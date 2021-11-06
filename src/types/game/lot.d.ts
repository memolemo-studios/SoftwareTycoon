export interface LotModel extends Model {
	Primary: Part;
	FilteredArea: BasePart;
}

export interface LotAttributes {
	Owner?: number;
	Id?: string;
}
