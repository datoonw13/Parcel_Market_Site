import { InputHTMLAttributes, LegacyRef, ReactElement, forwardRef, useEffect, useRef } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { cn } from "../../lib/utils";

interface InputBaseProps {
  label?: string;
  startIcon?: ReactElement | string;
  endIcon?: ReactElement | string;
  error?: boolean;
  rootClassName?: string;
  endIconClassName?: string;
}

export interface InputGeneralProps extends InputHTMLAttributes<HTMLInputElement>, InputBaseProps {}

export interface TextAreaGeneralProps extends InputHTMLAttributes<HTMLTextAreaElement>, InputBaseProps {}

const styles = {
  error: "!border-error ",
  root: `
  [&:has(div>input:disabled)]:bg-grey-30
  transition-all transition-duration:100ms;
  h-[52px] relative grid grid-cols-[minmax(0,_max-content)_1fr_minmax(0,_max-content)]
  border border-grey-100 rounded-lg [&:hover:not(:focus-within)]:border-grey-200 focus-within:border-primary-main 
  `,
  inputWrapper: `
  h-full relative transition-all transition-duration:100ms;
  [&:focus-within>.label]:top-0 [&:focus-within>.label]:pt-7 [&:focus-within>.label]:!text-xss [&:focus-within>.label]:!font-normal [&:focus-within>.label]:text-grey-600
  `,
  input: `
  disabled:cursor-not-allowed
  autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] transition:background-color 9999s ease-in-out 0s
  font-medium text-xs w-full border-none outline-none h-full bg-transparent placeholder-grey-800
  [&:not(:placeholder-shown)+p]:top-0 [&:not(:placeholder-shown)+p]:pt-7 [&:not(:placeholder-shown)+p]:!text-xss [&:not(:placeholder-shown)+p]:!font-normal [&:not(:placeholder-shown)+p]:text-grey-600
  `,
  label: "text-grey-800 text-xs absolute top-1/2 left-0 transform -translate-y-1/2 transition-all transition-duration:100ms;",
};

const TextInput = forwardRef<HTMLDivElement, InputGeneralProps>(({ className, type, ...props }, ref) => {
  const { label, startIcon, endIcon, error, rootClassName, endIconClassName, ...inputGeneralProps } = { ...props };
  const showLabel = label && !inputGeneralProps.placeholder;
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div ref={ref} className={cn(styles.root, rootClassName, error && styles.error)}>
      <div
        onClick={(e) => {
          inputRef.current?.focus();
        }}
        className={cn("flex items-center justify-center h-full start-icon pr-3", startIcon && "pl-3")}
      >
        {startIcon}
      </div>
      <div className={cn(styles.inputWrapper)}>
        <input
          type={type}
          ref={inputRef}
          className={cn(styles.input, showLabel && "pt-3", className)}
          autoComplete="new-password"
          {...inputGeneralProps}
          placeholder={inputGeneralProps.placeholder || " "}
        />
        {showLabel && (
          <p className={cn(styles.label, "label pointer-events-none")}>
            {label}
            {inputGeneralProps.required && <span className="text-error"> *</span>}
          </p>
        )}
      </div>
      <div
        onClick={(e) => {
          inputRef.current?.focus();
        }}
        className={cn("flex items-center justify-center h-full pr-3 end-icon", endIcon && "pl-3", endIconClassName)}
      >
        {endIcon}
      </div>
    </div>
  );
});

const NumberInput = forwardRef<HTMLInputElement, InputGeneralProps & NumericFormatProps>(({ ...props }, ref) => (
  <NumericFormat {...props} customInput={TextInput} value={props.value} defaultValue={undefined} />
));

const TextArea = forwardRef<HTMLDivElement, TextAreaGeneralProps>(({ className, type, ...props }, ref) => {
  const { label, startIcon, endIcon, error, rootClassName, ...inputGeneralProps } = { ...props };
  const showLabel = label && !inputGeneralProps.placeholder;
  return (
    <div ref={ref} className={cn(styles.root, rootClassName, error && styles.error)}>
      <div className={cn("flex items-center justify-center h-full start-icon pr-3", startIcon && "pl-3")}>{startIcon}</div>
      <div className={cn(styles.inputWrapper)}>
        <textarea
          className={cn(styles.input, showLabel && "pt-3", className, "py-2 resize-none")}
          {...inputGeneralProps}
          placeholder={inputGeneralProps.placeholder || " "}
        />
        {showLabel && (
          <p className={cn(styles.label, "label pointer-events-none")}>
            {label}
            {inputGeneralProps.required && <span className="text-error"> *</span>}
          </p>
        )}
      </div>
      <div className={cn("flex items-center justify-center h-full pr-3 end-icon", endIcon && "pl-3")}>{endIcon}</div>
    </div>
  );
});

export { TextInput, NumberInput, TextArea };
