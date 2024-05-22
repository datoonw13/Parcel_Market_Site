"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { Box, Button, Container, Typography, alpha } from "@mui/material";

const LandingMain = () => (
  <Box sx={{ position: "relative", width: "100%", height: { xs: 400, sm: 450, md: 500, lg: 660 }, display: "flex", alignItems: "center" }}>
    <Box sx={{ display: { xs: "none", md: "block" } }}>
      <Image alt="" src="/cover.png" fill style={{ height: "100%", width: "100%", objectFit: "unset" }} />
    </Box>
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      <Image alt="" src="/cover-responsive.png" fill style={{ height: "100%", width: "100%", objectFit: "unset" }} />
    </Box>
    <Box sx={{ bgcolor: "red", position: "absolute", width: "100%", height: "100%", background: alpha("#222222", 0.3) }} />
    <Container>
      <Swiper
        pagination={{
          type: "bullets",
          clickable: true,
          bulletClass: "cover-slider-bullets",
          bulletActiveClass: "cover-slider-bullets-active",
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop
      >
        <SwiperSlide>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "start" }}>
            <Typography
              sx={{
                lineHeight: 1.2,
                textAlign: "start",
                fontWeight: { xs: 600, lg: 800 },
                fontSize: { xs: 36, sm: 46, md: 66, lg: 76, xl: 96 },
              }}
            >
              Value, Buy & Sell &#10;&#13; vacant land
            </Typography>
            <Typography sx={{ textAlign: "start", fontWeight: 500, fontSize: { xs: 16 }, mt: 1 }}>
              Value your land for FREE in less than 3 minutes!
            </Typography>
            <Button variant="contained" sx={{ textTransform: "none", mt: 8 }}>
              Get Started
            </Button>
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "start" }}>
            <Typography
              sx={{
                lineHeight: 1.2,
                textAlign: "start",
                fontWeight: { xs: 600, lg: 800 },
                fontSize: { xs: 36, sm: 46, md: 66, lg: 76, xl: 96 },
              }}
            >
              Value, Buy & Sell <br /> vacant land
            </Typography>
            <Typography sx={{ textAlign: "start", fontWeight: 500, fontSize: { xs: 16 }, mt: 1 }}>
              Value your land for FREE in less than 3 minutes!
            </Typography>
            <Button variant="contained" sx={{ textTransform: "none", mt: 8 }}>
              Get Started
            </Button>
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "start" }}>
            <Typography
              sx={{
                lineHeight: 1.2,
                textAlign: "start",
                fontWeight: { xs: 600, lg: 800 },
                fontSize: { xs: 36, sm: 46, md: 66, lg: 76, xl: 96 },
              }}
            >
              Value, Buy & Sell <br /> vacant land
            </Typography>
            <Typography sx={{ textAlign: "start", fontWeight: 500, fontSize: { xs: 16 }, mt: 1 }}>
              Value your land for FREE in less than 3 minutes!
            </Typography>
            <Button variant="contained" sx={{ textTransform: "none", mt: 8 }}>
              Get Started
            </Button>
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "start" }}>
            <Typography
              sx={{
                lineHeight: 1.2,
                textAlign: "start",
                fontWeight: { xs: 600, lg: 800 },
                fontSize: { xs: 36, sm: 46, md: 66, lg: 76, xl: 96 },
              }}
            >
              Value, Buy & Sell <br /> vacant land
            </Typography>
            <Typography sx={{ textAlign: "start", fontWeight: 500, fontSize: { xs: 16 }, mt: 1 }}>
              Value your land for FREE in less than 3 minutes!
            </Typography>
            <Button variant="contained" sx={{ textTransform: "none", mt: 8 }}>
              Get Started
            </Button>
          </Box>
        </SwiperSlide>
      </Swiper>
    </Container>
  </Box>
);

export default LandingMain;
