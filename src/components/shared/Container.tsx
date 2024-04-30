import clsx from "clsx";
import { ReactNode } from "react";

interface IContainer {
  children: ReactNode;
  className?: string;
}
const Container = ({ children, className }: IContainer) => (
  <div className={clsx("px-[20px] lg:px-[40px] xl:px-[80px] 2xl:px-[100px]", className)}>{children}</div>
);

export default Container;
