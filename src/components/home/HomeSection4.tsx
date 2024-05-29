"use client";

import { Avatar, Box, Fade, Typography, alpha } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css/effect-fade";

const HomeSection4 = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(0);
  const ref = useRef<HTMLDivElement>();

  const indexLeft = activeIndex;
  const indexRight = activeIndex + slidesPerView - 1;

  const calcLeftSpace = () => {
    const el = document.getElementById("root-header-logo");
    if (ref.current) {
      ref.current.style.marginLeft = `${el?.offsetLeft || 0}px`;
      if (window.screen.width > 800) {
        ref.current.style.marginRight = `${el?.offsetLeft || 0}px`;
      }
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
    <Box sx={{ pr: 0, display: "grid", gridTemplateColumns: { xs: "1fr" }, gap: 4 }} ref={ref}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontSize: 16, textAlign: "center", mb: 0.5, color: "primary.main" }}>TESTIMONIALS</Typography>
        <Typography sx={{ fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, textAlign: "center", fontWeight: 600 }}>What people say</Typography>
      </Box>
      <Box sx={{ display: "grid", justifyContent: "center", pl: { xs: 2.5 } }}>
        <Swiper
          spaceBetween={0}
          modules={[Autoplay]}
          slidesPerView={1.2}
          onSwiper={(swiper) => {
            setSwiper(swiper);
            setActiveIndex(swiper.activeIndex);
            setSlidesPerView(Number(swiper.params.slidesPerView));
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            setSlidesPerView(Number(swiper.params.slidesPerView));
          }}
          effect="fade"
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
            },
            650: {
              slidesPerView: 1.5,
            },
            850: {
              slidesPerView: 2.5,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
          pagination={{
            clickable: true,
          }}
        >
          {list.map((el, i) => (
            <SwiperSlide key={el.title}>
              <Box
                sx={{
                  cursor: "pointer",
                  p: 2,
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                <Box boxShadow={1} sx={{ p: 4.5, borderRadius: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                    <Fade timeout={800} in={i >= indexLeft && i <= indexRight}>
                      <Avatar sx={{ width: 56, height: 56 }} />
                    </Fade>

                    <Box>
                      <Typography sx={{ fontWeight: 500, color: "black", fontSize: 18, textAlign: "start" }}>{el.title}</Typography>
                      <Typography sx={{ color: "grey.600", fontSize: 12, textAlign: "start" }}>{el.role}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ color: "grey.600", fontSize: 14, textAlign: "start", mt: 3 }}>{el.desc}</Typography>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
        <Box sx={{ display: "flex", gap: 1, position: "relative", zIndex: 2, m: "auto" }}>
          {new Array(Math.ceil(Number(6 - slidesPerView) + 1))
            .fill(0)
            .map((_, i) => i)
            .map((el) => (
              <Box
                key={el}
                onClick={() => swiper?.slideTo(el)}
                sx={(theme) => ({
                  width: activeIndex === el ? 30 : 8,
                  height: 8,
                  borderRadius: activeIndex === el ? 8 : 8,
                  transition: "width 0.3s",
                  bgcolor: alpha(theme.palette.primary.main, activeIndex === el ? 1 : 0.6),
                  cursor: "pointer",
                })}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default HomeSection4;

const list = new Array(6).fill(0).map((_, i) => ({
  src: null,
  title: `Name Surname ${i + 1}`,
  role: "Business owner",
  desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque...Sed ut perspiciatis unde ",
}));
