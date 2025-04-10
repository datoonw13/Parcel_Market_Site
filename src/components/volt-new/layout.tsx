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
import useNotification from "@/hooks/useNotification";
import {
  authWithCredentialsAction,
  authWithSocialNetworkAction,
  setAuthTokensAction,
  signUpUserAction,
} from "@/server-actions/new-auth/new-auth";
import { revalidateAllPath } from "@/server-actions/subscription/actions";
import { useAuth } from "@/lib/auth/auth-context";
import VoltDesktop from "./volt-desktop";
import { breakPoints } from "../../../tailwind.config";
import VoltMobile from "./volt-mobile";
import ResponsiveModal from "../ui/dialogs/responsive-dialog";
import GoogleAuthProvider from "../auth/google-auth-provider/google-auth-provider";
import SignInForm from "../auth/sign-in";
import FacebookAuthProvider from "../auth/facebook-auth-provider";
import ForgotPasswordButton from "../@new/user/profile/modals/forgot-password/forgot-password-button";

enum SignUpSteps {
  SELECT_REASONS,
  USER_INFO,
  FINISH,
}

const mapLayers = [
  {
    label: "Outdoors",
    value: "mapbox://styles/parcelmarket/cm86y2kkf008k01sb2993ex03",
  },
  {
    label: "Navigation Night",
    value: "mapbox://styles/parcelmarket/cm86y2rmn008j01s99rkha0en",
  },
  {
    label: "Navigation Day",
    value: "mapbox://styles/parcelmarket/cm86y2ytc008u01qzf3ltegnv",
  },
  {
    label: "Satellite Streets",
    value: "mapbox://styles/parcelmarket/cm86y2bl6008t01seee1m3bov",
  },
  {
    label: "Streets",
    value: "mapbox://styles/parcelmarket/cm86y0uao006h01s8dx4060pg",
  },
  {
    label: "Monochrome Light",
    value: "mapbox://styles/parcelmarket/cm86y32m8008w01sievakedk8",
  },
  {
    label: "Monochrome Dark",
    value: "mapbox://styles/parcelmarket/cm86y36bq006i01s8hbp4hv5h",
  },
];

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
  const { signIn } = useAuth();
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
  const [authPending, startAuthTransition] = useTransition();
  const [openModal, setOpenModal] = useState(false);
  const [userSource, setUserSource] = useState(UserSource.System);
  const [requestPending, setRequestPending] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("mapbox://styles/parcelmarket/cm86y0uao006h01s8dx4060pg");
  const form = useForm<VoltSearchModel>({
    resolver: zodResolver(voltSearchSchema),
    defaultValues: {
      ...initialParams,
      searchType: initialParams?.searchType || "fullName",
    },
  });

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
        <div className="py-5 grid">
          {authModal === "sign-in" ? (
            <SignInForm
              defaultSignIn={async (data) => {
                setUserSource(UserSource.System);
                setRequestPending(true);
                const request = await authWithCredentialsAction(data);
                if (request.errorMessage) {
                  notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                  setRequestPending(false);
                } else {
                  setAuthTokensAction([
                    {
                      token: request.data!.access_token,
                      tokenName: "jwt",
                      remember: false,
                    },
                    {
                      token: request.data!.refresh_token,
                      tokenName: "jwt-refresh",
                      remember: data.remember,
                    },
                  ]);
                  signIn(request.data!, () => {
                    startAuthTransition(() => {
                      router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                    });
                  });
                }
              }}
              authWithCredentialsPending={userSource === UserSource.System && (authPending || requestPending)}
              onSignUp={() => {
                setAuthModal("sign-up");
              }}
              forgotPasswordButton={() => <ForgotPasswordButton openModal={openModal} setOpenModal={setOpenModal} user={null} />}
              authProviders={() => (
                <div className="flex flex-col gap-3 w-full">
                  <GoogleAuthProvider
                    pending={userSource === UserSource.Google && (authPending || requestPending)}
                    onSuccess={async (token) => {
                      setUserSource(UserSource.Google);
                      setRequestPending(true);
                      const request = await authWithSocialNetworkAction({ token, userSource: UserSource.Google });
                      if (request.errorMessage === "Invalid credentials") {
                        const newParams = new URLSearchParams(params.toString());
                        newParams.set("userSource", UserSource.Google);
                        newParams.set("accessToken", token);
                        newParams.set("onSuccessRedirectUrl", `${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        router.push(`${pathname}?${newParams.toString()}`);
                        setAuthModal("sign-up");
                      } else if (request.errorMessage) {
                        notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                        setRequestPending(false);
                      } else {
                        signIn(request.data!, () => {
                          startAuthTransition(() => {
                            router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                          });
                        });
                      }
                    }}
                  />
                  <FacebookAuthProvider
                    pending={userSource === UserSource.Facebook && (authPending || requestPending)}
                    onSuccess={async (token) => {
                      setUserSource(UserSource.Facebook);
                      setRequestPending(true);
                      const request = await authWithSocialNetworkAction({ token, userSource: UserSource.Facebook });
                      if (request.errorMessage === "Invalid credentials") {
                        const newParams = new URLSearchParams(params.toString());
                        newParams.set("userSource", UserSource.Google);
                        newParams.set("accessToken", token);
                        newParams.set("onSuccessRedirectUrl", `${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        startAuthTransition(() => {
                          router.push(`${pathname}?${params.toString()}`);
                        });
                      } else if (request.errorMessage) {
                        notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                        setRequestPending(false);
                      } else {
                        signIn(request.data!, () => {
                          startAuthTransition(() => {
                            router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                          });
                        });
                      }
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
              errorMessage={signUpErrorMessage}
              setErrorMessage={setSignUpErrorMessage}
              email={signUpEmail}
              setEmail={setSignUpEmail}
              showSignIn={() => {
                setAuthModal("sign-in");
              }}
              authProviders={() => (
                <div className="flex flex-col gap-3 w-full">
                  <GoogleAuthProvider
                    pending={userSource === UserSource.Google && (authPending || requestPending)}
                    onSuccess={async (token) => {
                      setUserSource(UserSource.Google);
                      setRequestPending(true);
                      const request = await authWithSocialNetworkAction({ token, userSource: UserSource.Google });
                      if (request.errorMessage === "Invalid credentials") {
                        const newParams = new URLSearchParams(params.toString());
                        newParams.set("userSource", UserSource.Google);
                        newParams.set("accessToken", token);
                        newParams.set("onSuccessRedirectUrl", `${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        router.push(`${pathname}?${newParams.toString()}`);
                        setAuthModal("sign-up");
                      } else if (request.errorMessage) {
                        notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                        setRequestPending(false);
                      } else {
                        signIn(request.data!, () => {
                          startAuthTransition(() => {
                            router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                          });
                        });
                      }
                    }}
                  />
                  <FacebookAuthProvider
                    pending={userSource === UserSource.Facebook && (authPending || requestPending)}
                    onSuccess={async (token) => {
                      setUserSource(UserSource.Facebook);
                      setRequestPending(true);
                      const request = await authWithSocialNetworkAction({ token, userSource: UserSource.Facebook });
                      if (request.errorMessage === "Invalid credentials") {
                        const newParams = new URLSearchParams(params.toString());
                        newParams.set("userSource", UserSource.Google);
                        newParams.set("accessToken", token);
                        newParams.set("onSuccessRedirectUrl", `${routes.volt.fullUrl}/${lastFetchedId.current}`);
                        startAuthTransition(() => {
                          router.push(`${pathname}?${params.toString()}`);
                        });
                      } else if (request.errorMessage) {
                        notify({ title: "Error", description: request.errorMessage }, { variant: "error" });
                        setRequestPending(false);
                      } else {
                        signIn(request.data!, () => {
                          startAuthTransition(() => {
                            router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`);
                          });
                        });
                      }
                    }}
                  />
                </div>
              )}
              onSubmit={async (data) => {
                const request = await signUpUserAction({ ...data, redirectUrl: `${routes.volt.fullUrl}/${lastFetchedId.current}` });
                if (request.errorMessage) {
                  setSignUpErrorMessage(request.errorMessage);
                  setStep(SignUpSteps.FINISH);
                } else if (data.userSource === UserSource.Google || data.userSource === UserSource.Facebook) {
                  const params = new URLSearchParams();
                  params.set("jwt", request.data!.access_token);
                  params.set("jwtRefresh", request.data!.refresh_token);
                  params.set("redirectUrl", `${routes.volt.fullUrl}/${lastFetchedId.current}`);
                  router.push(`${routes.auth.signUp.success.fullUrl}?${params.toString()}`);
                } else {
                  setStep(SignUpSteps.FINISH);
                }
              }}
              isTransitioning={false}
              className="m-auto sm:p-10 md:p-12 lg:p-14 xl:p-16"
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
          selectedLayer={selectedLayer}
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
          mapLayers={mapLayers}
          selectedLayer={selectedLayer}
          setSelectedLayer={setSelectedLayer}
        />
      )}
    </>
  );
};

export default VoltLayout;
