"use client";

import LandsMarketplaceSearch from "@/components/lands-marketplace/LandsMarketplaceSearch";
import SectionHeader from "@/components/shared/SectionHeader";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import { Box, Button, CircularProgress, Container, Pagination, Skeleton, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import LandsMarketplaceFilters from "@/components/lands-marketplace/filters/LandsMarketplaceFilters";
import { BookmarkBorderOutlined, CalendarMonth, FmdGoodOutlined, Place } from "@mui/icons-material";
import { Location, UserSquare } from "iconsax-react";
import Image from "next/image";
import { useGetSellingPropertiesQuery } from "@/lib/features/apis/propertyApi";
import { getAllStates, getCounties } from "@/helpers/states";
import { numFormatter } from "@/helpers/common";
import moment from "moment";

const LandsMarketPlacePage = () => {
  const [filters, setFilters] = useState<ILandsMarketplaceFilters>({
    price: null,
    acreage: null,
    county: null,
    state: null,
    page: 1,
    pageSize: 10,
    sellerType: "sale",
  });
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const { isLoading, data } = useGetSellingPropertiesQuery(filters);

  return (
    <Container sx={{ py: { xs: 3, md: 4 }, display: "flex", flexDirection: "column" }}>
      <SectionHeader
        title="Lands Marketplace"
        desc="Welcome to Parcel Market and thank You for being here. At Parcel Market, our goal is simple, to provide a FREE and convenient place to start when making decisions regarding vacant land. "
      />
      <Box
        sx={{
          maxWidth: 416,
          width: "100%",
          m: "auto",
          mt: 4,
        }}
      >
        <LandsMarketplaceSearch onSearch={(value) => setSearchValue(value)} />
      </Box>
      <Box sx={{ mt: { xs: 5, md: 6 } }}>
        <LandsMarketplaceFilters filters={filters} setFilters={setFilters} />
      </Box>
      <Box
        sx={{
          mt: { xs: 3, md: 4 },
          mb: { xs: 5, md: 6 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 3, md: 4 },
        }}
      >
        {isLoading && (
          <>
            <Skeleton variant="rectangular" sx={{ height: 200, borderRadius: 5 }} />
            <Skeleton variant="rectangular" sx={{ height: 200, borderRadius: 5 }} />
            <Skeleton variant="rectangular" sx={{ height: 200, borderRadius: 5 }} />
            <Skeleton variant="rectangular" sx={{ height: 200, borderRadius: 5 }} />
            <Skeleton variant="rectangular" sx={{ height: 200, borderRadius: 5 }} />
            <Skeleton variant="rectangular" sx={{ height: 200, borderRadius: 5 }} />
            <Skeleton variant="rectangular" sx={{ height: 200, borderRadius: 5 }} />
            <Skeleton variant="rectangular" sx={{ height: 200, borderRadius: 5 }} />
          </>
        )}
        {!isLoading &&
          data?.data.sellingProperties.map((item) => {
            const state = getAllStates().find((el) => el.value === item.state.toLocaleLowerCase());
            const counties = getCounties(state?.value!);

            return (
              <Box
                key={item.parcelNumber}
                sx={{
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: "grey.100",
                  pt: 3,
                  cursor: "pointer",
                  "&:hover": { borderColor: "transparent", boxShadow: 1, "& div > div > h1": { color: "primary.main" } },
                  transition: "all 0.2s",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, px: 3 }}>
                  <Box sx={{ display: "table", tableLayout: "fixed", width: "100%" }}>
                    <Typography noWrap component="h1" sx={{ fontWeight: 600, fontSize: { xs: 16, md: 18 }, mb: 1, transition: "all 0.2s" }}>
                      {item.propertyType}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "grey.600", display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Location color="#0E8B40" size={16} /> {state?.label}; {counties.find((el) => el.value === item.county)?.label}
                    </Typography>
                  </Box>
                  <BookmarkBorderOutlined color="primary" />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1ft", sm: "1fr 1fr", md: "1fr", lg: "1fr 1fr" },
                    gap: 2,
                    mt: 2,
                    mb: 4,
                    px: 3,
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ position: "relative", height: { xs: 200, sm: "100%", md: 200, lg: "100%" } }}>
                    <Image fill src="/property-map.png" alt="" style={{ borderRadius: 16 }} />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box sx={{ display: "table", tableLayout: "fixed", width: "100%" }}>
                      <Tooltip title={item.owner}>
                        <Typography
                          sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "grey.600", fontWeight: 400, fontSize: 14 }}
                          // noWrap
                        >
                          <UserSquare /> Owner:{" "}
                          <Typography noWrap sx={{ fontWeight: 500, fontSize: 14, color: "black" }} component="span">
                            {item.owner}
                          </Typography>
                        </Typography>
                      </Tooltip>
                    </Box>
                    <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "grey.600", fontWeight: 400, fontSize: 14 }}>
                      <UserSquare /> Parcel ID:{" "}
                      <Typography sx={{ fontWeight: 500, fontSize: 14, color: "black" }} component="span">
                        {item.parcelNumber}
                      </Typography>
                    </Typography>
                    <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "grey.600", fontWeight: 400, fontSize: 14 }}>
                      <UserSquare /> Acreage:{" "}
                      <Typography sx={{ fontWeight: 500, fontSize: 14, color: "black" }} component="span">
                        {item.acrage} Acres
                      </Typography>
                    </Typography>
                    <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "grey.600", fontWeight: 400, fontSize: 14 }}>
                      <UserSquare /> VOLT Value:{" "}
                      <Typography sx={{ fontWeight: 500, fontSize: 14, color: "black" }} component="span">
                        {numFormatter.format(Number(item.marketPrice))} $
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", borderTopWidth: 1, color: "grey.100", px: 3, py: 2 }}>
                  <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "grey.600", fontWeight: 400, fontSize: 12 }}>
                    <CalendarMonth fontSize="small" /> Available till:{" "}
                    <Typography sx={{ fontWeight: 500, fontSize: 12, color: "black" }} component="span">
                      {moment(item.dataCreated).add(3, "day").format("D MMM")}
                    </Typography>
                  </Typography>
                  <Button variant="contained">Details</Button>
                </Box>
              </Box>
            );
          })}
      </Box>
      <Pagination
        sx={{ m: "auto" }}
        color="primary"
        count={data?.data.pagination.totalCount}
        page={filters.page}
        variant="outlined"
        shape="rounded"
      />
    </Container>
  );
};

export default LandsMarketPlacePage;
