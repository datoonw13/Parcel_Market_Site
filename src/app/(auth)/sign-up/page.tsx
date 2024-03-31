import Button from "@/components/shared/Button";
import TextField from "@/components/shared/TextField";

const SignUp = () => (
  <>
    <TextField label="Name" placeholder="Enter your name" />
    <TextField label="Email" placeholder="Enter your email" />
    <TextField label="Mailing Address" placeholder="Your address" />
    <div className="flex items-center gap-6">
      <TextField label="State" placeholder="State" />
      <TextField label="Country" placeholder="Country" />
    </div>
    <TextField label="Password" placeholder="Enter password" />
    <Button>Create Account</Button>
  </>
);

export default SignUp;
