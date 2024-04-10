"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, TileLayer, Polygon, FeatureGroup, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { IMap } from "@/types/map";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../shared/Button";

interface IMapProps {
  data: IMap;
  selectedParcelNumber: string | null;
  handleParcelSelect: (parcelNumber: string) => void;
}

const markerIcon = new Icon({
  iconUrl: "/marker.svg",
  iconSize: [35, 35], // size of the icon
});

const markerIconRed = new Icon({
  iconUrl: "/marker-red.svg",
  iconSize: [35, 35], // size of the icon
});

const Map = ({ data, handleParcelSelect, selectedParcelNumber }: IMapProps) => (
  <MapContainer
    preferCanvas
    center={[Number(data[0].properties.fields.lat), Number(data[0].properties.fields.lon)]}
    zoom={10}
    scrollWheelZoom
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <FeatureGroup pathOptions={{ color: "green" }}>
      {data?.map((x) => (
        <>
          <Polygon stroke key={Math.random()} fillColor="blue" positions={x.geometry.coordinates} />
          <Marker
            icon={selectedParcelNumber === x.properties.fields.parcelnumb ? markerIconRed : markerIcon}
            position={[Number(x.properties.fields.lat), Number(x.properties.fields.lon)]}
          >
            <Popup>
              Parcel number: <b>#{x.properties.fields.parcelnumb}</b>
              <Button
                classNames="py-2 mt-6 ml-auto"
                disabled={selectedParcelNumber === x.properties.fields.parcelnumb}
                onClick={() => handleParcelSelect(x.properties.fields.parcelnumb)}
              >
                {selectedParcelNumber === x.properties.fields.parcelnumb ? "Selected" : "Select"}
              </Button>
            </Popup>
          </Marker>
        </>
      ))}
    </FeatureGroup>
  </MapContainer>
);

export default Map;
