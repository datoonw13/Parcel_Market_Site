import Button from "@/components/shared/Button";
import Image from "next/image";

const PropertyFound = () => (
  <div className="flex flex-col gap-10">
    <div className="relative w-full h-[315px] rounded-2xl">
      <Image alt="" src="/property-map.png" fill />
    </div>
    <div className="grid gap-6">
      {new Array(5).fill(0).map((_, i) => (
        <div className="flex items-center justify-between" key={Math.random()}>
          <div className="flex items-center gap-2">
            <p className="bg-green w-[24px] h-[24px] rounded-[50%] flex items-center justify-center text-dark-green-500 font-medium">
              {i + 1}
            </p>
            <p className="text-grey-500 font-medium">Parcel Number: #123456789</p>
          </div>
          <p className="text-green-600 font-medium">58.78 Acres</p>
        </div>
      ))}
    </div>
    <Button classNames="md:w-fit">Tell us about your property</Button>
  </div>
);

export default PropertyFound;
