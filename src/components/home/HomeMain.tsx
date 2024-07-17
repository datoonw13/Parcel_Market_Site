"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import { Autocomplete, Box, Button, Container, Paper, TextField, Typography, alpha } from "@mui/material";
import { useState } from "react";
import { Swiper as SwiperType } from "swiper/types";
import { getAllStates, getCounties, getCountyValue, getStateValue } from "@/helpers/states";
import { useRouter } from "next/navigation";
import routes from "@/helpers/routes";
import AutoCompleteListboxComponent from "../shared/AutoCompleteListboxComponent";

const HomeMain = () => {
  const router = useRouter();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [state, setState] = useState<string | null>(null);
  const [county, setCounty] = useState<string | null>(null);

  const onStart = () => {
    router.push(`${routes.valueLand.fullUrl}?state=${state}&county=${county}`);
  };
  return (
    <>
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
              <Box sx={{ position: "relative", height: { xs: 536, sm: 500, md: 500, lg: 550, xl: 660 } }}>
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
          <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Typography
              sx={{
                lineHeight: 1.2,
                textAlign: "center",
                fontWeight: { xs: 600, lg: 700 },
                fontSize: { xs: 36, sm: 42, md: 56, lg: 64 },
              }}
            >
              Value. Buy. Sell. <br /> Vacant Land
            </Typography>

            <Box
              component={Paper}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr auto", md: "minmax(276px,1fr) minmax(276px,1fr) auto" },
                width: { xs: "100%", md: "max-content" },
                gap: 2,
                p: 2,
                borderRadius: 3,
                mt: 3,
              }}
            >
              <Autocomplete
                sx={{ maxWidth: { xs: "100%" }, width: "100%" }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="State" InputProps={{ ...params.InputProps }} />}
                ListboxComponent={AutoCompleteListboxComponent}
                options={getAllStates({ filterBlackList: true })}
                value={getStateValue(state)}
                onChange={(_, newValue) => {
                  setState(newValue?.value || null);
                  setCounty(null);
                }}
              />
              <Autocomplete
                sx={{ maxWidth: { xs: "100%" }, width: "100%" }}
                fullWidth
                renderInput={(params) => <TextField {...params} label="County" InputProps={{ ...params.InputProps }} />}
                ListboxComponent={AutoCompleteListboxComponent}
                options={getCounties(state)}
                value={getCountyValue(county, state)}
                disabled={!state}
                onChange={(_, newValue) => {
                  setCounty(newValue?.value || null);
                }}
              />
              <Button variant="contained" sx={{ width: { xs: "100%", sm: "fit-content" } }} disabled={!state || !county} onClick={onStart}>
                Get Started
              </Button>
            </Box>
            <Typography sx={{ textAlign: "center", fontWeight: 600, fontSize: 18, mt: 1, display: { xs: "none", md: "block" } }}>
              View land values around your property in just a few clicks!
            </Typography>
            <Box sx={{ display: "flex", gap: 1, position: "absolute", zIndex: 2, bottom: 0, mb: { xs: 8, sm: 6, md: 4 } }}>
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

export default HomeMain;

const images = ["/cover-1.png", "/cover-2.png", "/cover-3.png", "/cover-4.png"];
