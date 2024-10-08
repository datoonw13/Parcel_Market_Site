import PrivacyPolicy from "@/components/shared/privacy-policy";
import React from "react";

const PrivacyPolicyPage = () => (
  <div className="px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw] flex grid-cols-1 lg:grid-cols-[minmax(0,_max-content)_1fr] pt-8 md:pt-12 gap-24">
    <ul className="space-y-4 min-w-64 w-full hidden lg:block">
      <li className="text-grey-800">Who are our users?</li>
      <li className="text-grey-800">What information do we collect from our users?</li>
      <li className="text-grey-800">How do we use your private information?</li>
    </ul>
    <PrivacyPolicy modal={false} />
  </div>
);

export default PrivacyPolicyPage;
