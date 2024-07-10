import React from "react";
import { uuid } from "short-uuid";

const ReceivedOffersListLoading = () => (
  <div className="flex flex-col gap-6 md:gap-4">
    {new Array(5).fill(0).map(() => (
      <div key={uuid()} className="w-full h-96 animate-pulse bg-primary-main-50 rounded-2xl" />
    ))}
  </div>
);

export default ReceivedOffersListLoading;
