"use client";

import { FC } from "react";
import classes from "./textarea.module.css";

interface TextAreaProps {
  rows?: number;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
}
const TextArea: FC<TextAreaProps> = ({ rows, placeholder, onChange, value }) => (
  <textarea placeholder={placeholder} className={classes.root} rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
);

export default TextArea;
