import clsx from "clsx";

interface ICheckBox {
  checked: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
  classNames?: string;
}

const CheckBox = ({ checked, onChange, label, disabled, classNames }: ICheckBox) => (
  <div className={clsx("flex items-center gap-2 cursor-pointer", classNames)} onClick={disabled ? undefined : onChange}>
    <input onChange={() => {}} checked={checked} type="checkbox" className="w-[18px] h-[18px]" disabled={disabled} />
    {label && <p>{label}</p>}
  </div>
);

export default CheckBox;
