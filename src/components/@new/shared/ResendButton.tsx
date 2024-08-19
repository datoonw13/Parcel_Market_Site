"use client";

import { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { cn } from "@/helpers/common";
import useNotification from "@/hooks/useNotification";
import { ResendIcon1 } from "../icons/ResendIcons";
import { LoadingIcon1 } from "../icons/LoadingIcons";

const INITIAL_TIMER_SECONDS = 59;

interface ResendButtonProps {
  handleResend: () => Promise<void> | void;
  label?: string;
}
const ResendButton: FC<ResendButtonProps> = ({ handleResend, label }) => {
  const { notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const onResend = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      await handleResend();
      notify({ title: "Verification Code Resend", description: "Verification code has been resend" });
      setTimer(INITIAL_TIMER_SECONDS);
      timerRef.current = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } catch (error: any) {
      notify({ title: "Verification Code Resend", description: error?.message || "Verification code resend failed" }, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timer === 0) {
      window.clearInterval(timerRef.current);
    }
  }, [timer]);

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  return (
    <div
      className={cn("flex items-center gap-2 cursor-pointer", loading && "opacity-50 cursor-not-allowed")}
      onClick={() => timer === 0 && onResend()}
    >
      {loading ? <LoadingIcon1 color="primary-main" /> : <ResendIcon1 className={timer === 0 ? "fill-primary-main" : "fill-grey-800"} />}
      <p className={clsx("text-xs font-medium", timer === 0 ? "text-primary-main" : "text-grey-800")}>
        {timer === 0 ? label || "Send Code" : `We can send a new code in 0:${timer < 10 ? `0${timer}` : timer}`}
      </p>
    </div>
  );
};

export default ResendButton;
