"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect, useRef, useState, useTransition } from "react";
import { IPropertiesInteraction, VoltSearchModel } from "@/types/volt";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { voltSearchSchema } from "@/zod-validations/volt";
import { ITokens, ResponseModel, UserSource } from "@/types/common";
import { IMainPropertyBaseInfo } from "@/types/property";
import { z } from "zod";
import SignUp from "@/components/auth/sign-up/sign-up";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { IUserBaseInfo } from "@/types/auth";
import AuthClient from "@/lib/auth-client";
import useNotification from "@/hooks/useNotification";
import { getUserAction } from "@/server-actions/user/actions";
import VoltDesktop from "./volt-desktop";
import { breakPoints } from "../../../tailwind.config";
import VoltMobile from "./volt-mobile";
import ResponsiveModal from "../ui/dialogs/responsive-dialog";
import GoogleAuthProvider from "../auth/google-auth-provider/google-auth-provider";
import SignInForm from "../auth/sign-in";
import FacebookAuthProvider from "../auth/facebook-auth-provider";

enum SignUpSteps {
  SELECT_REASONS,
  USER_INFO,
  FINISH,
}

const VoltLayout = ({
  data,
  initialParams,
  user,
}: {
  data: ResponseModel<IMainPropertyBaseInfo[] | null> | null;
  initialParams: z.infer<typeof voltSearchSchema> | null;
  user: IUserBaseInfo | null;
}) => {
  const { targetReached: isSm, detecting } = useMediaQuery(parseFloat(breakPoints.lg));
  const [propertiesInteraction, setPropertiesInteraction] = useState<IPropertiesInteraction>({ hover: null, popup: null });
  const [authModal, setAuthModal] = useState<"sign-in" | "sign-up" | null>(null);
  const lastFetchedId = useRef<number | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const { notify } = useNotification();
  const [step, setStep] = useState(SignUpSteps.SELECT_REASONS);
  const [signUpErrorMessage, setSignUpErrorMessage] = useState<string | null>(null);
  const [signUpEmail, setSignUpEmail] = useState<string | null>(null);
  const [signUTokens, setSignUpTokens] = useState<ITokens | null>(null);
  const [isTransitioning, startAuthTransition] = useTransition();

  const form = useForm<VoltSearchModel>({
    resolver: zodResolver(voltSearchSchema),
    defaultValues: {
      ...initialParams,
      searchType: initialParams?.searchType || "fullName",
    },
  });

  useEffect(() => {
    if (initialParams) {
      form.reset(initialParams);

      // Manually mark all fields as dirty
      Object.keys(initialParams).forEach((fieldName) => {
        form.setValue(fieldName as keyof VoltSearchModel, initialParams[fieldName as keyof VoltSearchModel], { shouldDirty: true });
      });

      // Trigger validation if needed
      form.trigger();
    } else {
      const values = form.getValues();
      form.reset();
      // Manually mark all fields as dirty
      Object.keys(values).forEach((fieldName) => {
        form.setValue(fieldName as keyof VoltSearchModel, values[fieldName as keyof VoltSearchModel], { shouldDirty: true });
      });

      // Trigger validation if needed
      form.trigger();
    }
  }, [form, initialParams]);

  useEffect(() => {
    const isFromHome = params.get("fromHome");
    const state = params.get("state");
    const county = params.get("county");
    if (isFromHome && state && county) {
      form.setValue("county", county, { shouldDirty: true, shouldValidate: true });
      form.setValue("state", state, { shouldDirty: true, shouldValidate: true });
      router.replace(routes.volt.fullUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (detecting) return null;

  return (
    <>
      <ResponsiveModal
        dialogContentClassName="max-w-2xl w-full max-h-70vh [&>div>div:last-child]:py-2"
        drawerContentClassName="max-h-[90vh] flex px-0 [&>div:last-child]:px-5 [&>div:last-child]:overflow-auto"
        open={!!authModal}
        closeModal={() => {
          setAuthModal(null);
          setSignUpEmail(null);
          setSignUpTokens(null);
          setSignUpErrorMessage(null);
          setStep(SignUpSteps.SELECT_REASONS);
        }}
      >
        <div className="py-5">
          {authModal === "sign-in" ? (
            <SignInForm
              defaultSignIn={async (data) => {
                await AuthClient.defaultAuth({
                  ...data,
                  onError: (errorMessage) => {
                    notify({ title: "Error", description: errorMessage }, { variant: "error" });
                  },
                  onSuccess: async () => {
                    const user = await getUserAction();
                    if (user) {
                      startAuthTransition(() => {
                        router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                      });
                    }
                  },
                });
              }}
              onSignUp={() => setAuthModal("sign-up")}
              ForgotPasswordButton={undefined}
              authPending={isTransitioning}
              authProviders={() => (
                <div className="flex flex-col gap-3 w-full">
                  <GoogleAuthProvider
                    onSuccess={async (token) => {
                      await AuthClient.thirdPartyAuth({
                        token,
                        userSource: UserSource.Google,
                        remember: false,
                        onSuccess: async () => {
                          const user = await getUserAction();
                          if (user) {
                            startAuthTransition(() => {
                              router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                            });
                          }
                        },
                        onError: async () => {
                          const newParams = new URLSearchParams(params.toString());
                          newParams.append("userSource", UserSource.Google);
                          newParams.append("accessToken", token);
                          router.push(`${pathname}?${newParams.toString()}`);
                          setAuthModal("sign-up");
                        },
                      });
                    }}
                  />
                  <FacebookAuthProvider
                    onSuccess={async (token) => {
                      await AuthClient.thirdPartyAuth({
                        token,
                        userSource: UserSource.Facebook,
                        remember: false,
                        onSuccess: async () => {
                          const user = await getUserAction();
                          if (user) {
                            startAuthTransition(() => {
                              router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                            });
                          }
                        },
                        onError: async () => {
                          const newParams = new URLSearchParams(params.toString());
                          newParams.append("userSource", UserSource.Facebook);
                          newParams.append("accessToken", token);
                          router.push(`${pathname}?${newParams.toString()}`);
                          setAuthModal("sign-up");
                        },
                      });
                    }}
                  />
                </div>
              )}
              className="sm:py-10 md:py-12 lg:py-14 xl:py-16 max-w-72 mx-auto"
            />
          ) : (
            <SignUp
              step={step}
              setStep={setStep}
              authProviders={() => (
                <div className="flex flex-col gap-3 w-full">
                  <GoogleAuthProvider
                    onSuccess={async (token) => {
                      await AuthClient.thirdPartyAuth({
                        token,
                        userSource: UserSource.Google,
                        remember: false,
                        onSuccess: async () => {
                          const user = await getUserAction();
                          if (user) {
                            startAuthTransition(() => {
                              router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                            });
                          }
                        },
                        onError: async () => {
                          const newParams = new URLSearchParams(params.toString());
                          newParams.append("userSource", UserSource.Google);
                          newParams.append("accessToken", token);
                          router.push(`${pathname}?${newParams.toString()}`);
                          setAuthModal("sign-up");
                        },
                      });
                    }}
                  />
                  <FacebookAuthProvider
                    onSuccess={async (token) => {
                      await AuthClient.thirdPartyAuth({
                        token,
                        userSource: UserSource.Facebook,
                        remember: false,
                        onSuccess: async () => {
                          const user = await getUserAction();
                          if (user) {
                            startAuthTransition(() => {
                              router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                            });
                          }
                        },
                        onError: async () => {
                          const newParams = new URLSearchParams(params.toString());
                          newParams.append("userSource", UserSource.Facebook);
                          newParams.append("accessToken", token);
                          router.push(`${pathname}?${newParams.toString()}`);
                          setAuthModal("sign-up");
                        },
                      });
                    }}
                  />
                </div>
              )}
              errorMessage={signUpErrorMessage}
              setErrorMessage={setSignUpErrorMessage}
              email={signUpEmail}
              setEmail={setSignUpEmail}
              tokens={signUTokens}
              showSignIn={() => {
                setAuthModal("sign-in");
              }}
              onSubmit={async (data) => {
                await AuthClient.signUp({
                  ...data,
                  onSuccess: (result) => {
                    setSignUpEmail(data.email);
                    setStep(SignUpSteps.FINISH);
                    if (lastFetchedId.current) {
                      localStorage.setItem("voltLastFetchedId", lastFetchedId.current.toString());
                    }
                    if (result.data?.access_token && result.data?.refresh_token) {
                      setSignUpTokens({ access_token: result.data.access_token, refresh_token: result.data.refresh_token });
                    }
                  },
                  onError: (errorMessage) => {
                    setSignUpErrorMessage(errorMessage);
                    setStep(SignUpSteps.FINISH);
                  },
                });
              }}
              isTransitioning={false}
              className="m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16"
              redirectAfterSuccessPage={async () => {
                const user = await getUserAction();
                if (user) {
                  startAuthTransition(() => {
                    router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                  });
                }
              }}
            />
          )}
        </div>
      </ResponsiveModal>
      {isSm ? (
        <VoltMobile
          data={data}
          form={form}
          user={user}
          propertiesInteraction={propertiesInteraction}
          setPropertiesInteraction={setPropertiesInteraction}
          setAuthModal={(id) => {
            setAuthModal("sign-in");
            lastFetchedId.current = id;
          }}
        />
      ) : (
        <VoltDesktop
          data={data}
          form={form}
          user={user}
          propertiesInteraction={propertiesInteraction}
          setPropertiesInteraction={setPropertiesInteraction}
          setAuthModal={(id) => {
            setAuthModal("sign-in");
            lastFetchedId.current = id;
          }}
        />
      )}
    </>
  );
};

export default VoltLayout;
