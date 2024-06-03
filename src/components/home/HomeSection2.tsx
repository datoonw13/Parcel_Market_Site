"use client";

import ConnectIcon from "@/icons/ConnectIcon";
import DiscoverIcon from "@/icons/DiscoverIcon";
import SellingIcon from "@/icons/SellingIcon";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

const HomeSection2 = () => (
  <Container
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: { xs: 4, md: 5, lg: 6 },
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography sx={{ fontSize: 16, textAlign: "center", mb: 0.5, color: "primary.main" }}>OUR OFFERS</Typography>
      <Typography sx={{ fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, textAlign: "center", fontWeight: 600 }}>
        Connect to your favorite tools
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: { xs: 2.5, sm: 3, md: 3.5, lg: 4.5 },
        width: "100%",
        alignItems: { xs: "center", md: "start" },
        justifyContent: "center",
        "& > div:nth-child(2)": {
          height: { sm: 480, lg: 444 },
        },
        // "& > div:nth-child(2) > div": {
        //   mb: { md: 2.1 },
        // },
      }}
    >
      {list.map((el) => (
        <Link key={el.title} href={el.path}>
          <Box
            sx={(theme) => ({
              border: `1px solid ${theme.palette.grey[200]}`,
              p: { xs: 3, sm: 3.5, md: 4 },
              borderRadius: 4,
              height: { xs: 400, sm: 460, lg: 424 },
              width: "100%",
              maxWidth: 350,
              cursor: "pointer",
              "&:hover": {
                boxShadow: theme.shadows[2],
                borderColor: "transparent",
                "& > h1": {
                  color: "primary.main",
                },
              },
            })}
          >
            <Box sx={{ mb: 4.5, "& > svg": { width: 142, height: 140 } }}>
              <el.icon />
            </Box>
            <Typography component="h1" sx={{ fontWeight: 600, fontSize: 18, mb: 1 }} dangerouslySetInnerHTML={{ __html: el.title }} />
            <Typography sx={{ color: "grey.800" }}>{el.desc}</Typography>
          </Box>
        </Link>
      ))}
    </Box>
  </Container>
);

export default HomeSection2;

const list = [
  {
    title: "Sell Quickly With No <br/> Closing Expenses",
    desc: "Get quick cash for your property, with zero closing costs and zero hassle with our Parcel Market Purchase Option.",
    icon: SellingIcon,
    path: "/sell-quickly",
  },
  {
    title: "Discover Your next <br/> Land Deal",
    desc: "Utilize The Parcel Market Marketplace to discover new land deals or expose your property to investors.",
    icon: DiscoverIcon,
    path: "/discover-deal",
  },
  {
    title: "Connect with a <br/> Preferred Professional",
    desc: "Connect with an experienced land professional in your area using Parcel Market’s Preferred Professional Network",
    icon: ConnectIcon,
    path: "/connect-professional",
  },
];
