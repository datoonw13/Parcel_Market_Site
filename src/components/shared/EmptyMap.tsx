"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { IMap, IMapItem } from "@/types/map";

const EmptyMap = () => (
  <MapContainer preferCanvas center={[51.508045, -0.128217]} zoom={10} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  </MapContainer>
);

export default EmptyMap;
