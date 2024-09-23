import { InputHTMLAttributes, LegacyRef, ReactElement, forwardRef } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { cn } from "../../lib/utils";

interface InputBaseProps {
  label?: string;
  startIcon?: ReactElement | string;
  endIcon?: ReactElement | string;
  error?: boolean;
  rootClassName?: string;
  rootRef?: LegacyRef<HTMLDivElement>;
}

export interface InputGeneralProps extends InputHTMLAttributes<HTMLInputElement>, InputBaseProps {}

const styles = {
  error: "!border-error",
  root: `
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

const TextInput = forwardRef<HTMLInputElement, InputGeneralProps>(({ className, type, ...props }, ref) => {
  const { label, startIcon, endIcon, error, rootClassName, rootRef, ...inputGeneralProps } = { ...props };
  const showLabel = label && !inputGeneralProps.placeholder;
  return (
    <div ref={rootRef} className={cn(styles.root, rootClassName, error && styles.error)}>
      <div className={cn("flex items-center justify-center h-full start-icon pr-3", startIcon && "pl-3")}>{startIcon}</div>
      <div className={cn(styles.inputWrapper)}>
        <input
          type={type}
          className={cn(styles.input, showLabel && "pt-3", className)}
          ref={ref}
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
      <div className={cn("flex items-center justify-center h-full pr-3 end-icon", endIcon && "pl-3")}>{endIcon}</div>
    </div>
  );
});

const NumberInput = forwardRef<HTMLInputElement, InputGeneralProps & NumericFormatProps>(({ ...props }, ref) => (
  <NumericFormat
    customInput={TextInput}
    {...props}
    value={props.value ? props.value.toString() : undefined}
    defaultValue={props.value ? props.value.toString() : undefined}
  />
));

export { TextInput, NumberInput };
