"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { Button } from "@mui/material";
import { LatLngTuple, Icon, DivIcon, Map as LeafletMap, Marker as LeafletMaker } from "leaflet";
import { Fragment, ReactElement } from "react";
import { FeatureGroup, MapContainer, Marker, Polygon, PolygonProps, Popup, TileLayer } from "react-leaflet";
import { getCenter } from "geolib";
import ReactDOMServer from "react-dom/server";

interface IProps {
  geolibInputCoordinates: Array<LatLngTuple>;
  zoom: number;
  data: Array<{
    centerCoordinate: LatLngTuple;
    polygon?: PolygonProps["positions"];
    parcelNumber: string;
    showMarker?: boolean;
    markerColor?: "default" | "red" | "green" | "custom";
    customMarkerIcon?: ReactElement;
    popup?: {
      showSelectButton: boolean;
    } & Record<Exclude<string, "showSelectButton">, { label: string; value: string } | boolean>;
  }>;
  selectedParcelNumber?: string | null;
  onSelect?: (parcelNumber: string) => void;
  onDiscard?: (parcelNumber: string) => void;
  setMapRef?: (ref: LeafletMap) => void;
  setMarkerRef?: (key: string, ref: LeafletMaker) => void;
  initialMarkerOpacity?: number;
}

const markerGrey = new Icon({
  iconUrl: "/marker-grey.svg",
  iconSize: [35, 35],
});

const markerRed = new Icon({
  iconUrl: "/marker-red.svg",
  iconSize: [35, 35],
});

const markerGreen = new Icon({
  iconUrl: "/marker-red.svg",
  iconSize: [35, 35],
});

const getMarkerIcon = (mapItem: IProps["data"][0], selectedParcelNumber: IProps["selectedParcelNumber"]) => {
  if (mapItem.parcelNumber === selectedParcelNumber) {
    return markerRed;
  }
  if (mapItem.markerColor === "default") {
    return markerGrey;
  }
  if (mapItem.markerColor === "red") {
    return markerRed;
  }
  if (mapItem.markerColor === "green") {
    return markerGreen;
  }
  return markerGrey;
};

const Map = ({
  geolibInputCoordinates,
  data,
  zoom,
  selectedParcelNumber,
  onSelect,
  onDiscard,
  setMapRef,
  setMarkerRef,
  initialMarkerOpacity,
}: IProps) => {
  const mapCenter = getCenter(geolibInputCoordinates.map((el) => ({ latitude: el[0], lon: el[1] })));

  const generateCustomIcon = (customMarkerIcon?: ReactElement) => {
    if (!customMarkerIcon) {
      return undefined;
    }
    const iconHTML = ReactDOMServer.renderToString(customMarkerIcon);
    const icon = new DivIcon({
      html: iconHTML,
    });
    return icon;
  };

  return (
    <MapContainer
      zoom={zoom}
      center={mapCenter ? [mapCenter.latitude, mapCenter.longitude] : [0, 0]}
      scrollWheelZoom
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      ref={(mapRef) => {
        if (mapRef) {
          setMapRef && setMapRef(mapRef);
        }
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup pathOptions={{ color: "green" }}>
        {data?.map((mapItem, mapItemI) => (
          <Fragment key={mapItem.parcelNumber}>
            {mapItem.polygon && <Polygon stroke key={Math.random()} fillColor="blue" positions={mapItem.polygon} />}
            {mapItem.showMarker && (
              <Marker
                opacity={initialMarkerOpacity || 1}
                ref={(ref) => {
                  if (setMarkerRef && ref) {
                    setMarkerRef(JSON.stringify(mapItem.centerCoordinate), ref);
                  }
                }}
                icon={
                  mapItem.markerColor === "custom"
                    ? generateCustomIcon(mapItem.customMarkerIcon)
                    : getMarkerIcon(mapItem, selectedParcelNumber)
                }
                position={mapItem.centerCoordinate}
              >
                {mapItem.popup && (
                  <Popup>
                    <div className="flex flex-col gap-1">
                      {Object.keys(mapItem.popup)
                        .filter((el) => el !== "showSelectButton")
                        .map((key) => (
                          <div key={key}>
                            {(mapItem.popup as any)[key as any]?.label}: <b>{(mapItem.popup as any)[key as any]?.value}</b>
                          </div>
                        ))}
                    </div>
                    {mapItem.popup.showSelectButton && (
                      <Button
                        color={selectedParcelNumber === mapItem.parcelNumber ? "error" : "primary"}
                        variant="contained"
                        size="small"
                        sx={{ p: 1, my: 2, ml: "auto", display: "flex" }}
                        onClick={() => {
                          if (selectedParcelNumber === mapItem.parcelNumber && onDiscard) {
                            onDiscard(mapItem.parcelNumber);
                          }
                          if (selectedParcelNumber !== mapItem.parcelNumber && onSelect) {
                            onSelect(mapItem.parcelNumber);
                          }
                        }}
                      >
                        {selectedParcelNumber === mapItem.parcelNumber ? "Discard" : "Select"}
                      </Button>
                    )}
                  </Popup>
                )}
              </Marker>
            )}
          </Fragment>
        ))}
      </FeatureGroup>
    </MapContainer>
  );
};

export default Map;
