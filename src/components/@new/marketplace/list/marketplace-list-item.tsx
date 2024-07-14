"use client";

import { FC } from "react";
import { LandListItemProps } from "@/types/lands";
import LandListItem from "../../lands/land-list-item/land-list-item";

const MarketPlaceListItem: FC<LandListItemProps> = (params) => <LandListItem {...params} />;
export default MarketPlaceListItem;
