import clsx from "clsx";

const Badge = ({ select, onClick, label }: { select?: boolean; onClick?: () => void; label: string }) => (
  <div
    className={clsx(
      `py-2 px-4 font-semibold 
    bg-grey-200 border w-fit rounded-3xl cursor-pointer`,
      select ? "text-dark-green bg-green-200 border-green" : "text-dark-green-100 bg-grey-200 border-grey-400"
    )}
    onClick={onClick}
  >
    {label}
  </div>
);

export default Badge;
