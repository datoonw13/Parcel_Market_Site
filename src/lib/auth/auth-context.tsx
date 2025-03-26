"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getAuthedUserDataAction, removeAuthTokensAction } from "@/server-actions/new-auth/new-auth";
import moment from "moment";
import { revalidateAllPathAction } from "@/server-actions/common-actions";

const AuthContext = createContext<{
  isAuthed: boolean;
  user: null | Awaited<ReturnType<typeof getAuthedUserDataAction>>;
  logOut: () => void;
}>({
  isAuthed: false,
  user: null,
  logOut: () => {},
});

const AuthContextProvide = ({
  children,
  authOption,
  tempUser,
}: {
  children: ReactNode;
  authOption: { isAuthed: boolean; expiresIn: number | null };
  tempUser: null | Awaited<ReturnType<typeof getAuthedUserDataAction>>;
}) => {
  const [user, setUser] = useState<Awaited<ReturnType<typeof getAuthedUserDataAction>>>(authOption.isAuthed ? tempUser : null);

  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const setAuthedUser = useCallback(async () => {
    if (authOption.isAuthed) {
      const authedUser = await getAuthedUserDataAction();
      setUser(authedUser);
    }
  }, [authOption.isAuthed]);

  const logOut = useCallback(() => {
    setUser(null);
    removeAuthTokensAction();
    revalidateAllPathAction();
  }, []);

  useEffect(() => {
    setAuthedUser();
  }, [setAuthedUser]);

  useEffect(() => {
    if (authOption.isAuthed && authOption.expiresIn && user) {
      const ms = moment.unix(authOption.expiresIn).diff(new Date());
      timerRef.current = setTimeout(() => {
        setUser(null);
        removeAuthTokensAction();
        revalidateAllPathAction();
      }, ms);
    }
    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [authOption, user]);

  useEffect(() => {
    if (user) {
      document.cookie = `user=${JSON.stringify(user)}`;
    }
  }, [user]);

  return <AuthContext.Provider value={{ isAuthed: authOption.isAuthed, user, logOut }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvide;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
