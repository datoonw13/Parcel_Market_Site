import { INotification } from "@/types/notifications";
import { atom } from "jotai";

export const notificationsAtom = atom<INotification[] | null>(null);
