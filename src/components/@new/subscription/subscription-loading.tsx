import React from "react";
import SubscriptionHeader from "./subscription-header";

const SubscriptionLoading = () => (
  <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
    <SubscriptionHeader />
    <div className="space-y-6">
      <h2 className="hidden sm:block text-center text-lg font-semibold">How Would You like to Pay?</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="w-full h-60 animate-pulse bg-primary-main-100 rounded-2xl" />
        <div className="w-full h-60 animate-pulse bg-primary-main-100 rounded-2xl" />
        <div className="w-full h-60 animate-pulse bg-primary-main-100 rounded-2xl" />
      </div>
    </div>
  </div>
);

export default SubscriptionLoading;
