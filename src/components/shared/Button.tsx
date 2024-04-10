import LoadingCircle from "@/icons/LoadingCircle";
import LoadingDotsIcon from "@/icons/LoadingDotsIcon";
import SpinnerIcon from "@/icons/SpinnerIcon";
import clsx from "clsx";

import { ReactNode } from "react";

type ButtonType = "primary" | "secondary" | "tertiary" | "text";

interface ButtonProps {
  type?: ButtonType;
  disabled?: boolean;
  children: ReactNode;
  classNames?: string;
  startIcon?: ReactNode;
  onClick?: () => void;
  loading?: boolean;
}

const generateClassNames = (params: ButtonProps) => {
  switch (params.type) {
    case "primary":
      return "bg-green text-dark-green hover:bg-green-900 hover:text-white disabled:bg-grey-200 disabled:text-dark-green-100 disabled:cursor-not-allowed";
    case "secondary":
      return "bg-green-100 text-dark-green hover:bg-green-300 disabled:bg-grey-200 disabled:text-dark-green-100 disabled:cursor-not-allowed";
    case "tertiary":
      return "bg-white text-dark-green hover:bg-green-300 border border-solid border-green disabled:border-grey-200 disabled:bg-grey-200 disabled:text-dark-green-100 disabled:cursor-not-allowed";
    case "text":
      return "text-dark-green py-2.5 px-4 disabled:text-dark-green-100 disabled:cursor-not-allowed";
    default:
      return "";
  }
};

const Button = (params: ButtonProps) => {
  const { type = "primary", disabled, children, classNames, startIcon: StartIcon, onClick, loading } = params;

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        "relative font-semibold p-4 rounded-lg transition-colors flex items-center justify-center gap-2",
        generateClassNames({ ...params, type }),
        classNames
      )}
    >
      {StartIcon && <div className="w-[24px]">{StartIcon}</div>}
      <div className={clsx(loading ? "opacity-0" : "opacity-100")}> {children}</div>
      {loading && (
        <div className="w-[40px] absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]">
          <SpinnerIcon color="green" />
        </div>
      )}
    </button>
  );
};

export default Button;
