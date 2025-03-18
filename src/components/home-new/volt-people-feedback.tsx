"use client";

import { AvatarFallback } from "@radix-ui/react-avatar";
import Slider from "react-slick";
import { Avatar } from "../ui/avatar";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const settings = {
  slidesToShow: 3,
  infinite: true,
  centerMode: false,
  dots: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2.03,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 650,
      settings: {
        slidesToShow: 1.04,
        slidesToScroll: 1,
      },
    },
  ],
  appendDots: (dots: any) => <ul style={{ position: "initial", marginTop: 10 }}>{dots}</ul>,
  customPaging: () => (
    <div className="size-2 rounded-full bg-primary-main-100 [.slick-active_&]:w-4 [.slick-active_&]:bg-primary-main transition-all duration-100" />
  ),
};

const VoltPeopleFeedback = () => (
  <div className="space-y-6 md:space-y-8 lg:space-y-11 max-w-7xl mx-auto pl-4 lg:px-8 xl:px-20 mt-16">
    <div className="space-y-2 md:space-y-3 max-w-3xl mx-auto">
      <h1 className="text-center font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl">What people say</h1>
    </div>
    <div>
      <Slider
        {...settings}
        className="overflow-hidden [&_.slick-track]:py-5 [&_.slick-track]:!grid [&_.slick-track]:grid-flow-col [&_slick-slide]:h-full [&_slick-slide>*]:!h-full"
      >
        {data.map((el) => (
          <div key={el.userName} className="!flex flex-col justify-between space-y-6 p-9 shadow-4 rounded-2xl h-full">
            <div className="flex gap-5 items-start">
              <Avatar className="bg-grey-200 flex items-center justify-center size-14">
                <AvatarFallback>
                  {el.userName[0]}
                  {el.userName.split(" ")[1][0]}
                </AvatarFallback>
              </Avatar>
              <div className="mt-1">
                <p className="font-medium text-lg">{el.userName}</p>
                <p className="text-grey-600 font-medium text-xs">Business owner</p>
              </div>
            </div>
            <p className="text-grey-600 text-sm line-clamp-4">{el.bio}</p>
          </div>
        ))}
      </Slider>
    </div>
  </div>
);

export default VoltPeopleFeedback;

const data = [
  {
    userName: "Bradley B. - Land Investor",
    bio: `Parcel Market is an invaluable tool, offering quick property comparisons and 
accurate valuations, saving me time and providing reliable data to better serve my 
clients.`,
  },
  {
    userName: "Dustin G. – Land Investor",
    bio: `Parcel Market has drastically cut my research time, allowing me to review 10 
properties in the time it previously took to research just one.`,
  },
  {
    userName: "Micheal D. – Real Estate Agent",
    bio: `Parcel Market’s data saves me hours, letting me research multiple properties 
faster and with confidence—an essential tool in my real estate work.`,
  },
  {
    userName: "Justin D.- Real Estate Agent",
    bio: `With Parcel Market, researching properties is faster and more efficient. Its 
comprehensive data enables quick and reliable land evaluations.`,
  },
  {
    userName: "Conor M. – Real Estate Agent",
    bio: `Parcel Market has transformed my workflow. The platform’s ease and accuracy let 
me complete thorough property research in a fraction of the time`,
  },
  {
    userName: "Joey N. - Land Investor",
    bio: `Parcel Market streamlines my research, providing fast, accurate property insights. 
It’s a must-have tool for efficient land evaluation and decision-making`,
  },
];
