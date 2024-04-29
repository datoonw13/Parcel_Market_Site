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
    };
  };
}

export type IMap = Array<IMapItem>;
