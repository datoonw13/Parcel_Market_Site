import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const LandingQuestions = () => (
  <div className="space-y-6 md:space-y-8 lg:space-y-11 px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw] ">
    <div className="space-y-2 md:space-y-3 max-w-3xl mx-auto">
      <h1 className="text-center font-extrabold text-2xl md:text-3xl lg:text-4xl xl:text-5xl">Frequently asked questions</h1>
    </div>
    <Accordion type="single" collapsible className="w-full border border-grey-100 rounded-2xl p-6 md:p-9">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It comes with default styles that matches the other components&apos; aesthetic.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes. It&apos;s animated by default, but you can disable it if you prefer.</AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export default LandingQuestions;
