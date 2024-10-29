"use client";

import PrivacyPolicy from "@/components/shared/privacy-policy";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

const PrivacyPolicyPage = () => {
  const [selected, setSelected] = useState(1);
  return (
    <div className="px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw] flex grid-cols-1 lg:grid-cols-[minmax(0,_max-content)_1fr] pt-8 md:pt-12 gap-24">
      <ul className="flex-col gap-4 min-w-64 w-full hidden lg:flex sticky top-10 h-fit">
        <li
          onClick={() => {
            document.getElementById("1")?.scrollIntoView({ block: "start" });
            setSelected(1);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 1 && "font-semibold")}
        >
          Who are our users?
        </li>
        <li
          onClick={() => {
            document.getElementById("2")?.scrollIntoView({ block: "start" });
            setSelected(2);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 2 && "font-semibold")}
        >
          What information do we collect from our users?
        </li>
        <li
          onClick={() => {
            document.getElementById("3")?.scrollIntoView({ block: "start" });
            setSelected(3);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 3 && "font-semibold")}
        >
          How do we use your private information?
        </li>
        <li
          onClick={() => {
            document.getElementById("4")?.scrollIntoView({ block: "start" });
            setSelected(4);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 4 && "font-semibold")}
        >
          Can I request my personal information be deleted?
        </li>
        <li
          onClick={() => {
            document.getElementById("5")?.scrollIntoView({ block: "start" });
            setSelected(5);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 5 && "font-semibold")}
        >
          How is my personal information stored?
        </li>
        <li
          onClick={() => {
            document.getElementById("6")?.scrollIntoView({ block: "start" });
            setSelected(6);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 6 && "font-semibold")}
        >
          What am I agreeing to by using the website and services?
        </li>
        <li
          onClick={() => {
            document.getElementById("7")?.scrollIntoView({ block: "start" });
            setSelected(7);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 7 && "font-semibold")}
        >
          Will I be notified if the website experiences a security breach?
        </li>
        <li
          onClick={() => {
            document.getElementById("8")?.scrollIntoView({ block: "start" });
            setSelected(8);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 8 && "font-semibold")}
        >
          Will I be notified if the website’s Terms & Policies change?
        </li>
        <li
          onClick={() => {
            document.getElementById("9")?.scrollIntoView({ block: "start" });
            setSelected(9);
          }}
          className={cn("text-grey-800 cursor-pointer", selected === 9 && "font-semibold")}
        >
          Who can I contact with questions or concerns?
        </li>
      </ul>
      <PrivacyPolicy modal={false} />
    </div>
  );
};

export default PrivacyPolicyPage;
