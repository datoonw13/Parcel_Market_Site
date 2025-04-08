"use client";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
// import required modules
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import routes from "@/helpers/routes";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import useStates from "@/hooks/useStates";
import { AutoComplete } from "../../ui/autocomplete";
import { Button } from "../../ui/button";
import { breakPoints } from "../../../../tailwind.config";
import styles from "./styles.module.css";

const images = ["/bg2.jpg", "/bg2.jpg", "/bg2.jpg", "/bg2.jpg"];

const SlideShow = () => {
  const { targetReached: isSm } = useMediaQuery(parseFloat(breakPoints.md));
  const router = useRouter();
  const [values, setValues] = useState<{
    state: string | null;
    county: string | null;
  }>({
    state: null,
    county: null,
  });

  const { states, counties, getCounty, getCountiesByState } = useStates({ hideBlackListedStated: true });

  return (
    <div className="relative h-full w-full">
      <Swiper
        // autoplay={{
        //   delay: 2500,
        //   disableOnInteraction: false,
        // }}
        spaceBetween={30}
        effect="fade"
        navigation
        // {...(!isSm && {
        //   pagination: {
        //     clickable: true,
        //     bulletClass: styles["swiper-bullet-custom"],
        //     bulletActiveClass: styles["swiper-bullet-custom-active"],
        //   },
        // })}
        modules={isSm ? [EffectFade, Autoplay] : [EffectFade, Autoplay, Pagination]}
        className={cn(
          "mySwiper [&>.swiper-pagination]:!absolute [&>.swiper-pagination]:justify-center [&>.swiper-pagination]:!bottom-10 [&>.swiper-pagination]:flex"
        )}
      >
        {images.map((el, elI) => (
          <SwiperSlide key={el + elI.toString()}>
            <div className="w-full h-full relative after:absolute after:left-0 after:bg-black/40 after:h-full after:w-full after:content-['']">
              <Image alt="" src={el} fill loading="eager" className="w-full h-full  object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute top-[50%] -translate-y-[60%] left-[50%] -translate-x-[50%] z-10 px-5 w-full">
        <div className="space-y-2 px-2">
          <h1 className="text-3xl text-center text-white font-bold">Revolutionize Land Evaluation!</h1>
          <h2 className="text-white font-semibold text-center lg:hidden">Find, Analyze, and compare Land Data Instantly</h2>
        </div>
        <div className="bg-white mt-6 md:mt-8 mb-4 rounded-xl p-4 grid md:grid-flow-col gap-3 max-w-3xl w-full mx-auto">
          <AutoComplete
            selectedValue={values.state}
            options={states}
            placeholder="State"
            onValueChange={(state) => {
              setValues({ state, county: null });
            }}
            id="landing__state-autocomplete"
          />
          <AutoComplete
            options={values.state ? getCountiesByState(values.state) || [] : []}
            placeholder="County"
            onValueChange={(county) => {
              setValues({ ...values, county });
            }}
            selectedValue={getCounty(values.state || "", values.county || "")?.short.value || null}
            disabled={!values.state}
            id="landing__county-autocomplete"
          />
          <Button
            className="h-full"
            id="landing__volt-submit-button"
            disabled={!values.county || !values.state}
            onClick={() => router.push(`${routes.volt.fullUrl}?state=${values.state}&county=${values.county}&fromHome=true`)}
          >
            Get Started
          </Button>
        </div>
        <h3 className="text-white hidden lg:block text-center font-semibold">Find, Analyze, and compare Land Data Instantly</h3>
      </div>
    </div>
  );
};

export default SlideShow;
