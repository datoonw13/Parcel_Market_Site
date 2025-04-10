"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const LoadingText = ({ initialText, className }: { initialText: string | ReactNode; className?: string }) => {
  const [step, setStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const messages = useRef([
    initialText,
    "Processing the land data.",
    "Finalizing the calculations.",
    "Wait just a bit more.",
    "It's almost done.",
  ]);

  useEffect(() => {
    if (step + 1 <= messages.current.length - 1) {
      timerRef.current = setTimeout(() => setStep(step + 1), 10000);
    }
    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [step]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className={cn(className)}
      >
        {messages.current[step]}
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingText;
