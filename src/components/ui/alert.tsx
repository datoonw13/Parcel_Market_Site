import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";
import { LuInfo } from "react-icons/lu";

const alertVariants = cva(
  "relative w-full rounded-lg p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-neutral-950 dark:border-neutral-800 dark:[&>svg]:text-neutral-50",
  {
    variants: {
      variant: {
        success: "bg-primary-main-100",
        warning: "bg-warning-100",
        error: "bg-error-100",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);

const Wrapper = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>>(
  ({ className, variant, ...props }, ref) => <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
);
Wrapper.displayName = "Alert";

const AlertTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("font-semibold text-sm", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-xs font-medium text-gray-800", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

const Alert = ({ title, description, variant }: { title?: string; description?: string } & VariantProps<typeof alertVariants>) => (
  <Wrapper variant={variant}>
    <LuInfo
      className={cn(
        "mt-[2px] size-5",
        variant === "warning" && "!text-warning",
        variant === "success" && "!text-success",
        variant === "error" && "!text-error"
      )}
    />
    {title && <AlertTitle>{title}</AlertTitle>}
    {description && <AlertDescription>{description}</AlertDescription>}
  </Wrapper>
);

export { Alert, AlertTitle, AlertDescription };
