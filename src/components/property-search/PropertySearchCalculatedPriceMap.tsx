"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { FeatureGroup, MapContainer, Marker, Polygon, PolygonProps, TileLayer } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { IMapItem } from "@/types/map";
import { Fragment } from "react";
import { ISearchPropertyCalculatePriceResponse } from "@/types/property";

interface IMap {
  parcels: ISearchPropertyCalculatePriceResponse["properties"];
  mainParcel: IMapItem;
}

const PropertySearchCalculatedPriceMap = ({ parcels, mainParcel }: IMap) => (
  <MapContainer
    preferCanvas
    center={mainParcel.geometry.coordinates as any}
    zoom={16}
    scrollWheelZoom
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <FeatureGroup pathOptions={{ color: "green" }}>
      {/* {parcels?.map((parcel) => (
        <Fragment key={Math.random()}>
          <Polygon stroke key={Math.random()} fillColor="blue" positions={[parcel.lat as any, parcel.lng as any]} />
          <Marker position={[parcel.lat as any, parcel.lng as any]} />
        </Fragment>
      ))} */}
    </FeatureGroup>
  </MapContainer>
);

export default PropertySearchCalculatedPriceMap;
