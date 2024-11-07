import { IBulkPropertiesUsedForCalculation, IMainPropertyBaseInfo, IPropertyPricePerAcre, IPropertyUsedForCalculation } from "./property";

export type IUserRecentSearches = IMainPropertyBaseInfo &
  IPropertyPricePerAcre & {
    propertiesUsedForCalculation: (IPropertyUsedForCalculation | IBulkPropertiesUsedForCalculation)[];
    price: number;
    createdAt: Date;
  };
