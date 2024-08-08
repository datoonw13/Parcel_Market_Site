import clsx from "clsx";
import Image from "next/image";
import React from "react";

const CardIcon = ({ card }: { card: "visa" | "mastercard" | "amex" }) => (
  <div className={clsx("relative", card === "visa" && " w-8 h-2.5", card === "mastercard" && "w-7 h-3", card === "amex" && "w-10 h-10")}>
    <Image src={`/${card}.png`} fill alt={card} className="w-full h-full absolute" />
  </div>
);

export default CardIcon;
