"use client";

import { Button } from "@/components/ui/button";
import routes from "@/helpers/routes";
import { setAuthTokensAction } from "@/server-actions/new-auth/new-auth";
import { revalidateAllPath } from "@/server-actions/subscription/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { FaCheck } from "react-icons/fa6";

const channel = new BroadcastChannel("sign-up");

const SignUpSuccess = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<{ jwt: string; jwtRefresh: string; redirectUrl: string } | null>(null);
  const [timer, setTimer] = useState(5);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const handleRedirect = useCallback(() => {
    if (!data) {
      return;
    }
    window.clearTimeout(timerRef.current);
    revalidateAllPath();
    channel.postMessage({
      message: "Activation",
      redirectUrl: data.redirectUrl,
    });
    startTransition(() => {
      router.replace(data?.redirectUrl);
    });
  }, [data, router]);

  useEffect(() => {
    const jwt = params.get("jwt");
    const jwtRefresh = params.get("jwtRefresh");
    const redirectUrl = params.get("redirectUrl");
    if (jwt && jwtRefresh && redirectUrl) {
      setData({
        jwt,
        jwtRefresh,
        redirectUrl,
      });
      router.replace(routes.auth.signUp.success.fullUrl);
    }
  }, [params, router]);

  useEffect(() => {
    const jwt = params.get("jwt");
    const jwtRefresh = params.get("jwtRefresh");
    if (!(jwt && jwtRefresh) && !data) {
      router.replace(routes.auth.signIn.fullUrl);
    }
  }, [params, router, data]);

  useEffect(() => {
    if (data) {
      setAuthTokensAction([
        {
          token: data.jwt,
          tokenName: "jwt",
          remember: false,
        },
        {
          token: data.jwtRefresh,
          tokenName: "jwt-refresh",
          remember: true,
        },
      ]);
    }
  }, [data]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleRedirect();
    }, 5000);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => (prev - 1 < 0 ? 0 : prev - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timerRef.current);
      window.clearTimeout(intervalRef.current);
    };
  }, [handleRedirect]);

  useEffect(() => {
    if (timer === 0) {
      window.clearInterval(intervalRef.current);
    }
  }, [timer]);

  return (
    <div className="m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16 flex flex-col justify-center items-center">
      <div className="size-12 bg-success rounded-full flex items-center justify-center mb-4">
        <FaCheck className="size-6 text-white" />
      </div>
      <div className="space-y-1 mb-6">
        <h1 className="text-center text-lg font-bold">Registration Successfully</h1>
        <h2 className="text-center text-sm text-grey-800">Welcome to Parcel Market. You are now registered and ready to explore</h2>
        <h2 className="text-center text-sm text-grey-800 font-semibold">You will be redirected {timer} seconds</h2>
      </div>
      <Button loading={isPending} onClick={handleRedirect} className="w-full sm:w-fit sm:min-w-52">
        Continue
      </Button>
    </div>
  );
};

export default SignUpSuccess;
