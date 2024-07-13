import { cookies, headers } from "next/headers";
import React from "react";

const ValueLandsFound = async () => {
  console.log(cookies().get("foundedLands"));

  return <div>ValueLandsFound</div>;
};

export default ValueLandsFound;
