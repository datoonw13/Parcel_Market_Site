import Container from "@/components/@new/shared/Container";
import React from "react";

const MarketPlaceLoading = () => (
  <Container className="py-6 md:py-8">
    <div className="space-y-10 md:space-y-8">
      <div className="rounded-2xl animate-pulse bg-primary-main-100 h-9" />
      <div className="rounded-2xl animate-pulse bg-primary-main-100 h-9" />
      <div className="rounded-2xl animate-pulse bg-primary-main-100 h-9" />
    </div>
    <div className="grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-2 mt-6 md:mt-10">
      <div className="h-96 w-full animate-pulse bg-primary-main-100 max-w-md md:max-w-full m-auto rounded-2xl" />
      <div className="h-96 w-full animate-pulse bg-primary-main-100 max-w-md md:max-w-full m-auto rounded-2xl" />
      <div className="h-96 w-full animate-pulse bg-primary-main-100 max-w-md md:max-w-full m-auto rounded-2xl" />
      <div className="h-96 w-full animate-pulse bg-primary-main-100 max-w-md md:max-w-full m-auto rounded-2xl" />
    </div>
  </Container>
);

export default MarketPlaceLoading;
