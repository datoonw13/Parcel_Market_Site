"use client";

import { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { ResendIcon1 } from "../icons/ResendIcons";
import { LoadingIcon1 } from "../icons/LoadingIcons";

const INITIAL_TIMER_SECONDS = 59;

interface ResendButtonProps {
  handleResend: () => Promise<void> | void;
}
const ResendButton: FC<ResendButtonProps> = ({ handleResend }) => {
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
      setTimer(INITIAL_TIMER_SECONDS);
      timerRef.current = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } catch (error) {
      toast.error("Code resend failed");
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

  console.log(loading, 2);
  return (
    <div>
      <div className="flex items-center gap-2 cursor-pointer " onClick={() => timer === 0 && onResend()}>
        {loading ? <LoadingIcon1 color="primary-main" /> : <ResendIcon1 className={timer === 0 ? "fill-primary-main" : "fill-grey-800"} />}
        <p className={clsx("text-xs font-medium", timer === 0 ? "text-primary-main" : "text-grey-800")}>
          {timer === 0 ? "Send Code" : `We can send a new Code in 0:${timer < 10 ? `0${timer}` : timer}`}
        </p>
      </div>
    </div>
  );
};

export default ResendButton;
