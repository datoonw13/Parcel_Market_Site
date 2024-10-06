import { IMainPropertyBaseInfo, IPropertyPricePerAcre, IPropertyUsedForCalculation } from "./property";

export type IUserRecentSearches = IMainPropertyBaseInfo &
  IPropertyPricePerAcre & {
    propertiesUsedForCalculation: IPropertyUsedForCalculation[];
    price: number;
  };
