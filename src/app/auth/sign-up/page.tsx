"use client";

import SignUp from "@/components/auth/sign-up/sign-up";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const router = useRouter();
  console.log(1);

  return (
    <SignUp
      showSignIn={() => {
        router.push(routes.auth.signIn.fullUrl);
      }}
      onSubmit={() => {}}
    />
  );
};

export default SignUpPage;
