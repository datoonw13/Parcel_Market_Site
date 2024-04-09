"use client";

/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable global-require */

// START: Preserve spaces to avoid auto-sorting
import "leaflet/dist/leaflet.css";

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import "leaflet-defaulticon-compatibility";
// END: Preserve spaces to avoid auto-sorting
import { MapContainer, Marker, TileLayer, Polygon, FeatureGroup } from "react-leaflet";
import { IMap } from "@/types/map";

const Map = ({ data }: { data?: IMap }) =>
  data && (
    <MapContainer preferCanvas center={[39.817358, -86.251818]} zoom={3} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup pathOptions={{ color: "green" }}>
        {data.map((x) => (
          <>
            <Polygon stroke key={Math.random()} fillColor="blue" positions={x as any} />
            <Marker position={x.geometry.coordinates[0][0] as any} />
          </>
        ))}
      </FeatureGroup>
    </MapContainer>
  );

export default Map;
