export interface IFindPropertyInfo {
  type: "fullName" | "entityName" | "parcelNumber";
  firstName: string | null;
  lastName: string | null;
  entityName: string | null;
  parcelNumber: string | null;
  state: string | null;
  county: string | null;
}
