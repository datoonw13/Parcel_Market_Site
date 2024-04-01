import Button from "@/components/shared/Button";
import Divider from "@/components/shared/Divider";
import TextField from "@/components/shared/TextField";
import ArrowIcon from "@/icons/ArrowIcon";
import SearchLandingIcon from "@/icons/SearchLandingIcon";
import UsdLandingIcon from "@/icons/UsdLandingIcon";

const PropertyEstimatedPrice = () => (
  <div className="flex flex-col gap-10">
    <div className="bg-green-100 flex flex-col items-center py-10 px-4 md:px-6 lg:px-8 xl:px-10 rounded-2xl">
      <h1 className="text-dark-green font-bold text-6xl">$95.000</h1>
      <p className="text-dark-green font-semibold my-4">30-45 days to close</p>
      <div className="w-[35px] mb-6">
        <ArrowIcon />
      </div>
      <div className="w-full">
        <div style={{ background: "linear-gradient(270deg, #F59E0B 0%, #17DB66 100%)" }} className="h-[10px] rounded-lg w-full" />
        <div className="flex justify-between mt-4">
          <p className="text-dark-green text-2xl font-semibold">$85.000</p>
          <p className="text-dark-green text-2xl font-semibold">$125.000</p>
        </div>
      </div>
    </div>
    <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] xl:grid-cols-[1fr_2.3fr]">
      <Button classNames="w-full h-fit">Sell your property NOW</Button>
      <p className="text-grey-500 font-medium text-xl text-center lg:text-start lg:max-w-[400px]">
        Sell your property NOW, hassle free and no closing costs for $57,000
      </p>
    </div>
    <Divider label="OR" />
    <div className="grid gap-10 grid-cols-1 xl:grid-cols-2">
      <div className="bg-neutral-300 hover:bg-neutral transition-all rounded-3xl cursor-pointer flex flex-col justify-between items-center gap-6 p-6">
        <div className="w-[64px]">
          <SearchLandingIcon />
        </div>
        <p className="text-grey-500 text-xl font-medium text-center">Submit your property to our network of investors.</p>
        <Button classNames="w-fit bg-neutral-500 hover:bg-neutral-700 text-grey-500 hover:text-grey-500">Submit your property</Button>
      </div>
      <div className="bg-neutral-300 hover:bg-neutral transition-all rounded-3xl cursor-pointer flex flex-col justify-between items-center gap-6 p-6">
        <div className="w-[64px]">
          <UsdLandingIcon />
        </div>
        <p className="text-grey-500 text-xl font-medium text-center">Get top dollar by working with a preferred real estate broker.</p>
        <Button classNames="w-fit bg-neutral-500 hover:bg-neutral-700 text-grey-500 hover:text-grey-500">Connect to a broker</Button>
      </div>
    </div>
    <p style={{ fontSize: 10 }} className="cursor-pointer">
      See our Terms of Service and Privacy Policy
    </p>
  </div>
);

export default PropertyEstimatedPrice;
