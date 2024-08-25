import clsx from "clsx";
import Image from "next/image";
import React from "react";

const CardIcon = ({ card }: { card: "visa" | "mastercard" | "amex" }) => (
  <div className={clsx("relative", "w-14 h-9")}>
    <Image src={`/${card}.png`} fill alt={card} className="w-full h-full absolute" />
  </div>
);

export default CardIcon;
