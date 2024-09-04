"use client";

import { logOutUserAction } from "@/server-actions/user/actions";
import { IDecodedAccessToken } from "@/types/auth";
import moment from "moment";
import { ReactNode, useCallback, useEffect, useRef } from "react";

const AuthSessionProvider = ({ children, user }: { children: ReactNode; user: IDecodedAccessToken | null }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const setSessionTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    if (user) {
      const sessionDuration = moment(user.sessionUntil).diff(new Date());
      timerRef.current = setTimeout(() => {
        logOutUserAction();
      }, sessionDuration);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setSessionTimer();
    } else if (!user && timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [setSessionTimer, user]);

  return children;
};

export default AuthSessionProvider;
