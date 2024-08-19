import { SellingPropertyDetails } from "@/types/property";
import { atom } from "jotai";

export const followedListingsAtom = atom<SellingPropertyDetails[] | null>(null);
