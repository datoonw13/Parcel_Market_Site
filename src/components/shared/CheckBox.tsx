interface ICheckBox {
  checked: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
}

const CheckBox = ({ checked, onChange, label, disabled }: ICheckBox) => (
  <div className="flex items-center gap-2 cursor-pointer" onClick={disabled ? undefined : onChange}>
    <input onChange={() => {}} checked={checked} type="checkbox" className="h-[18px]" disabled={disabled} />
    {label && <p>{label}</p>}
  </div>
);

export default CheckBox;
