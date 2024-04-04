"use client";

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import "leaflet-defaulticon-compatibility";
// END: Preserve spaces to avoid auto-sorting
import { MapContainer, Marker, Popup, TileLayer, Polygon, FeatureGroup } from "react-leaflet";
import { useEffect, useState } from "react";
import { IMap } from "@/types/map";

interface IData {
  type: "Polygon";
  coordinates: Array<string | number>;
}

const data = require("../../public/test.json") as IMap;

console.log(data);

const Map = () =>
  data && (
    <MapContainer preferCanvas center={[39.817358, -86.251818]} zoom={600} scrollWheelZoom style={{ height: "800px", width: "1600px" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup pathOptions={{ color: "green" }}>
        {/* {data?.zoning?.map((el) => (
          <Polygon key={Math.random()} fillColor="red" positions={el.geometry.coordinates.map((item) => item.reverse()) as any} />
        ))}
        {data?.buildings?.map((el) => (
          <Polygon key={Math.random()} fillColor="red" positions={el.geometry.coordinates.map((item) => item.reverse()) as any} />
        ))} */}
        {data?.results?.map((el) => (
          <>
            <Polygon stroke key={Math.random()} fillColor="red" positions={el.geometry.coordinates as any} />
            <Marker position={el.geometry.coordinates[0][0]} />
          </>
        ))}
      </FeatureGroup>
    </MapContainer>
  );

export default Map;
