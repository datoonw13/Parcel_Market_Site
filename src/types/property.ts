export interface IFindPropertyInfo {
  name_owner: string;
  state: string;
  county: string;
  parcelNumber: string;
}

export interface IFindPropertyAbout {
  waterFeature: boolean;
  waterFront: boolean;
  langCoverType: string;
  propertyCondition: string;
  wetProperty: string;
  propertyRestriction: string;
  propertyAccess: string;
  improvementsValue?: string;
}
