"use client";

import LandsMarketplaceSearch from "@/components/lands-marketplace/LandsMarketplaceSearch";
import SectionHeader from "@/components/shared/SectionHeader";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import { Box, Button, Container, Pagination, Typography } from "@mui/material";
import React, { useState } from "react";
import LandsMarketplaceFilters from "@/components/lands-marketplace/filters/LandsMarketplaceFilters";
import { BookmarkBorderOutlined, CalendarMonth, FmdGoodOutlined, Place } from "@mui/icons-material";
import { Location, UserSquare } from "iconsax-react";
import Image from "next/image";

const LandsMarketPlacePage = () => {
  const [filters, setFilters] = useState<ILandsMarketplaceFilters>({
    price: null,
    acreage: null,
    county: null,
    state: null,
  });
  const [searchValue, setSearchValue] = useState<string | null>(null);

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
        {new Array(10).fill(0).map(() => (
          <Box
            key={Math.random()}
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
                  Some Land name, longer names with 3 lorem ipsum ipsum lorem...
                </Typography>
                <Typography sx={{ fontSize: 12, color: "grey.600", display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Location color="#0E8B40" size={16} /> State; County
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
                <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "grey.600", fontWeight: 400, fontSize: 14 }}>
                  <UserSquare /> Owner:{" "}
                  <Typography sx={{ fontWeight: 500, fontSize: 14, color: "black" }} component="span">
                    John, Hickman
                  </Typography>
                </Typography>
                <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "grey.600", fontWeight: 400, fontSize: 14 }}>
                  <UserSquare /> Parcel ID:{" "}
                  <Typography sx={{ fontWeight: 500, fontSize: 14, color: "black" }} component="span">
                    1473434052
                  </Typography>
                </Typography>
                <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "grey.600", fontWeight: 400, fontSize: 14 }}>
                  <UserSquare /> Acreage:{" "}
                  <Typography sx={{ fontWeight: 500, fontSize: 14, color: "black" }} component="span">
                    45,900 Acres
                  </Typography>
                </Typography>
                <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "grey.600", fontWeight: 400, fontSize: 14 }}>
                  <UserSquare /> VOLT Value:{" "}
                  <Typography sx={{ fontWeight: 500, fontSize: 14, color: "black" }} component="span">
                    43,000,000 $
                  </Typography>
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", borderTopWidth: 1, color: "grey.100", px: 3, py: 2 }}>
              <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "grey.600", fontWeight: 400, fontSize: 12 }}>
                <CalendarMonth fontSize="small" /> Available till:{" "}
                <Typography sx={{ fontWeight: 500, fontSize: 12, color: "black" }} component="span">
                  24 Apr
                </Typography>
              </Typography>
              <Button variant="contained">Details</Button>
            </Box>
          </Box>
        ))}
      </Box>
      <Pagination sx={{ m: "auto" }} color="primary" count={10} variant="outlined" shape="rounded" />
    </Container>
  );
};

export default LandsMarketPlacePage;
