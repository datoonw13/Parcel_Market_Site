"use client";

/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable global-require */

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

function reverse(arr: any) {
  let leftIndex = 0;
  let rightIndex = arr.length - 1;
  while (leftIndex <= rightIndex) {
    const isMiddle = leftIndex === rightIndex;
    if (Array.isArray(arr[leftIndex])) {
      reverse(arr[leftIndex]);
    }
    // do the same thing for the right side
    // except for in case it's the "middle" value,
    // in which case we would be un-sorting it by
    // doing it twice
    if (Array.isArray(arr[rightIndex]) && !isMiddle) {
      reverse(arr[rightIndex]);
    }

    const temp = arr[leftIndex];
    arr[leftIndex] = arr[rightIndex];
    arr[rightIndex] = temp;
    leftIndex++;
    rightIndex--;
  }

  return arr;
}

const results = data.results.map((item) => item.geometry.coordinates);
const buildings = reverse(data.buildings.map((item) => item.geometry.coordinates));
const zoning = reverse(data.zoning.map((item) => item.geometry.coordinates));

const Map = () =>
  data && (
    <MapContainer preferCanvas center={[39.817358, -86.251818]} zoom={600} scrollWheelZoom style={{ height: "800px", width: "1600px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup pathOptions={{ color: "green" }}>
        {buildings.map((x: any) => (
          <>
            <Polygon stroke key={Math.random()} fillColor="blue" positions={x} />
            <Marker position={x[0][0]} />
          </>
        ))}
        {results.map((x) => (
          <>
            <Polygon stroke key={Math.random()} fillColor="purple" positions={x as any} />
            {/* <Marker position={x[0][0]} /> */}
          </>
        ))}
        {zoning.map((x: any) => (
          <>
            <Polygon stroke key={Math.random()} fillColor="red" positions={x} />
          </>
        ))}
      </FeatureGroup>
    </MapContainer>
  );

export default Map;
