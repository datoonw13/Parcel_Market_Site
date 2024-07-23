import { PolygonProps } from "react-leaflet";

export interface IMapItem {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: PolygonProps["positions"];
  };
  properties: {
    fields: {
      parcelnumb: string;
      lon: string;
      lat: string;
      ll_gisacre: number;
      owner: string;
      zoning_description?: string;
      usedesc?: string;
      county: string;
      state2: string;
      parcelnumb_no_formatting: string;
      city: string;
    };
  };
}

export type IMap = Array<IMapItem>;
