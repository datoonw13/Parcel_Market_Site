"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

const LandingSection3 = () => {
  const ref = useRef<HTMLDivElement>();

  const calcLeftSpace = () => {
    const el = document.getElementById("root-header-logo");
    if (ref.current) {
      ref.current.style.marginLeft = `${el?.offsetLeft || 0}px`;
    }
  };

  useEffect(() => {
    calcLeftSpace();
    window.addEventListener("resize", calcLeftSpace);
    return () => {
      calcLeftSpace();
    };
  }, []);

  return (
    <Box sx={{ pr: 0, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" }, gap: 4 }} ref={ref}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, position: "relative" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ fontWeight: 600, fontSize: { xs: 24, sm: 28, md: 32, lg: 36 } }}>Buy land near you</Typography>
          <Typography sx={{ color: "grey.800", fontSize: 14 }}>
            Welcome to Parcel Market and thank You for being here. At Parcel Market, our goal is simple, to provide a FREE and convenient
            place to start when making decisions regarding vacant land.
          </Typography>
        </Box>
        <Button variant="contained">View All</Button>
      </Box>
      <Box sx={{ display: "grid", justifyContent: "center", pl: { xs: 2.5 } }}>
        <Swiper
          spaceBetween={24}
          slidesPerView={1.5}
          breakpoints={{
            320: {
              slidesPerView: 1.5,
            },
            600: {
              slidesPerView: 2.5,
            },
            1200: {
              slidesPerView: 3.5,
            },
          }}
          pagination={{
            clickable: true,
          }}
        >
          {images.map((el) => (
            <SwiperSlide key={el.src}>
              <Box>
                <Box sx={{ position: "relative", width: "100%", height: 253 }}>
                  <Image alt="" src={el.src} fill style={{ borderRadius: 16 }} />
                </Box>
                <Typography sx={{ fontWeight: 600, color: "black", textAlign: "start", mt: 1 }}>{el.title}</Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default LandingSection3;

const images = new Array(6).fill(0).map((_, i) => ({ src: `/land${i + 1}.png`, title: "Land name goes here" }));
