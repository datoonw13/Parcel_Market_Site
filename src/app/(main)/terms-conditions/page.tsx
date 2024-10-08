import TermsConditions from "@/components/shared/terms-conditions";
import React from "react";

const TermsConditionsPage = () => (
  <div className="px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw] flex grid-cols-1 lg:grid-cols-[minmax(0,_max-content)_1fr] pt-8 md:pt-12 gap-24">
    <ul className="space-y-4 min-w-52 max-w-52 w-full hidden lg:block">
      <li className="text-grey-800">Acceptance of the Terms of Use</li>
      <li className="text-grey-800">Your use of the Company Website</li>
    </ul>
    <TermsConditions modal={false} />
  </div>
);

export default TermsConditionsPage;
