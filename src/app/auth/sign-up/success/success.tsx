"use client";

import { LoadingIcon2 } from "@/components/@new/icons/LoadingIcons";
import { Button } from "@/components/ui/button";
import { setAuthTokensAction } from "@/server-actions/new-auth/new-auth";
import { revalidateAllPath } from "@/server-actions/subscription/actions";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { FaCheck } from "react-icons/fa6";

const channel = new BroadcastChannel("sign-up");

const SignUpSuccess = ({ jwt, jwtRefresh, redirectUrl }: { jwt: string; jwtRefresh: string; redirectUrl: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [timer, setTimer] = useState(5);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const handleRedirect = useCallback(async () => {
    channel.postMessage({
      message: "success-registration",
      redirectUrl,
    });
    setAuthTokensAction([
      {
        token: jwt,
        tokenName: "jwt",
        remember: false,
      },
      {
        token: jwtRefresh,
        tokenName: "jwt-refresh",
        remember: true,
      },
    ]);
    window.clearTimeout(timerRef.current);
    window.clearTimeout(intervalRef.current);
    await revalidateAllPath();
    startTransition(() => {
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    });
  }, [jwt, jwtRefresh, redirectUrl, router]);

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
    <>
      {isPending && (
        <div className="fixed w-full h-full top-0 left-0 bg-white z-20 flex items-center justify-center">
          <div className="rounded-2xl bg-transparent p-6 max-w-md space-y-4">
            <div className="relative w-fit mx-auto">
              <svg
                className="absolute -top-[-50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
                width="21"
                height="24"
                viewBox="0 0 21 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.1721 8.10277L11.3736 1.47938C11.5124 0.711291 10.9417 0 10.1852 0H1.20935C0.54185 0 0 0.559838 0 1.24949V7.24002C0 7.89182 0.484262 8.43543 1.11511 8.48411L8.8921 9.11697C9.50725 9.16835 10.0622 8.73022 10.1747 8.10277H10.1721Z"
                  fill="#0E8B40"
                />
                <path
                  d="M17.282 0H15.2586C14.6775 0 14.1775 0.427316 14.0702 1.0169L11.2562 16.5247C11.1175 17.2928 11.6881 18.0041 12.4446 18.0041H17.282C18.9756 18.0041 20.3473 16.5869 20.3473 14.837V3.167C20.3473 1.41717 18.9756 0 17.282 0Z"
                  fill="#16DB65"
                />
                <path
                  d="M8.15655 11.7192L1.30358 11.1621C0.599438 11.1053 0 11.6787 0 12.4062V22.5238C0 23.2135 0.54185 23.7733 1.20935 23.7733H6.32682C6.90794 23.7733 7.4079 23.346 7.51523 22.7537L9.25072 13.1905C9.38422 12.4603 8.87378 11.7733 8.15655 11.7138V11.7192Z"
                  fill="#05471C"
                />
              </svg>
              <LoadingIcon2 className="animate-spin size-12 text-primary-main" />
            </div>
          </div>
        </div>
      )}
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
    </>
  );
};

export default SignUpSuccess;
