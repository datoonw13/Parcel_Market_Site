"use client";

import Button from "@/components/@new/shared/forms/Button";
import { useEffect } from "react";

const ReceivedOfferSelect = () => {
  useEffect(() => {
    document.addEventListener("click", (e) => console.log(e.target));
  }, []);

  return (
    <div>
      <Button className="!py-1 !px-3 !bg-grey-50 !outline-none !rounded-3xl text-xs !text-black" variant="secondary">
        Select
      </Button>
    </div>
  );
};

export default ReceivedOfferSelect;
