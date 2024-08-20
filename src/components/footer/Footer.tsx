"use client";

import FbIcon from "@/icons/FbIcon";
import Logo from "@/icons/Logo";
import TwitterIcon from "@/icons/TwitterIcon";
import { Box, Divider, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import Container from "../@new/shared/Container";

const Footer = () => {
  const pathname = usePathname();
  return (
    <div className="bg-white pt-20 md:pt-20.5">
      <Container>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ width: { xs: 85, sm: 95, md: 125, lg: 140 }, height: { xs: 24, sm: 30, md: 34, lg: 40 } }}>
            <Logo />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
            <Typography>Let&apos;s connect</Typography>
            <Box
              sx={{
                "&:hover > svg> circle": { fill: "black", fillOpacity: 1 },
                "&:hover > svg> path": { fill: "white", fillOpacity: 1 },
              }}
            >
              <FbIcon />
            </Box>
            <Box
              sx={{
                "&:hover > svg> circle": { fill: "black", fillOpacity: 1 },
                "&:hover > svg> path": { fill: "white", fillOpacity: 1 },
              }}
            >
              <TwitterIcon />
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 4 }} />
        <Box
          sx={{
            display: "grid",
            gap: 2,
            rowGap: 4,
            gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr", md: "1fr 1fr 1fr 1fr 1fr" },
          }}
        >
          {navs.map((el) => (
            <Box key={el.label} sx={{ display: "flex", gap: 1.5, flexDirection: "column" }}>
              <Typography sx={{ cursor: "pointer", fontSize: 14, fontWeight: 500 }}>{el.label}</Typography>
              {el.items.map((item) => (
                <Typography
                  sx={{ cursor: "pointer", fontSize: 14, color: "grey.800", "&:hover": { color: "black", fontWeight: 500 } }}
                  key={item}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
      </Container>
    </div>
  );
};

export default Footer;

const navs = [
  {
    label: "Company",
    items: ["About Us", "Customers", "Partners", "Jobs", "Blogs"],
  },
  {
    label: "Products",
    items: ["Parcel Market", "Rejiggle"],
  },
  {
    label: "Use Cases",
    items: ["SaaS", "Platforms", "MarketPlaces", "E-commerce"],
  },
  {
    label: "Resources",
    items: ["Support", "Contact", "Guides"],
  },
  {
    label: "Developers",
    items: ["Documentation", "API reference", "Status"],
  },
];
