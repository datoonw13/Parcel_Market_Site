import { INotification } from "@/types/notifications";
import { atom } from "jotai";

export const notificationsAtom = atom<{
  list: INotification[] | null;
  unread: number;
}>({
  list: null,
  unread: 0,
});
