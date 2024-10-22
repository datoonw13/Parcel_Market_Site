"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import Fade from "embla-carousel-fade";
import Autoplay from "embla-carousel-autoplay";
import { AutoComplete } from "@/components/ui/autocomplete";
import { getAllStates, getCounties, getCountyValue, getStateValue } from "@/helpers/states";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";

// const images = ["/cover-1.png", "/cover-2.png", "/cover-3.png", "/cover-4.png"];
const images = ["/bg2.jpg"];

const LandingSlider = () => {
  const router = useRouter();
  const [values, setValues] = useState<{
    state: string | null;
    county: string | null;
  }>({
    state: null,
    county: null,
  });
  const states = useMemo(() => getAllStates({ filterBlackList: true }).map(({ counties, ...rest }) => rest), []);
  const counties = useMemo(() => getCounties(values.state), [values.state]);

  return (
    <div className="w-full relative">
      <Carousel className="w-full" plugins={[Fade(), Autoplay({ delay: 4000 })]} opts={{ loop: true }}>
        <CarouselContent className="h-[46vw] min-h-[540px] max-h-[660px]">
          {images.map((image) => (
            <CarouselItem key={image} className="w-full relative select-none">
              <div className="w-full h-full relative after:absolute after:bg-black/40 after:h-full after:w-full after:content-['']">
                <Image alt="" src={image} fill loading="eager" className="w-full h-full  object-cover" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute top-0 w-full h-full flex flex-col items-center justify-center">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 md:px-20 lg:px-32 grid">
          <h1 className="text-white text-2xl sm:text-4xl md:text-6xl lg:text-[54px] font-bold text-center mx-auto !leading-tight grid gap-x-3 grid-cols-[minmax(0,_max-content)_minmax(0,_max-content)]">
            <span>Save Time.</span> <span>Save Money.</span>
          </h1>
          <div className="bg-white mt-6 md:mt-8 mb-4 rounded-xl p-4 grid md:grid-flow-col gap-3 max-w-3xl w-full mx-auto">
            <AutoComplete
              selectedValue={values.state}
              options={states}
              placeholder="State"
              onValueChange={(state) => {
                setValues({ state, county: null });
              }}
            />
            <AutoComplete
              options={counties}
              placeholder="County"
              onValueChange={(county) => {
                setValues({ ...values, county });
              }}
              selectedValue={getCountyValue(values.county, values.state)?.value || null}
              disabled={!values.state}
            />
            <Button
              disabled={!values.county || !values.state}
              onClick={() => router.push(`${routes.volt.fullUrl}?state=${values.state}&county=${values.county}`)}
            >
              Get Started
            </Button>
          </div>
          <h2 className="sm:text-lg font-semibold text-center text-white row-end-3 md:row-end-4 mt-2">
            Calculate an average market value in seconds for free!
          </h2>
        </div>
      </div>
    </div>
  );
};

export default LandingSlider;
