export interface ISearchPropertyCalculatePrice extends ISearchPropertyInfo, ISearchPropertyAbout {}

export interface ISearchPropertyCalculatePriceResponse {
  state: string;
  county: string;
  parcelNumber: string;
  waterFeature: boolean;
  waterFront: boolean;
  langCoverType: string;
  propertyCondition: string;
  wetProperty: string;
  propertyRestriction: string;
  propertyAccess: string;
  improvementsValue: number;
  price: number;
  name_owner: string;
  user_id: string | null;
  legalDescription: string | null;
  apiOwnerName: string | null;
  lotSize: string | null;
  salePrice: string | null;
  saleYear: string | null;
  id: number;
  dateCreated: Date;
  range: {
    min: number;
    max: number;
  };
}

export interface ISearchPropertyInfo {
  owner: string | null;
  state: string | null;
  county: string | null;
  parcelNumber: string | null;
}

export interface ISearchPropertyAbout {
  waterFeature: boolean | null;
  waterFront: boolean | null;
  langCoverType: string | null;
  propertyCondition: string | null;
  wetProperty: string | null;
  propertyRestriction: string | null;
  propertyAccess: string | null;
  improvementsValue: number | null;
}

export interface ISearchProperty {
  info: ISearchPropertyInfo;
  found: {
    parcelNumber: string | null;
  };
  about: ISearchPropertyAbout;
}
