export interface IFindPropertyInfo {
  type: "fullName" | "entityName" | "parcelNumber";
  firstName: string | null;
  lastName: string | null;
  entityName: string | null;
  parcelNumber: string | null;
  state: string | null;
  county: string | null;
}

export interface IFindPropertyAbout {
  waterFeature: boolean | null;
  waterFront: boolean | null;
  langCoverType: string | null;
  propertyCondition: string | null;
  wetProperty: string | null;
  propertyRestriction: string | null;
  propertyAccess: string | null;
  improvementsValue: number | null;
  agreement: boolean;
}

export interface IRegridReq {
  state: string;
  county: string;
  owner?: string;
  parcelNumber?: string;
}
