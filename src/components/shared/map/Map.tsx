"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { Button } from "@mui/material";
import { Icon, Map as LeafletMap, Marker as LeafletMaker, LatLngExpression } from "leaflet";
import { Fragment, ReactElement, ReactNode } from "react";
import { FeatureGroup, MapContainer, Marker, Polygon, PolygonProps, Popup, TileLayer } from "react-leaflet";
import { getCenter } from "geolib";

interface IProps {
  zoom: number;
  properties: Array<{
    id: string;
    latitude: number;
    longitude: number;
    center?: boolean;
    polygon?: PolygonProps["positions"];
    parcelNumber: string;
    markerType?: "default" | "active";
    popup?: ReactElement;
  }>;
  setMapRef?: (ref: LeafletMap) => void;
  setMarkerRef?: (id: string, ref: LeafletMaker) => void;
  markerMouseEnter?: (id: string) => void;
  markerMouseLeave?: (id: string) => void;
  popupOpen?: (id: string) => void;
  popupClose?: (id: string) => void;
  onMarkerClick?: (id: string) => void;
  disableZoom?: boolean;
  highlightItemId?: string | null;
}

const markerDefault = new Icon({
  iconUrl: "/map-default-icon.svg",
  iconSize: [28, 36],
});

const markerActive = new Icon({
  iconUrl: "/map-active-icon.svg",
  iconSize: [36, 48],
});

const getMarkerIcon = (mapItem: IProps["properties"][0], highlightItemId?: string | null) => {
  if (mapItem.markerType === "active" || highlightItemId === mapItem.id) {
    return markerActive;
  }
  return markerDefault;
};

const Map = ({
  properties,
  zoom,
  setMapRef,
  setMarkerRef,
  markerMouseEnter,
  markerMouseLeave,
  popupClose,
  popupOpen,
  onMarkerClick,
  disableZoom,
  highlightItemId,
}: IProps) => {
  const centerToItem = properties.find((el) => el.center);
  const centerToAllProperties = getCenter(properties.map((el) => ({ latitude: el.latitude, longitude: el.longitude }))) || {
    latitude: 0,
    longitude: 0,
  };

  const getMapCenter = (): LatLngExpression => {
    if (centerToItem) {
      return [centerToItem.latitude, centerToItem.longitude];
    }
    if (centerToAllProperties) {
      return [centerToAllProperties.latitude, centerToAllProperties.longitude];
    }
    return [0, 0];
  };

  return (
    <MapContainer
      zoomControl={!disableZoom}
      zoom={zoom}
      center={getMapCenter()}
      scrollWheelZoom={!disableZoom}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      ref={(mapRef) => {
        if (mapRef) {
          setMapRef && setMapRef(mapRef);
        }
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup pathOptions={{ color: "#F44D61", fillColor: "#F44D61", fillOpacity: 0.2, weight: 1 }}>
        {properties.map((mapItem) => (
          <Fragment key={mapItem.parcelNumber}>
            {mapItem.polygon && <Polygon stroke key={Math.random()} fillColor="blue" positions={mapItem.polygon} />}
            <Marker
              eventHandlers={{
                mouseover: () => markerMouseEnter && markerMouseEnter(mapItem.id),
                mouseout: () => markerMouseLeave && markerMouseLeave(mapItem.id),
                popupopen: () => popupOpen && popupOpen(mapItem.id),
                popupclose: () => popupClose && popupClose(mapItem.id),
                click: () => onMarkerClick && onMarkerClick(mapItem.id),
              }}
              ref={(ref) => {
                if (setMarkerRef && ref) {
                  setMarkerRef(mapItem.id, ref);
                }
              }}
              icon={getMarkerIcon(mapItem, highlightItemId)}
              position={[mapItem.latitude, mapItem.longitude]}
            >
              {mapItem?.popup && <Popup>{mapItem.popup}</Popup>}
            </Marker>
          </Fragment>
        ))}
      </FeatureGroup>
    </MapContainer>
  );
};

export default Map;
