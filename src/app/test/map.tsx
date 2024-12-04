"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { Map, geoJson } from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import shpjs from "shpjs";

const TestMap = ({ searchParams }: any) => {
  const [data, setData] = useState();
  const [mapRef, setMapRef] = useState<Map | null>(null);
  console.log("ae", searchParams);

  const getData = useCallback(async () => {
    if (mapRef) {
      const x = await shpjs(`./${searchParams.state}+${searchParams.county}.zip`);
      const newLayer = geoJson(x);
      console.log(newLayer.getBounds());
      mapRef.addLayer(newLayer);
      mapRef.flyTo(newLayer.getBounds().getCenter(), 10);
    }
  }, [mapRef, searchParams.county, searchParams.state]);

  useEffect(() => {
    getData();
  }, [getData, mapRef]);

  return (
    <MapContainer
      preferCanvas
      ref={setMapRef}
      zoom={3}
      center={[0, 0]}
      className=" w-full h-full"
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* {data && <GeoJSON data={data} />} */}
    </MapContainer>
  );
};

export default TestMap;
