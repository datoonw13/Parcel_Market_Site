"use client";

import { useLazyGetAuthedUserQuery } from "@/lib/features/apis/authApi";
import { setAuthPending, setAuthedUser } from "@/lib/features/slices/authedUserSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback, useEffect } from "react";

const useAuthCheck = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.authedUser.user);
  const [getAuthedUser] = useLazyGetAuthedUserQuery();

  const checkToken = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw Error();
      }
      const res = await getAuthedUser().unwrap();
      dispatch(setAuthedUser(res.data));
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      dispatch(setAuthPending(false));
    }
  }, [dispatch, getAuthedUser]);

  useEffect(() => {
    if (!user) {
      checkToken();
    }
  }, [checkToken, user]);

  return null;
};

export default useAuthCheck;
