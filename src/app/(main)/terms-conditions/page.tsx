"use client";

import TermsConditions from "@/components/shared/terms-conditions";
import { cn } from "@/lib/utils";
import { useState } from "react";

const TermsConditionsPage = () => {
  const [selected, setSelected] = useState(1);
  return (
    <div className="px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw] flex grid-cols-1 lg:grid-cols-[minmax(0,_max-content)_1fr] pt-8 md:pt-12 gap-24">
      <ul className="gap-4 flex-col min-w-52 max-w-52 w-full hidden lg:flex sticky top-10 h-fit">
        <li
          onClick={() => {
            document.getElementById("1")?.scrollIntoView({ block: "start" });
            setSelected(1);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 1 && "font-semibold")}
        >
          Acceptance of the Terms of Use
        </li>

        <li
          onClick={() => {
            document.getElementById("2")?.scrollIntoView({ block: "start" });
            setSelected(2);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 2 && "font-semibold")}
        >
          Your use of the Company Website
        </li>

        <li
          onClick={() => {
            document.getElementById("3")?.scrollIntoView({ block: "start" });
            setSelected(3);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 3 && "font-semibold")}
        >
          Changes to the Terms of Use{" "}
        </li>

        <li
          onClick={() => {
            document.getElementById("4")?.scrollIntoView({ block: "start" });
            setSelected(4);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 4 && "font-semibold")}
        >
          {" "}
          Accessing the Website and Account Security
        </li>

        <li
          onClick={() => {
            document.getElementById("5")?.scrollIntoView({ block: "start" });
            setSelected(5);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 5 && "font-semibold")}
        >
          Intellectual Property & Trademark Rights
        </li>

        <li
          onClick={() => {
            document.getElementById("6")?.scrollIntoView({ block: "start" });
            setSelected(6);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 6 && "font-semibold")}
        >
          Prohibited Uses{" "}
        </li>

        <li
          onClick={() => {
            document.getElementById("7")?.scrollIntoView({ block: "start" });
            setSelected(7);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 7 && "font-semibold")}
        >
          User Contributions Monitoring and Enforcement; Termination
        </li>

        <li
          onClick={() => {
            document.getElementById("8")?.scrollIntoView({ block: "start" });
            setSelected(8);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 8 && "font-semibold")}
        >
          Links from the Website
        </li>

        <li
          onClick={() => {
            document.getElementById("9")?.scrollIntoView({ block: "start" });
            setSelected(9);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 9 && "font-semibold")}
        >
          Geographic Restrictions
        </li>

        <li
          onClick={() => {
            document.getElementById("10")?.scrollIntoView({ block: "start" });
            setSelected(10);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 10 && "font-semibold")}
        >
          Disclaimer of Warranties and Limited Liability
        </li>

        <li
          onClick={() => {
            document.getElementById("11")?.scrollIntoView({ block: "start" });
            setSelected(11);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 11 && "font-semibold")}
        >
          Governing Law and Jurisdiction
        </li>
        <li
          onClick={() => {
            document.getElementById("12")?.scrollIntoView({ block: "start" });
            setSelected(12);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 12 && "font-semibold")}
        >
          Your Comments and Concerns
        </li>
      </ul>
      <TermsConditions modal={false} />
    </div>
  );
};

export default TermsConditionsPage;
