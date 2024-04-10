export interface IFindPropertyInfo {
  owner: string | null;
  state: string | null;
  county: string | null;
  parcelNumber: string | null;
}

export interface IFindPropertyAbout {
  waterFeature: boolean;
  waterFront: boolean;
  langCoverType: string;
  propertyCondition: string;
  wetProperty: string;
  propertyRestriction: string;
  propertyAccess: string;
  improvementsValue: number;
}

export interface ICalculatePrice extends IFindPropertyInfo, IFindPropertyAbout {
  apiOwnerName: string | null;
  dateCreated: Date;
  id: number;
  lotSize: string | null;
  price: number;
  salePrice: number | null;
  saleYear: Date | null;
  user_id: string | null;
}
