"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import { Box, Button, Container, Typography, alpha } from "@mui/material";
import { useState } from "react";
import { Swiper as SwiperType } from "swiper/types";

const LandingMain = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <>
      {/* <Button onClick={() => swiper?.slideTo(0)}>next</Button> */}

      <Box sx={{ position: "relative" }}>
        <Swiper
          modules={[Autoplay, EffectFade]}
          className="mySwiper"
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          onSwiper={(swiper) => setSwiper(swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          // loop
          effect="fade"
        >
          {images.map((image) => (
            <SwiperSlide key={image}>
              <Box sx={{ position: "relative", height: { xs: 400, sm: 450, md: 500, lg: 550, xl: 660 } }}>
                <Image alt="" src={image} fill loading="eager" />
                <Box
                  sx={(theme) => ({
                    bgcolor: alpha(theme.palette.black, 0.3),
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    zIndex: 1,
                  })}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            color: "white",
          }}
        >
          <Container sx={{ display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "start" }}>
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
            <Button variant="contained" sx={{ textTransform: "none", my: 4 }}>
              Get Started
            </Button>
            <Box sx={{ display: "flex", gap: 1, position: "relative", zIndex: 2 }}>
              {images.map((el, i) => (
                <Box
                  key={el}
                  onClick={() => swiper?.slideTo(i)}
                  sx={(theme) => ({
                    width: activeIndex === i ? 30 : 8,
                    height: 8,
                    borderRadius: activeIndex === i ? 8 : 8,
                    transition: "width 0.3s",
                    bgcolor: alpha(theme.palette.white, activeIndex === i ? 1 : 0.6),
                    cursor: "pointer",
                  })}
                />
              ))}
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default LandingMain;

const images = ["/cover-1.png", "/cover-2.png", "/cover-3.png", "/cover-4.png"];
