import clsx from "clsx";
import classes from "./button.module.css";

interface ButtonTypes {
  variant?: "primary" | "secondary" | "text";
}

const Button = () => <button className={clsx(classes.root)}>Button</button>;

export default Button;
