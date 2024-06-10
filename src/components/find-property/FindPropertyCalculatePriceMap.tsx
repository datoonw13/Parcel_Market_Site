"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { FeatureGroup, MapContainer, Marker, Polygon, PolygonProps, Popup, TileLayer } from "react-leaflet";
import { Icon, LatLngExpression, DivIcon } from "leaflet";
import { IMapItem } from "@/types/map";
import { Fragment } from "react";
import { Chip } from "@mui/material";
import ReactDOMServer from "react-dom/server";
import { IFindPropertyEstimatedPriceResponse } from "@/types/find-property";

interface IProps {
  parcels: IFindPropertyEstimatedPriceResponse["properties"];
  mainParcel: IMapItem;
  price: number;
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

function formatCompactNumber(number: number) {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(number);
}

const FindPropertyCalculatePriceMap = ({ parcels, mainParcel, price }: IProps) => {
  const iconHTML = ReactDOMServer.renderToString(
    <div
      style={{
        background: "#3EA266",
        boxShadow: "0px 0px 20px 0px #00000026",
        width: 80,
        height: 35,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        color: "white",
        borderRadius: 60,
      }}
    >
      {formatCompactNumber(price)}
    </div>
  );

  const customMarkerIcon = new DivIcon({
    html: iconHTML,
  });
  return (
    <MapContainer
      preferCanvas
      center={[Number(mainParcel.properties.fields.lat), Number(mainParcel.properties.fields.lon)]}
      zoom={12}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup pathOptions={{ color: "green" }}>
        <Polygon stroke key={Math.random()} fillColor="blue" positions={mainParcel.geometry.coordinates} />
        <Marker icon={customMarkerIcon} position={[Number(mainParcel.properties.fields.lat), Number(mainParcel.properties.fields.lon)]}>
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

export default FindPropertyCalculatePriceMap;
