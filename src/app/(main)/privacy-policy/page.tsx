import PrivacyPolicy from "@/components/shared/privacy-policy";
import Link from "next/link";
import React from "react";

const PrivacyPolicyPage = () => (
  <div className="px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw] flex grid-cols-1 lg:grid-cols-[minmax(0,_max-content)_1fr] pt-8 md:pt-12 gap-24">
    <ul className="flex-col gap-4 min-w-64 w-full hidden lg:flex sticky top-10 h-fit">
      <Link href="#1" className="scroll-smooth">
        <li className="text-grey-800">Who are our users?</li>
      </Link>
      <Link href="#2" className="scroll-smooth">
        <li className="text-grey-800">What information do we collect from our users?</li>
      </Link>
      <Link href="#3" className="scroll-smooth">
        <li className="text-grey-800">How do we use your private information?</li>
      </Link>
      <Link href="#4" className="scroll-smooth">
        <li className="text-grey-800">Can I request my personal information be deleted?</li>
      </Link>
      <Link href="#5" className="scroll-smooth">
        <li className="text-grey-800">How is my personal information stored?</li>
      </Link>
      <Link href="#6" className="scroll-smooth">
        <li className="text-grey-800">What am I agreeing to by using the website and services?</li>
      </Link>
      <Link href="#7" className="scroll-smooth">
        <li className="text-grey-800">Will I be notified if the website experiences a security breach?</li>
      </Link>
      <Link href="#8" className="scroll-smooth">
        <li className="text-grey-800">Will I be notified if the website’s Terms & Policies change?</li>
      </Link>
      <Link href="#9" className="scroll-smooth">
        <li className="text-grey-800">Who can I contact with questions or concerns?</li>
      </Link>
    </ul>
    <PrivacyPolicy modal={false} />
  </div>
);

export default PrivacyPolicyPage;
