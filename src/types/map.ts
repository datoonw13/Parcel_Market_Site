import { PolygonProps } from "react-leaflet";

export type IMap = Array<{
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
    };
  };
}>;
