import { useLazyCalculatePriceQuery } from "@/lib/features/apis/propertyApi";
import { IFindPropertyEstimatedPrice, IFindPropertyEstimatedPriceResponse } from "@/types/find-property";
import { IMap, IMapItem } from "@/types/map";
import { PlaceOutlined } from "@mui/icons-material";
import { Box, Button, Divider, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import React, { Dispatch, SetStateAction, useEffect } from "react";

const Map = dynamic(() => import("@/components/shared/Map"), { ssr: false });

interface IProps {
  data: IMap;
  selectedRegridItem: IMapItem | null;
  setSelectedRegridItem: Dispatch<SetStateAction<IMapItem | null>>;
  goBack: () => void;
  onNext: (data: IFindPropertyEstimatedPriceResponse) => void;
}

const FindPropertyFoundedParcels = ({ data, selectedRegridItem, setSelectedRegridItem, goBack, onNext }: IProps) => {
  const [calculatePrice] = useLazyCalculatePriceQuery();

  useEffect(() => {
    if (data.length === 1) {
      setSelectedRegridItem(data[0]);
    }
  }, [data, setSelectedRegridItem]);

  const onSubmit = async () => {
    if (!selectedRegridItem) {
      return;
    }
    const reqData: IFindPropertyEstimatedPrice = {
      body: {
        county: selectedRegridItem?.properties.fields.county.toLocaleLowerCase(),
        state: selectedRegridItem?.properties.fields.state2.toLocaleLowerCase(),
        parcelNumber: selectedRegridItem?.properties.fields.parcelnumb,
        owner: selectedRegridItem.properties.fields.owner,
        propertyType: selectedRegridItem.properties.fields?.zoning_description || selectedRegridItem.properties.fields.usedesc || "",
      },
      queryParams: {
        acre: selectedRegridItem.properties.fields.ll_gisacre.toString(),
        lat: selectedRegridItem.properties.fields.lat,
        lon: selectedRegridItem.properties.fields.lon,
      },
    };
    try {
      const res = await calculatePrice({ ...reqData }).unwrap();
      onNext(res.data);
    } catch (error) {}
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", mt: { xs: 1, md: 0 } }}>
      <Box sx={{ px: { xs: 2, md: 3, lg: 4, mb: 3 }, height: "100%" }}>
        <Box
          sx={(theme) => ({
            border: { xs: `1px solid transparent`, md: `1px solid ${theme.palette.grey[100]}` },
            borderRadius: 4,
            p: { md: 3, lg: 4 },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.5, md: 2 },
          })}
        >
          <Box sx={{ borderRadius: 4, height: { xs: 240, sm: 230, md: 220, lg: 200 }, "& > div": { borderRadius: 4 } }}>
            {data.length > 0 && (
              <Map
                data={data.map((el) => ({
                  centerCoordinate: [Number(el.properties.fields.lat), Number(el.properties.fields.lon)],
                  polygon: el.geometry.coordinates,
                  owner: el.properties.fields.owner,
                  parcelNumber: el.properties.fields.parcelnumb,
                  showMarker: true,
                  markerColor: "default",
                  popup: {
                    owner: el.properties.fields.parcelnumb,
                    parcelNumber: el.properties.fields.owner,
                    showSelectButton: data.length > 1,
                  },
                }))}
                selectedParcelNumber={selectedRegridItem?.properties.fields.parcelnumb || ""}
                onSelect={(parcelNumber) => {
                  const item = data.find((el) => el.properties.fields.parcelnumb === parcelNumber);
                  setSelectedRegridItem(item || null);
                }}
                onDiscard={() => setSelectedRegridItem(null)}
                zoom={5}
                geolibInputCoordinates={data.map((el) => [Number(el.properties.fields.lat), Number(el.properties.fields.lon)])}
              />
            )}
          </Box>
          <Box
            sx={(theme) => ({
              border: `1px solid ${theme.palette.grey[100]}`,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              "& > div:not(:last-child)": {
                borderBottom: `1px solid ${theme.palette.grey[100]}`,
              },
              "& > div:first-child": data.length === 1 && {
                borderRadius: 3,
              },
            })}
          >
            {data.map((item) => (
              <Box
                key={item.properties.fields.parcelnumb}
                onClick={() => setSelectedRegridItem(item)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  p: 1.5,
                  cursor: "pointer",
                  transition: "all 0.1s",
                  "&:hover": {
                    bgcolor:
                      selectedRegridItem?.properties.fields.parcelnumb === item.properties.fields.parcelnumb ? "primary.100" : "primary.50",
                  },
                  bgcolor:
                    selectedRegridItem?.properties.fields.parcelnumb === item.properties.fields.parcelnumb ? "primary.100" : "transparent",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PlaceOutlined fontSize="small" />
                  <Typography sx={{ fontSize: 14, color: "grey.600" }}>
                    Parcel Number:{" "}
                    <Typography sx={{ color: "black", fontSize: 14 }} component="span">
                      #{item.properties.fields.parcelnumb}
                    </Typography>
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: "grey.600" }}>
                  Acreages{" "}
                  <Typography sx={{ color: "black", fontSize: 14 }} component="span">
                    {item.properties.fields.ll_gisacre.toFixed(2)} Acres
                  </Typography>
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Divider sx={{ mt: 4 }} />
      <Box
        sx={{
          mt: 2,
          px: { xs: 2, md: 3, lg: 4, mb: 3 },
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="outlined" onClick={goBack}>
          Back
        </Button>
        <Button disabled={!selectedRegridItem} sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="contained" onClick={onSubmit}>
          Find out Your Estimated Sale Price
        </Button>
      </Box>
    </Box>
  );
};

export default FindPropertyFoundedParcels;

// "use client";

// import FbIcon from "@/icons/FbIcon";
// import TwitterIcon from "@/icons/TwitterIcon";
// import { Box, Typography, alpha } from "@mui/material";
// import Image from "next/image";
// import React, { useState } from "react";
// import { IFindPropertyEstimatedPriceResponse } from "@/types/find-property";
// import dynamic from "next/dynamic";
// import { IMap, IMapItem } from "@/types/map";
// import FindProperty from "@/components/find-property/FindProperty";
// import { MiniFooter } from "@/components/footer";
// import { AppBarMini } from "@/components/app-bar";
// import useAuthCheck from "@/hooks/useAuthCheck";
// import { LatLngTuple } from "leaflet";
// import { PolygonProps } from "react-leaflet";
// import { getCenter } from "geolib";

// const FindPropertyCalculatePriceMap = dynamic(() => import("@/components/find-property/FindPropertyCalculatePriceMap"), {
//   ssr: false,
// });
// const Map = dynamic(() => import("../../components/shared/Map"), { ssr: false });

// interface IProps {
//   mapCenter: LatLngTuple;
//   zoom: number;
//   data: Array<{
//     centerCoordinate: LatLngTuple;
//     polygon?: PolygonProps["positions"];
//     owner: string | null;
//     parcelNumber: string;
//     showMarker?: boolean;
//     markerColor: "default" | "red" | "green";
//     popup?: {
//       owner?: string;
//       parcelNumber?: string;
//       selectable?: boolean;
//     };
//   }>;
//   selectedParcelNumber?: string | null;
//   onSelect?: (parcelNumber: string) => void;
// }

// const res =
//   '[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[32.8345255,-80.69059],[32.8346335,-80.689918],[32.834704,-80.689919],[32.835211,-80.6899235],[32.8351025,-80.690595],[32.8345255,-80.69059]]]},"properties":{"headline":"95 Cornwall Ln","path":"/us/sc/colleton/hendersonville/30357","fields":{"ogc_fid":30357,"geoid":"45029","parcelnumb":"208-00-00-031.000","parcelnumb_no_formatting":"2080000031000","usedesc":"VACANT RESIDENTIAL","zoning":"UD1","zoning_description":"Urban Development 1","owner":"HICKMAN CHRISTOPHER D","mailadd":"168 J RUFUS RD","mail_city":"LEXINGTON","mail_state2":"SC","mail_zip":"29073-7419","address":"95 CORNWALL LN","saddno":"95","saddstr":"CORNWALL","saddsttyp":"LN","scity":"WALTERBORO","original_address":"{\\"address\\":\\"95 CORNWALL LANE \\"}","city":"hendersonville","county":"colleton","state2":"SC","szip":"29488-8997","szip5":"29488","address_source":"county;cass","lat":"32.834868","lon":"-80.690257","qoz":"No","census_tract":"45029970302","census_block":"450299703021004","census_blockgroup":"450299703021","census_zcta":"29488","ll_last_refresh":"2024-05-21","gisacre":1,"ll_gisacre":0.99535,"ll_gissqft":43358,"path":"/us/sc/colleton/hendersonville/30357","ll_stable_id":"parcelnumb","ll_uuid":"e0dcfddf-398e-4f48-8ff5-b5e8440bfe83","ll_updated_at":"2024-06-10 22:25:36 -0400"},"context":{"headline":"Hendersonville, SC","name":"Hendersonville, SC","path":"/us/sc/colleton/hendersonville","active":true},"ll_uuid":"e0dcfddf-398e-4f48-8ff5-b5e8440bfe83"},"id":122713872},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[33.043988,-80.442375],[33.04378,-80.4412055],[33.0454205,-80.439827],[33.045673,-80.4412105],[33.0453775,-80.4414585],[33.045034,-80.4417465],[33.044697,-80.442029],[33.043988,-80.442375]]]},"properties":{"headline":"24349 Augusta Hwy","path":"/us/sc/colleton/cottageville/5193","fields":{"ogc_fid":5193,"geoid":"45029","parcelnumb":"067-00-00-117.000","parcelnumb_no_formatting":"0670000117000","usedesc":"IMPROVED AGRICULTURAL","zoning":"RD2","zoning_description":"Rural Development 2","owner":"HICKMAN CHRISTOPHER","mailadd":"24349 AUGUSTA HWY","mail_city":"COTTAGEVILLE","mail_state2":"SC","mail_zip":"29435","address":"24349 AUGUSTA HWY","saddno":"24349","saddstr":"AUGUSTA","saddsttyp":"HWY","scity":"COTTAGEVILLE","original_address":"{\\"address\\":\\"24349 AUGUSTA HWY \\",\\"scity\\":\\"COTTAGEVILLE \\",\\"szip\\":\\"29435 \\"}","city":"cottageville","county":"colleton","state2":"SC","szip":"29435-3933","szip5":"29435","address_source":"county;cass","lat":"33.044741","lon":"-80.441172","qoz":"No","census_tract":"45029970702","census_block":"450299707022005","census_blockgroup":"450299707022","census_zcta":"29435","ll_last_refresh":"2024-05-21","gisacre":6.5,"ll_gisacre":6.4885,"ll_gissqft":282645,"path":"/us/sc/colleton/cottageville/5193","ll_stable_id":"parcelnumb","ll_uuid":"6d85b8ea-86de-4254-84b0-263c013d8156","ll_updated_at":"2024-06-10 22:25:36 -0400"},"context":{"headline":"Cottageville, SC","name":"Cottageville, SC","path":"/us/sc/colleton/cottageville","active":true},"ll_uuid":"6d85b8ea-86de-4254-84b0-263c013d8156"},"id":122728474}]';
// const data = (JSON.parse(res) as IMap).map((el) => ({
//   centerCoordinate: [Number(el.properties.fields.lat), Number(el.properties.fields.lon)],
//   polygon: el.geometry.coordinates,
//   owner: el.properties.fields.owner,
//   parcelNumber: el.properties.fields.parcelnumb,
//   showMarker: true,
//   markerColor: "default",
//   popup: {
//     owner: el.properties.fields.parcelnumb,
//     parcelNumber: el.properties.fields.owner,
//     selectable: true,
//   },
// })) as IProps["data"];

// const mapCenter = getCenter(data.map((el) => ({ latitude: el.centerCoordinate[0], lon: el.centerCoordinate[1] })));

// const FindPropertyLayout = () => {
//   const [calculatedPrice, setCalculatedPrice] = useState<IFindPropertyEstimatedPriceResponse | null>(null);
//   const [selectedRegridItem, setSelectedRegridItem] = useState<IMapItem | null>(null);
//   useAuthCheck();
//   return (
//     <Box sx={{ width: "100%", height: 500 }}>
//       <Map
//         data={data}
//         mapCenter={mapCenter ? [mapCenter.latitude, mapCenter.longitude] : [0, 0]}
//         zoom={8}
//         selectedParcelNumber="067-00-00-117.000"
//       />
//     </Box>
//   );
// };

// export default FindPropertyLayout;
