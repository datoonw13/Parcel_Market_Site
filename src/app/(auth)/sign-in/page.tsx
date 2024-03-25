import Button from "@/components/shared/Button";
import Divider from "@/components/shared/Divider";
import TextField from "@/components/shared/TextField";
import GoogleIcon from "@/icons/GoogleIcon";

const SignIn = () => (
  <div className="px-4 py-8 md:pb-12 lg:pb-16 xl:pb-18 2xl:pb-20 flex flex-col gap-10 max-w-[430px] m-auto">
    <div className="w-[80%] sm:w-[100%] m-auto">
      <h1 className="text-2xl font-bold font-bricolage text-green-900 text-center mb-6">Sign in with your email</h1>
      <p className="text-xl text-dark-green-500 text-center font-medium">Enter the email address associated with your account.</p>
    </div>
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
  </div>
);

export default SignIn;
