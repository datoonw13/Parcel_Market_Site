"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { FeatureGroup, MapContainer, Marker, Polygon, PolygonProps, Popup, TileLayer } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { IMapItem } from "@/types/map";
import { Fragment } from "react";
import { ISearchPropertyCalculatePriceResponse } from "@/types/property";

interface IMap {
  parcels: ISearchPropertyCalculatePriceResponse["properties"];
  mainParcel: IMapItem;
}

const markerIcon = new Icon({
  iconUrl: "/marker.svg",
  iconSize: [35, 35], // size of the icon
});

const markerIconRed = new Icon({
  iconUrl: "/marker-red.svg",
  iconSize: [35, 35], // size of the icon
});

const markerIconGreen = new Icon({
  iconUrl: "/markerGreen.svg",
  iconSize: [35, 35], // size of the icon
});

const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const PropertySearchCalculatedPriceMap = ({ parcels, mainParcel }: IMap) => {
  console.log(mainParcel);

  return (
    <MapContainer
      preferCanvas
      center={[Number(mainParcel.properties.fields.lat), Number(mainParcel.properties.fields.lon)]}
      zoom={8}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup pathOptions={{ color: "green" }}>
        <Polygon stroke key={Math.random()} fillColor="blue" positions={mainParcel.geometry.coordinates} />
        <Marker icon={markerIconGreen} position={[Number(mainParcel.properties.fields.lat), Number(mainParcel.properties.fields.lon)]}>
          <Popup>
            Parcel number: <b>#{mainParcel.properties.fields.parcelnumb}</b>
          </Popup>
        </Marker>
      </FeatureGroup>
      <FeatureGroup pathOptions={{ color: "green" }}>
        {parcels?.map((parcel) => (
          <Fragment key={Math.random()}>
            {/* <Polygon stroke key={Math.random()} fillColor="blue" positions={[parcel.lat as any, parcel.lng as any]} /> */}
            <Marker position={[parcel.lat as any, parcel.lng as any]}>
              <Popup>
                <div>
                  Owner: <b>{parcel.owner}</b>
                </div>
                <div>
                  Arcage: <b>#{parcel.arcage}</b>
                </div>
                <div>
                  Last Sale Date: <b>{parcel.lastSalesDate}</b>
                </div>
                <div>
                  Last Sale Price: <b>{formatter.format(parcel.lastSalesPrice)}</b>
                </div>
              </Popup>
            </Marker>
          </Fragment>
        ))}
      </FeatureGroup>
    </MapContainer>
  );
};

export default PropertySearchCalculatedPriceMap;
