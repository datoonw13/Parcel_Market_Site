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
  return (
    <>
      {/* <Button onClick={() => swiper?.slideTo(0)}>next</Button> */}

      <Box sx={{ position: "relative" }}>
        <Swiper
          modules={[Autoplay, EffectFade]}
          className="mySwiper"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          onSwiper={(swiper) => {
            setSwiper(swiper);
          }}
          loop
          effect="fade"
        >
          <SwiperSlide>
            <Box sx={{ position: "relative", height: { xs: 400, sm: 450, md: 500, lg: 550, xl: 660 } }}>
              <Image alt="" src="/cover-1.png" fill />
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
          <SwiperSlide>
            <Box sx={{ position: "relative", height: { xs: 400, sm: 450, md: 500, lg: 550, xl: 660 } }}>
              <Image alt="" src="/cover-2.png" fill />
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
          <SwiperSlide>
            <Box sx={{ position: "relative", height: { xs: 400, sm: 450, md: 500, lg: 550, xl: 660 } }}>
              <Image alt="" src="/cover-3.png" fill />
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
          <SwiperSlide>
            <Box sx={{ position: "relative", height: { xs: 400, sm: 450, md: 500, lg: 550, xl: 660 } }}>
              <Image alt="" src="/cover-4.png" fill />
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
        </Swiper>
      </Box>
    </>
  );
};

export default LandingMain;
