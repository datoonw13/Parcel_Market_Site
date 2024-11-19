"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { Icon, Map as LeafletMap, Marker as LeafletMaker, LatLngExpression } from "leaflet";
import { Fragment, memo, ReactElement, ReactNode } from "react";
import { FeatureGroup, MapContainer, Marker, Polygon, PolygonProps, Popup, TileLayer } from "react-leaflet";
import { getCenter } from "geolib";
import { removeParcelNumberFormatting } from "@/helpers/common";

interface IProps {
  dragging?: boolean;
  zoom: number;
  properties: Array<{
    latitude: number;
    longitude: number;
    center?: boolean;
    polygon?: PolygonProps["positions"];
    parcelNumber: string;
    markerType?: "default" | "active" | "none" | "highlighted" | "invisible";
    popup?: ReactElement;
  }>;
  setMapRef?: (ref: LeafletMap) => void;
  setMarkerRef?: (parcelNumberNoFormatting: string, ref: LeafletMaker) => void;
  markerMouseEnter?: (parcelNumberNoFormatting: string) => void;
  markerMouseLeave?: (parcelNumberNoFormatting: string) => void;
  popupOpen?: (parcelNumberNoFormatting: string) => void;
  popupClose?: (parcelNumberNoFormatting: string) => void;
  onMarkerClick?: (parcelNumberNoFormatting: string) => void;
  disableZoom?: boolean;
  highlightItemParcelNumber?: string | null;
}

const markerDefault = new Icon({
  iconUrl: "/map-default-icon.svg",
  iconSize: [28, 36],
});

const markerHighlighted = new Icon({
  iconUrl: "/map-highlighted-icon.svg",
  iconSize: [28, 36],
});

const markerActive = new Icon({
  iconUrl: "/map-active-icon.svg",
  iconSize: [36, 48],
});

const markerInvisible = new Icon({
  iconUrl: "/map-active-icon.svg",
  iconSize: [0, 0],
});

const getMarkerIcon = (mapItem: any, highlightItemParcelNumber?: string | null) => {
  if (mapItem.markerType === "active") {
    return markerActive;
  }
  if (mapItem.markerType === "highlighted" || highlightItemParcelNumber === mapItem.parcelNumber) {
    return markerHighlighted;
  }
  if (mapItem.markerType === "invisible") {
    return markerInvisible;
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
  highlightItemParcelNumber,
  dragging,
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
      key={properties.map((el) => el.parcelNumber).join(";")}
      zoomControl={!disableZoom}
      zoom={zoom}
      dragging={dragging}
      center={getMapCenter()}
      scrollWheelZoom={!disableZoom}
      doubleClickZoom={!disableZoom}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      ref={(mapRef) => {
        if (mapRef) {
          setMapRef && setMapRef(mapRef);
        }
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* <LayersControl>
        <LayersControl.BaseLayer name="Open Street Map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Mapbox Map">
          <TileLayer
            attribution='&copy; <a href="https://www.mapbox.com">Mapbox</a> '
            url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}"
            accessToken="your token here"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Mapbox Map Satellite">
          <TileLayer
            attribution='&copy; <a href="https://www.mapbox.com">Mapbox</a> '
            url="https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}"
            accessToken="your token here"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer checked name="Google Map">
          <TileLayer attribution="Google Maps" url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}" />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Google Map Satellite">
          <LayerGroup>
            <TileLayer attribution="Google Maps Satellite" url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}" />
            <TileLayer url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
          </LayerGroup>
        </LayersControl.BaseLayer>
      </LayersControl> */}
      <FeatureGroup pathOptions={{ color: "#F44D61", fillColor: "#F44D61", fillOpacity: 0.2, weight: 1 }}>
        {properties.map((mapItem) => (
          <Fragment key={mapItem.parcelNumber}>
            {mapItem.polygon && <Polygon stroke key={Math.random()} fillColor="blue" positions={mapItem.polygon} />}
            {mapItem.markerType !== "none" && (
              <Marker
                eventHandlers={{
                  mouseover: (e) => {
                    // if (mapItem.markerType !== "active") {
                    //   e.target.setIcon(markerHighlighted);
                    // }
                    markerMouseEnter && markerMouseEnter(removeParcelNumberFormatting(mapItem.parcelNumber));
                  },
                  mouseout: (e) => {
                    // if (mapItem.markerType !== "active") {
                    //   e.target.setIcon(getMarkerIcon(mapItem));
                    // }
                    markerMouseLeave && markerMouseLeave(removeParcelNumberFormatting(mapItem.parcelNumber));
                  },
                  popupopen: () => popupOpen && popupOpen(removeParcelNumberFormatting(mapItem.parcelNumber)),
                  popupclose: () => popupClose && popupClose(removeParcelNumberFormatting(mapItem.parcelNumber)),
                  click: (e) => onMarkerClick && onMarkerClick(removeParcelNumberFormatting(mapItem.parcelNumber)),
                }}
                ref={(ref) => {
                  if (setMarkerRef && ref) {
                    ref.getElement()?.setAttribute("data-active", mapItem.markerType === "active" ? "true" : "false");
                    setMarkerRef(removeParcelNumberFormatting(mapItem.parcelNumber), ref);
                  }
                }}
                icon={getMarkerIcon(mapItem, highlightItemParcelNumber)}
                position={[mapItem.latitude, mapItem.longitude]}
              >
                {mapItem?.popup && <Popup>{mapItem.popup}</Popup>}
              </Marker>
            )}
          </Fragment>
        ))}
      </FeatureGroup>
    </MapContainer>
  );
};

export default memo(Map);
