import React from "react";
import Link from "next/link";
import routes from "@/helpers/routes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";

const LandingQuestions = () => (
  <div className=" flex flex-col gap-6 md:gap-8 lg:gap-11 px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw] ">
    <div className="space-y-2 md:space-y-3 max-w-4xl mx-auto">
      <h1 className="text-center font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Frequently asked questions</h1>
    </div>
    <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
      {list.map((el, i) => (
        <AccordionItem className="bg-white border border-[#D5D3D3] rounded-2xl px-5 md:px-7 lg:px-10 " key={el.title} value={i.toString()}>
          <AccordionTrigger className="text-start items-baseline">{el.title}</AccordionTrigger>
          <AccordionContent>{el.description}</AccordionContent>
        </AccordionItem>
      ))}
      <AccordionItem className="bg-white border border-[#D5D3D3] rounded-2xl px-5 md:px-7 lg:px-10  relative" disabled value="no">
        <AccordionTrigger className="text-start items-baseline">How much time can VOLT save?</AccordionTrigger>
        <AccordionContent>
          Our testers, who are real estate professionals in the land business, can research on average 10 vacant land parcels in the time it
          would typically take to analyze 2, using traditional methods. This substantial time saving enhances productivity, allowing you to
          explore more opportunities and make informed decisions much faster, leading to an increased deal flow and better understanding of
          vacant land markets.
        </AccordionContent>
        <div
          style={{
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.7) 5%, #fff 100%)",
          }}
          className="absolute w-full h-full rounded-2xl left-0 top-0"
        />
      </AccordionItem>
    </Accordion>
    <Link href={routes.questions.fullUrl}>
      <Button className="max-w-xs w-full mx-auto flex">See More</Button>
    </Link>
  </div>
);

export default LandingQuestions;

const list = [
  {
    title: `What is VOLT and VOLT Value?`,
    description: `VOLT is a free vacant land value tool that changes the way real estate professionals begin understanding values around a specific parcel of vacant land. Taking less than 30 seconds, VOLT utilizes county sale data and a subject property’s location and size to calculate the average price of sold properties in the market area. This average is called the VOLT Value. The VOLT Value offers a preliminary understanding of average land values in a specific area without sifting through qualified and unqualified comps and computing an average value on your own. It is the ultimate starting point for evaluating vacant land.`,
  },
  {
    title: `How is VOLT and Parcel Market different from other land information websites?`,
    description: `While there are many sophisticated land information websites out there offering tons of land data, Parcel Market’s VOLT gets to the point where we are all initially concerned the most – value! VOLT answers this question the quickest and with the least number of steps. Sophistication and information overload is great, but sometimes we just need a quick answer regarding value to see if a vacant land parcel is even worth investigating further. VOLT saves users huge amounts of time and resources when all you need is an idea of the market surrounding a specific tract of vacant land. `,
  },
  {
    title: `How does VOLT calculate the VOLT Value?`,
    description: (
      <span>
        The VOLT Value is an average of sold vacant land transactions of similar size, over the past 2 years, and within 10 miles. By
        employing advanced algorithms, VOLT analyzes county sales data with respect to the subject property’s location, and size. Our
        algorithms filter sales data to ensure VOLT is using the most relevant sales for calculating an average sold price in each market
        area. VOLT does not account for other property characteristics and is only a starting point for understanding the market values
        surrounding a parcel of vacant land of similar size. <b>It is not an appraisal of value for the subject property</b>.
      </span>
    ),
  },
  {
    title: `Do I need to create an account and pay to use the VOLT?`,
    description: `The short answer is no! We want VOLT to be free for everyone’s benefit. Although data is very expensive, VOLT is designed for immediate use without requiring you to create an account or submit personal information, ensuring a seamless and hassle-free experience. However, to access, export, and/or analyze the sales data which VOLT uses to calculate the VOLT Value, you will need a subscription to Parcel Market. This is how we monetize Parcel Market and provide the best possible data and tool features for our users.`,
  },
];
