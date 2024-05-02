"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { FeatureGroup, MapContainer, Marker, Polygon, PolygonProps, TileLayer } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { IMapItem } from "@/types/map";
import { Fragment } from "react";

interface IMap {
  center: LatLngExpression;
  polygons: PolygonProps["positions"][];
}

const SharedMap = ({ center, polygons }: IMap) => (
  <MapContainer preferCanvas center={center} zoom={16} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <FeatureGroup pathOptions={{ color: "green" }}>
      {polygons?.map((polygon) => (
        <Fragment key={Math.random()}>
          <Polygon stroke key={Math.random()} fillColor="blue" positions={polygon} />
          <Marker position={center} />
        </Fragment>
      ))}
    </FeatureGroup>
  </MapContainer>
);

export default SharedMap;
