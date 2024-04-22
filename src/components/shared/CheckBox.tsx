interface ICheckBox {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

const CheckBox = ({ checked, onChange, label }: ICheckBox) => (
  <div className="flex items-center gap-2 cursor-pointer" onClick={onChange}>
    <input onChange={() => {}} checked={checked} type="checkbox" className="h-[18px]" />
    {label && <p>{label}</p>}
  </div>
);

export default CheckBox;
