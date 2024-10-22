import { GiCheckMark } from "react-icons/gi";

const SubscriptionHeader = () => (
  <div className="space-y-6">
    <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center">One Subscription. Full Access</h1>
    <ul
      className={`
    border border-primary-main-400 rounded-2xl bg-primary-main-50 p-4 md:p-6 
        grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-y-4 gap-x-8 
        `}
    >
      {list.map((item) => (
        <li key={item} className="text-sm md:text-base font-medium flex items-start gap-2 text-start ">
          <GiCheckMark className="mt-[4px] text-primary-main" /> {item}
        </li>
      ))}
    </ul>
  </div>
);

export default SubscriptionHeader;
const list = [
  "Average land market values in seconds",
  "Conveniently save sales data",
  "Sales data updated weekly",
  "VOLT quickly filters out outlier sales",
  "Quickly evaluate land deals in seconds",
  "Save hours of research time",
  "Export sales data to KML or XML",
  "Data direct from county accessors",
  "Created for professionals, investors and landowners",
];
