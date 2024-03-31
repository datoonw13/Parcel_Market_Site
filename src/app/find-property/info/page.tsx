import Button from "@/components/shared/Button";
import TextField from "@/components/shared/TextField";

const FindPropertyInfo = () => (
  <div className="flex flex-col gap-6">
    <TextField info="your info here" label="Name of the owner" placeholder="Enter name of the owner" />
    <div className="flex items-center gap-6">
      <TextField info="your info here" label="State" placeholder="State" />
      <TextField info="your info here" label="Country" placeholder="Country" />
    </div>
    <TextField info="your info here" label="Parcel Number" placeholder="Enter parcel Number" />
    <Button classNames="mt-4">Continue</Button>
  </div>
);

export default FindPropertyInfo;
