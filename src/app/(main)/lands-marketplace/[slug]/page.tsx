"use client";

import BreadCrumb from "@/components/shared/BreadCrumb";
import { numFormatter } from "@/helpers/common";
import { getAllStates, getCounties } from "@/helpers/states";
import BookMark from "@/icons/BookMark";
import LoadingCircle from "@/icons/LoadingCircle";
import PersonalId from "@/icons/PersonalId";
import { useGetSellingPropertyQuery } from "@/lib/features/apis/propertyApi";
import { Box, Button, Chip, Container, Divider, Typography } from "@mui/material";
import { Calendar, Eye, Location, UserSquare } from "iconsax-react";
import Image from "next/image";
import React from "react";

interface IProps {
  params: {
    slug: string;
  };
}

const LandsMarketPlaceItemPage = ({ params }: IProps) => {
  const { isFetching, data } = useGetSellingPropertyQuery(params!.slug);
  const state = getAllStates().find((state) => state.value === data?.data.state.toLocaleLowerCase())?.label;
  const county = getCounties(data?.data.state.toLocaleLowerCase()).find((el) => el.value === data?.data.county)?.label;

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 3, pb: { xs: 6, md: 8, lg: 10 }, pt: { xs: 3, md: 4 } }}>
      <BreadCrumb routName="Test Name" />

      {isFetching ? (
        <div className="w-[260px] flex m-auto">
          <LoadingCircle />
        </div>
      ) : (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography component="h1" sx={{ fontSize: { xs: 18, sm: 20, md: 24, lg: 28 }, fontWeight: 600 }}>
              {data?.data.acrage} Acreages for sale
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box sx={{ color: "primary.main" }}>
                  <Location size="16" variant="Outline" />
                </Box>{" "}
                <Typography sx={{ fontSize: 12, fontWeight: 400, color: "grey.600" }}>
                  {state}; {county}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Box sx={{ color: "grey.600", display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
                  <Eye size="16" />
                  <Typography sx={{ fontSize: 12 }}>
                    Total Views:
                    <Typography component="span" sx={{ fontSize: 12, color: "black", fontWeight: 500, ml: 0.5 }}>
                      2435
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ color: "grey.600", display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
                  <Calendar size="16" />
                  <Typography sx={{ fontSize: 12 }}>
                    Available till:
                    <Typography component="span" sx={{ fontSize: 12, color: "black", fontWeight: 500, ml: 0.5 }}>
                      24 Apr
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "primary.main" }}>
                  <BookMark />
                  <Typography sx={{ fontWeight: 500, fontSize: 14, color: "black" }}>Save</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ height: { xs: 200, sm: 250, md: 350, lg: 448 }, width: "100%", borderRadius: 2, position: "relative" }}>
              <Image src="/property-map.png" fill alt="" />
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "space-between" }}>
              <Box sx={{ color: "grey.600", display: "flex", alignItems: "center", gap: 0.5 }}>
                <Eye size="16" />
                <Typography sx={{ fontSize: 12 }}>
                  Total Views:
                  <Typography component="span" sx={{ fontSize: 12, color: "black", fontWeight: 500, ml: 0.5 }}>
                    2435
                  </Typography>
                </Typography>
              </Box>
              <Box sx={{ color: "grey.600", display: "flex", alignItems: "center", gap: 0.5 }}>
                <Calendar size="16" />
                <Typography sx={{ fontSize: 12 }}>
                  Available till:
                  <Typography component="span" sx={{ fontSize: 12, color: "black", fontWeight: 500, ml: 0.5 }}>
                    24 Apr
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ borderWidth: "1px", borderColor: "grey.100", borderRadius: 4 }}>
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Typography component="h1" sx={{ fontWeight: 600, fontSize: 18, mb: 3 }}>
                Main Information
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 1.5 }}>
                <Box sx={{ color: "grey.600", display: "flex", alignItems: "center", gap: 0.5 }}>
                  <UserSquare size="18" />
                  <Typography sx={{ fontSize: 14 }}>
                    Owner:
                    <Typography component="span" sx={{ fontSize: 14, color: "black", fontWeight: 500, ml: 0.5 }}>
                      {data?.data.owner}
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ color: "grey.600", display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PersonalId />
                  <Typography sx={{ fontSize: 14 }}>
                    Parcel ID:
                    <Typography component="span" sx={{ fontSize: 14, color: "black", fontWeight: 500, ml: 0.5 }}>
                      {data?.data.parcelNumber}
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ color: "grey.600", display: "flex", alignItems: "center", gap: 0.5 }}>
                  <UserSquare size="18" />
                  <Typography sx={{ fontSize: 14 }}>
                    Acreage:
                    <Typography component="span" sx={{ fontSize: 14, color: "black", fontWeight: 500, ml: 0.5 }}>
                      {data?.data.acrage} Acres
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ color: "grey.600", display: "flex", alignItems: "center", gap: 0.5 }}>
                  <UserSquare size="18" />
                  <Typography sx={{ fontSize: 14 }}>
                    VOLT Value:
                    <Typography component="span" sx={{ fontSize: 14, color: "black", fontWeight: 500, ml: 0.5 }}>
                      {data?.data.marketPrice && numFormatter.format(Number(data.data.marketPrice))}
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ color: "grey.600", display: "flex", alignItems: "center", gap: 0.5 }}>
                  <UserSquare size="18" />
                  <Typography sx={{ fontSize: 14 }}>
                    Property Type:
                    <Typography component="span" sx={{ fontSize: 14, color: "black", fontWeight: 500, ml: 0.5 }}>
                      {data?.data.propertyType}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "space-between" },
                alignItems: "center",
                flexWrap: "wrap",
                gap: 3,
                px: { xs: 3, md: 4 },
                py: 2,
              }}
            >
              <Typography>Some text before user contacts to seller.</Typography>
              <Button sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="contained">
                Contact Seller
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Chip
              sx={{
                border: "1px solid",
                borderColor: "green.200",
                bgcolor: "green.100",
                color: "primary.main",
                fontWeight: 500,
              }}
              label="Waterfront"
              color="primary"
            />
            <Chip
              sx={{
                border: "1px solid",
                borderColor: "green.200",
                bgcolor: "green.100",
                color: "primary.main",
                fontWeight: 500,
              }}
              label="Waterfront"
              color="primary"
            />
            <Chip
              sx={{
                border: "1px solid",
                borderColor: "green.200",
                bgcolor: "green.100",
                color: "primary.main",
                fontWeight: 500,
              }}
              label="Waterfront"
              color="primary"
            />
            <Chip
              sx={{
                border: "1px solid",
                borderColor: "green.200",
                bgcolor: "green.100",
                color: "primary.main",
                fontWeight: 500,
              }}
              label="Waterfront"
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default LandsMarketPlaceItemPage;