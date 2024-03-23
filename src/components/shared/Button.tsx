import { ButtonProps } from "@/types/button";
import clsx from "clsx";

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
  const { type = "primary", disabled, children, classNames } = params;

  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        "font-semibold p-4 rounded-lg transition-colors",
        generateClassNames({ ...params, type }),
        classNames
      )}
    >
      {children}
    </button>
  );
};

export default Button;
