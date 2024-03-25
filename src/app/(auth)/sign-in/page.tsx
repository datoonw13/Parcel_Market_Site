import Button from "@/components/shared/Button";
import Divider from "@/components/shared/Divider";
import TextField from "@/components/shared/TextField";
import GoogleIcon from "@/icons/GoogleIcon";

const SignIn = () => (
  <>
    <TextField label="Email" placeholder="Enter your email" />
    <Button>Continue</Button>
    <Divider label="OR" />
    <Button type="tertiary" startIcon={<GoogleIcon />}>
      Sign in with google
    </Button>
    <Divider />
    <div className="flex items-center justify-between">
      <p>Don’t have an account yet?</p>
      <Button type="tertiary">Get Started</Button>
    </div>
  </>
);

export default SignIn;
