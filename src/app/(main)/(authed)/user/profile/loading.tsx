import React from "react";

const loading = () => (
  <div className="flex flex-col gap-6">
    <div className="max-w-96 w-full h-16 rounded-md animate-pulse bg-grey-100" />
    <div className="w-full h-52 rounded-md animate-pulse bg-grey-100" />
    <div className="w-full h-52 rounded-md animate-pulse bg-grey-100" />
  </div>
);

export default loading;
