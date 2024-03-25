type Props = Readonly<{
  label?: string;
  placeholder?: string;
  value?: string;
}>;

const TextField = (props: Props) => {
  const { value, label, placeholder } = props;
  return (
    <div>
      {label && <p className="font-medium text-grey-500 mb-2">{label}</p>}
      <input
        value={value || ""}
        placeholder={placeholder}
        className="text-grey-500 border border-[#9CA3AF] px-4 py-3 focus-visible:outline-none rounded-lg w-full"
      />
    </div>
  );
};
export default TextField;
