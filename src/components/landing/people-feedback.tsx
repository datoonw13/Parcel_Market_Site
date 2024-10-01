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

const PeopleFeedback = () => (
  <div className="space-y-6 md:space-y-8 lg:space-y-11 pl-5 sm:pl-8 md:pl-11 lg:px-16 xl:px-[11vw]">
    <div className="space-y-2 md:space-y-3 max-w-3xl mx-auto hidden lg:block">
      <h1 className="text-center font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl">What people say</h1>
    </div>
    <div>
      <Slider {...settings} className="overflow-hidden">
        {data.map((el) => (
          <div key={el.userName} className="space-y-6 p-9 shadow-4 rounded-2xl">
            <div className="flex gap-5 items-center">
              <Avatar className="bg-grey-200 flex items-center justify-center size-14">
                <AvatarFallback>
                  {el.userName[0]}
                  {el.userName[el.userName.length - 1]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg">{el.userName}</p>
                <p className="text-grey-600 font-medium text-xs">Business owner</p>
              </div>
            </div>
            <p className="text-grey-600 text-sm">{el.bio}</p>
          </div>
        ))}
      </Slider>
    </div>
  </div>
);

export default PeopleFeedback;

const data = [
  { userName: "Gaston.Russel30", bio: "Totam unde qui illo sed." },
  { userName: "Geovany_Jenkins", bio: "Velit quis autem quo necessitatibus." },
  { userName: "Roberta_Schamberger", bio: "Eum modi ex molestiae similique quidem." },
  { userName: "Jaquelin.Hirthe", bio: "Non excepturi voluptatem quidem." },
  { userName: "Gabriella61", bio: "Sunt et sunt id." },
  { userName: "Esta97", bio: "Rerum aut libero ut perferendis dolores sint iste." },
  { userName: "Eladio_Cummings42", bio: "Ab qui in totam temporibus fugit dicta." },
  { userName: "Britney.Jenkins", bio: "Nostrum iusto molestias tempore modi et aut laborum." },
  { userName: "Jerel_Strosin", bio: "Sit explicabo veritatis." },
  { userName: "Erling_West67", bio: "Optio voluptatibus assumenda nihil dolor nisi incidunt similique quo corporis." },
];
