import { INotification } from "@/types/notifications";
import { atom } from "jotai";

export const notificationsAtom = atom<{
  data: INotification[] | null;
  unread: number;
}>({
  data: null,
  unread: 0,
});
