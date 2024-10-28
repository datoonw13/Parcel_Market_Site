import TermsConditions from "@/components/shared/terms-conditions";
import Link from "next/link";
import React from "react";

const TermsConditionsPage = () => (
  <div className="px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw] flex grid-cols-1 lg:grid-cols-[minmax(0,_max-content)_1fr] pt-8 md:pt-12 gap-24">
    <ul className="gap-4 flex-col min-w-52 max-w-52 w-full hidden lg:flex sticky top-10 h-fit">
      <Link href="#1">
        <li className="text-grey-800">Acceptance of the Terms of Use</li>
      </Link>
      <Link href="#2">
        <li className="text-grey-800">Your use of the Company Website</li>
      </Link>
      <Link href="#3">
        <li className="text-grey-800">Changes to the Terms of Use </li>
      </Link>
      <Link href="#4">
        <li className="text-grey-800"> Accessing the Website and Account Security</li>
      </Link>
      <Link href="#5">
        <li className="text-grey-800">Intellectual Property & Trademark Rights</li>
      </Link>
      <Link href="#6">
        <li className="text-grey-800">Prohibited Uses </li>
      </Link>
      <Link href="#7">
        <li className="text-grey-800">User Contributions Monitoring and Enforcement; Termination</li>
      </Link>
      <Link href="#8">
        <li className="text-grey-800">Links from the Website</li>
      </Link>
      <Link href="#9">
        <li className="text-grey-800">Geographic Restrictions</li>
      </Link>
      <Link href="#10">
        <li className="text-grey-800">Disclaimer of Warranties and Limited Liability</li>
      </Link>
      <Link href="#11">
        <li className="text-grey-800">Governing Law and Jurisdiction</li>
      </Link>
      <Link href="#12">
        <li className="text-grey-800">Your Comments and Concerns</li>
      </Link>
    </ul>
    <TermsConditions modal={false} />
  </div>
);

export default TermsConditionsPage;
