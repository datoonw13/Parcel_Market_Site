import Button from "@/components/shared/Button";
import TextField from "@/components/shared/TextField";
import { usaStatesFull } from "typed-usa-states";

const PropertyInfo = () => {
  console.log(usaStatesFull.find((el) => el.name === "Wyoming")?.counties, 213);
  return (
    <div className="flex flex-col gap-6">
      <TextField info="your info here" label="Name of the owner" placeholder="Enter name of the owner" />
      <div className="flex items-center gap-6">
        <TextField info="your info here" label="State" placeholder="State" />
        <TextField info="your info here" label="County" placeholder="County" />
      </div>
      <TextField info="your info here" label="Parcel Number" placeholder="Enter parcel Number" />
      <Button classNames="mt-4 md:w-fit">Continue</Button>
    </div>
  );
};

export default PropertyInfo;
