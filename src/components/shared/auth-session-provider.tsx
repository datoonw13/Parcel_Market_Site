"use client";

import { logOutUserAction } from "@/server-actions/user/actions";
import { IDecodedAccessToken } from "@/types/auth";
import { ISubscription } from "@/types/subscriptions";
import moment from "moment";
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef } from "react";

const AuthContext = createContext<{
  user: IDecodedAccessToken | null;
  activeSubscription: ISubscription | null;
  subscriptions: ISubscription[] | null;
}>({
  user: null,
  activeSubscription: null,
  subscriptions: null,
});
const useAuth = () => useContext(AuthContext);

const AuthSessionProvider = ({
  children,
  user,
  userSubscriptions,
}: {
  children: ReactNode;
  user: IDecodedAccessToken | null;
  userSubscriptions: ISubscription[] | null;
}) => {
  const activeSubscription = userSubscriptions?.find((el) => el.status === "active" || el.status === "trialing") || null;
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const setSessionTimer = useCallback(() => {
    // if (timerRef.current) {
    //   window.clearTimeout(timerRef.current);
    // }
    // if (user) {
    //   const sessionDuration = moment(user.sessionUntil).diff(new Date());
    //   timerRef.current = setTimeout(() => {
    //     logOutUserAction();
    //   }, sessionDuration);
    // }
  }, [user]);

  useEffect(() => {
    // if (user) {
    //   setSessionTimer();
    // } else if (!user && timerRef.current) {
    //   window.clearTimeout(timerRef.current);
    // }
    // return () => {
    //   window.clearTimeout(timerRef.current);
    // };
  }, [setSessionTimer, user]);

  return <AuthContext.Provider value={{ user, activeSubscription, subscriptions: userSubscriptions }}>{children}</AuthContext.Provider>;
};

export default AuthSessionProvider;

export { useAuth };
