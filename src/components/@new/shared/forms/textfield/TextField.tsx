import clsx from "clsx";
import classes from "./textfield.module.css";

interface TextFieldProps {
  variant: "primary" | "secondary";
  label?: string;
  placeholder?: string;
  error?: boolean;
}

const TextField = (props: TextFieldProps) => {
  const { variant = "primary", label, placeholder = "", error } = props;
  return (
    <div className={clsx(classes.root)}>
      <input className={clsx(label && classes[`input-${variant}`], classes.input)} placeholder={placeholder} />
      {label && <p className={label && classes[`label-${variant}`]}>{label}</p>}
    </div>
  );
};

export default TextField;
