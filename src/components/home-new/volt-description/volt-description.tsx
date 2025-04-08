"use client";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import useMediaQuery from "@/hooks/useMediaQuery";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import styles from "./styles.module.css";
import { breakPoints } from "../../../../tailwind.config";

// import required modules
const images = ["1.webp", "2.webp", "3.webp"];

const VoltDescription = () => {
  const { targetReached: isSm } = useMediaQuery(parseFloat(breakPoints.md));
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperRef | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative ">
      <div className="max-w-7xl mx-auto lg:px-20 pt-8 md:pt-12 lg:pt-16 px-4 pb-4 shadow-[0px_17.56px_42.15px_0px_rgba(0,0,0,0.08)] lg:shadow-none rounded-b-2xl space-y-8">
        <div className="px-2 space-y-2">
          <h1 className="text-center font-extrabold text-2xl">VOLT - Value of Land Tool</h1>
          <h2 className="text-center font-light">
            Land evaluation has never been easier! access comparable sales around your property Instantly!
          </h2>
        </div>

        <div className="relative  h-[660px] max-h-[51vw] w-full lg:bg-white lg:p-5 lg:pb-9 lg:shadow-[0px_17.56px_42.15px_0px_rgba(0,0,0,0.08)] lg:border rounded-2xl">
          <button
            type="button"
            onClick={() => {
              swiperRef.current?.swiper.slidePrev();
            }}
            ref={navigationPrevRef}
            className="hidden -translate-x-[120%] lg:flex absolute bg-white rounded-full border size-12 xl:size-16 z-10 items-center justify-center left-0 top-[50%] -translate-y-[50%]"
          >
            <MdKeyboardArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              swiperRef.current?.swiper.slideNext();
            }}
            ref={navigationNextRef}
            className="hidden translate-x-[120%] lg:flex absolute bg-white rounded-full border size-12 xl:size-16 z-10 items-center justify-center right-0 top-[50%] -translate-y-[50%]"
          >
            <MdKeyboardArrowRight className="size-5" />
          </button>
          <Swiper
            loop
            onSlideChange={(e) => {
              setActiveIndex(e.realIndex);
            }}
            ref={swiperRef}
            // autoplay={{
            //   delay: 2500,
            //   disableOnInteraction: false,
            // }}
            spaceBetween={30}
            effect="fade"
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
              enabled: true,
            }}
            pagination={{
              clickable: true,
              el: paginationRef.current,
              bulletClass: styles["swiper-bullet-custom"],
              bulletActiveClass: styles["swiper-bullet-custom-active"],
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className={cn(
              "w-full h-full mySwiper [&>.swiper-pagination]:!absolute [&>.swiper-pagination]:justify-center [&>.swiper-pagination]:!bottom-10 [&>.swiper-pagination]:flex"
            )}
          >
            {images.map((el, elI) => (
              <SwiperSlide key={el + elI.toString()} className="">
                <div className="relative w-full aspect-[1075/596]">
                  <Image
                    alt=""
                    src={`/home-slides/desktop/${el}`}
                    fill
                    loading="lazy"
                    className="w-full h-full !object-fill"
                    quality={100}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex items-center gap-3 mt-8 justify-center lg:-translate-y-[16px]">
            <button
              type="button"
              ref={navigationPrevRef}
              className="lg:hidden bg-white rounded-full border size-6 flex items-center justify-center"
            >
              <MdKeyboardArrowLeft className="size-5" />
            </button>
            <ul className="flex items-center gap-2">
              {images.map((_, i) => (
                <li
                  onClick={() => {
                    swiperRef.current?.swiper.slideTo(i);
                    setActiveIndex(i);
                  }}
                  key={(i * 2).toString()}
                  className={cn(
                    styles["swiper-bullet-custom"],
                    "bg-primary-main-100",
                    activeIndex === i && styles["swiper-bullet-custom-active"],
                    activeIndex === i && "bg-primary-main"
                  )}
                />
              ))}
            </ul>
            <button
              type="button"
              ref={navigationNextRef}
              className="lg:hidden bg-white rounded-full border size-6 flex items-center justify-center"
            >
              <MdKeyboardArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoltDescription;
