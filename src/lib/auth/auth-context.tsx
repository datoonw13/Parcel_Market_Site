"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  getAuthedUserDataAction,
  isAuthenticatedAction,
  removeAuthTokensAction,
  setAuthTokensAction,
} from "@/server-actions/new-auth/new-auth";
import moment from "moment";
import { revalidateAllPathAction } from "@/server-actions/common-actions";
import { ITokens } from "@/types/common";
import { getUserAction } from "@/server-actions/user/actions";

const AuthContext = createContext<{
  isAuthed: boolean;
  user: null | Awaited<ReturnType<typeof getAuthedUserDataAction>>;
  logOut: () => void;
  signIn: (tokens: ITokens, cb?: () => void) => void;
}>({
  isAuthed: false,
  user: null,
  logOut: () => {},
  signIn: () => {},
});

const AuthContextProvide = ({
  children,
  authOption,
}: {
  children: ReactNode;
  authOption: { isAuthed: boolean; expiresIn: number | null };
}) => {
  const [data, setData] = useState<{
    isAuthed: boolean;
    expiresIn: number | null;
    user: Awaited<ReturnType<typeof getAuthedUserDataAction>>;
  }>({
    isAuthed: authOption.isAuthed,
    user: null,
    expiresIn: authOption.expiresIn,
  });

  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const signIn = useCallback(async (tokens: ITokens, cb?: () => void) => {
    setAuthTokensAction([
      {
        token: tokens.access_token,
        tokenName: "jwt",
        remember: false,
      },
      {
        token: tokens.refresh_token,
        tokenName: "jwt-refresh",
        remember: false,
      },
    ]);

    const req = await isAuthenticatedAction();
    const user = await getAuthedUserDataAction();

    if (req.expiresIn && req.isAuthed && user) {
      setData({ ...req, user });
    }

    if (cb) {
      cb();
    }
  }, []);

  const logOut = useCallback(() => {
    setData({
      isAuthed: false,
      user: null,
      expiresIn: null,
    });
    removeAuthTokensAction();
    revalidateAllPathAction();
  }, []);

  useEffect(() => {
    if (authOption.isAuthed) {
      getAuthedUserDataAction().then((data) => {
        setData({ ...authOption, user: data });
      });
    }
  }, [authOption, authOption.isAuthed]);

  useEffect(() => {
    if (data.isAuthed && data.expiresIn && data.user) {
      const ms = moment.unix(data.expiresIn).diff(new Date());
      timerRef.current = setTimeout(() => {
        logOut();
      }, ms);
    }
    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [authOption, data.expiresIn, data.isAuthed, data.user, logOut]);

  return <AuthContext.Provider value={{ isAuthed: data.isAuthed, user: data.user, logOut, signIn }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvide;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
