type Props = Readonly<{
  label?: string;
}>;

const Divider = ({ label }: Props) => (
  <div className="bg-[#D9D9D9] w-full rounded relative h-[1px]">
    {label && (
      <p className="absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] bg-white w-fit h-fit px-10 text-dark-green-500 font-medium">
        {label}
      </p>
    )}
  </div>
);

export default Divider;
