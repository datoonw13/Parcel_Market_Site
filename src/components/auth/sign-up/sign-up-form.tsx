import { FC, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import Divider from "@/components/@new/shared/Divider";
import CheckBox from "@/components/@new/shared/forms/CheckBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSignUpValidation } from "@/zod-validations/auth-validations";
import { IUserSignUp } from "@/types/auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TextInput } from "@/components/ui/input";
import { TermsConditionsDialog } from "@/components/shared/terms-conditions";
import { PrivacyPolicyDialog } from "@/components/shared/privacy-policy";
import { UserSource } from "@/types/common";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SignUpFormProps {
  goBack: () => void;
  registrationReasons: IUserSignUp["registrationReasons"];
  showSignIn: () => void;
  authProviders?: () => ReactElement;
  onSubmit: (data: IUserSignUp & { userSource: UserSource; token?: string }) => Promise<void>;
  isTransitioning?: boolean;
}

const SignUpForm: FC<SignUpFormProps> = ({
  registrationReasons,
  goBack,
  showSignIn,
  authProviders: AuthProviders,
  onSubmit,
  isTransitioning,
}) => {
  const searchParams = useSearchParams();
  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const pathname = usePathname();
  const router = useRouter();
  const [thirdPartyTokenChecking, setThirdPartyTokenChecking] = useState(false);
  const [openTermsDialog, setTermsDialog] = useState(false);
  const [openPrivacyDialog, setPrivacyDialog] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleRepeatPassword, setVisibleRepeatPassword] = useState(false);
  const [thirdPartyAuthToken, setThirdPartyAuthToken] = useState<null | {
    token: string;
    source: UserSource;
  }>(null);
  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting },
    setValue,
    watch,
    getValues,
    reset,
  } = useForm<IUserSignUp>({
    resolver: zodResolver(userSignUpValidation(!!thirdPartyAuthToken)),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      registrationReasons,
      subscribeToEmail: false,
    },
  });

  const onClick = handleSubmit(async (data) => {
    await onSubmit({
      ...data,
      userSource: thirdPartyAuthToken?.source || UserSource.System,
      token: thirdPartyAuthToken?.token,
    });
  });

  const getDetailsFromToken = useCallback(async () => {
    setThirdPartyTokenChecking(true);
    if (params.get("userSource") === UserSource.Google && params.get("accessToken")) {
      const googleCredentialsReq = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${params.get("accessToken")!}`);
      const googleCredentials = (await googleCredentialsReq.json()) as { email: string; family_name: string; given_name: string };
      if (googleCredentials) {
        setThirdPartyAuthToken({
          source: params.get("userSource") as any,
          token: params.get("accessToken")!,
        });
        reset({
          ...getValues(),
          email: googleCredentials.email,
          firstName: googleCredentials.given_name,
          lastName: googleCredentials.family_name,
        });
        const newParams = new URLSearchParams(params.toString());
        newParams.delete("accessToken");
        newParams.delete("userSource");
        router.push(`${pathname}/?${newParams.toString()}`);
      }
    }
    if (params.get("userSource") === UserSource.Facebook && params.get("accessToken")) {
      const fbCredentialsReq = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${params.get("accessToken")!}`);
      const fbCredentials = (await fbCredentialsReq.json()) as { email: string; name: string };
      if (fbCredentials) {
        setThirdPartyAuthToken({
          source: params.get("userSource") as any,
          token: params.get("accessToken")!,
        });
        reset({
          ...getValues(),
          email: fbCredentials.email,
          firstName: fbCredentials.name.split(" ")[0],
          lastName: fbCredentials.name.split(" ")[1],
        });
        const newParams = new URLSearchParams(params.toString());
        newParams.delete("accessToken");
        newParams.delete("userSource");
        router.push(`${pathname}/?${newParams.toString()}`);
      }
    }
    setThirdPartyTokenChecking(false);
    return null;
  }, [getValues, params, pathname, reset, router]);

  useEffect(() => {
    getDetailsFromToken();
  }, [getDetailsFromToken, getValues, params, reset, searchParams]);

  return (
    <>
      <TermsConditionsDialog open={openTermsDialog} closeModal={() => setTermsDialog(false)} />
      <PrivacyPolicyDialog open={openPrivacyDialog} closeModal={() => setPrivacyDialog(false)} />
      <div>
        <h1 className="font-semibold text-2xl md:text-5xl text-center">Sign Up</h1>
        <h3 className="text-grey-800 mt-3 text-center">Create account</h3>
      </div>
      {AuthProviders && <AuthProviders />}
      <Divider label="OR" className="my-1.5" />
      <div className={cn("w-full flex flex-col gap-4", thirdPartyTokenChecking && "opacity-65 pointer-events-none")}>
        <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            onChange={(e) => {
              if (/^[a-zA-Z]+$/.test(e.target.value) || e.target.value === "") {
                setValue("firstName", e.target.value, { shouldValidate: isSubmitted });
              }
            }}
            required
            className="w-full"
            label="First Name"
            value={watch("firstName")}
            error={!!errors.firstName}
            id="sign-up-firstname-input"
          />
          <TextInput
            onChange={(e) => {
              if (/^[a-zA-Z]+$/.test(e.target.value) || e.target.value === "") {
                setValue("lastName", e.target.value, { shouldValidate: isSubmitted });
              }
            }}
            required
            className="w-full"
            label="Last Name"
            value={watch("lastName")}
            error={!!errors.lastName}
            id="sign-up-lastname-input"
          />
          <TextInput
            onChange={(e) => setValue("email", e.target.value, { shouldValidate: isSubmitted })}
            required
            className="w-full"
            label="Email Address"
            disabled={!!thirdPartyAuthToken}
            value={watch("email")}
            error={!!errors.email}
            id="sign-up-email-input"
          />
          {!thirdPartyAuthToken && (
            <>
              <div className="space-y-1">
                <TextInput
                  className="w-full"
                  label="Password"
                  value={watch("password") || ""}
                  onChange={(e) => setValue("password", e.target.value, { shouldValidate: isSubmitted })}
                  type={visiblePassword ? "text" : "password"}
                  endIcon={
                    <div className="cursor-pointer" onClick={() => setVisiblePassword(!visiblePassword)}>
                      {visiblePassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </div>
                  }
                  error={!!errors.password}
                  id="sign-up-password-input"
                />
                {errors.password && <p className="text-xss text-error font-medium">{errors.password.message}</p>}
              </div>
              <div className="space-y-1">
                <TextInput
                  value={watch("repeatPassword") || ""}
                  onChange={(e) => setValue("repeatPassword", e.target.value, { shouldValidate: isSubmitted })}
                  className="w-full"
                  label="Retype Password"
                  type={visibleRepeatPassword ? "text" : "password"}
                  endIcon={
                    <div className="cursor-pointer" onClick={() => setVisibleRepeatPassword(!visibleRepeatPassword)}>
                      {visibleRepeatPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </div>
                  }
                  error={!!errors.repeatPassword}
                  id="sign-up-repeatPassword-input"
                />
                {errors.repeatPassword && <p className="text-xss text-error font-medium">{errors.repeatPassword.message}</p>}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <CheckBox
            onChange={() => setValue("subscribeToEmail", !watch("subscribeToEmail"))}
            label="Click here to receive news and updates from Parcel Market."
            className="col-span-2"
          />
          <CheckBox
            error={!!errors.agreeTerm}
            checked={watch("agreeTerm")}
            onChange={() => setValue("agreeTerm", !watch("agreeTerm"), { shouldValidate: isSubmitted })}
            label={
              <p>
                Yes, I understand and agree to the Parcel Market
                <span onClick={() => setTermsDialog(true)} className="underline text-primary-main cursor-pointer px-1">
                  Terms of Service
                </span>
                and
                <span onClick={() => setPrivacyDialog(true)} className="underline text-primary-main cursor-pointer px-1">
                  Privacy Policy.
                </span>
              </p>
            }
            className="col-span-2"
          />
        </div>
      </div>
      <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
        <p className="text-center font-medium text-sm">
          Already have an account?{" "}
          <span
            id="sign-up-signin-redirect-button"
            className="underline text-primary-main font-medium text-sm cursor-pointer"
            onClick={showSignIn}
          >
            Sign In
          </span>
        </p>
        <div className="flex gap-3 flex-col-reverse sm:flex-row w-full sm:w-fit items-center sm:items-end">
          <Button id="sign-up-back-input" className="w-full max-w-96 sm:w-fit" variant="secondary" onClick={goBack}>
            Back
          </Button>
          <Button
            id="sign-up-accept-input"
            className="w-full max-w-96 sm:w-fit"
            onClick={onClick}
            loading={isSubmitting || isTransitioning}
            disabled={!watch("agreeTerm")}
          >
            Create Account
          </Button>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
