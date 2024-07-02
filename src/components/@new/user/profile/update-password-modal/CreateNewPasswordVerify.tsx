import ResendButton from "@/components/@new/shared/ResendButton";
import Button from "@/components/@new/shared/forms/Button";
import TextField from "@/components/@new/shared/forms/TextField";

const delay = () => new Promise((resolve) => setTimeout(resolve, 500));

const CreateNewPasswordVerify = ({ passwords }: { passwords: { oldPassword: string; newPassword: string } }) => (
  <div className="px-5 sm:px-8">
    <div className="space-y-4">
      <TextField placeholder="Code" />
      <ResendButton
        handleResend={async () => {
          await delay();
        }}
      />
    </div>
    <div className="w-full flex flex-col-reverse sm:flex-row gap-3 mt-8">
      <Button className="w-full" variant="secondary">
        Cancel
      </Button>
      <Button className="w-full">Continue</Button>
    </div>
  </div>
);

export default CreateNewPasswordVerify;
