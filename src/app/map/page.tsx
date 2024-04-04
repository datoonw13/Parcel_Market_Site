import dynamic from "next/dynamic";
import { useMemo } from "react";

const Map = () => {
  const MapComponent = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  return (
    <div>
      <MapComponent />
    </div>
  );
};

export default Map;
