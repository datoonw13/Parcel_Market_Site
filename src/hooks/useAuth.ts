import { defaultSignInAction } from "@/server-actions/auth/auth";
import { defaultSignInSchema } from "@/zod-validations/auth-validations";
import { z } from "zod";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { UserSource } from "@/types/common";
import useNotification from "./useNotification";

const useAuth = () => {
  const { notify } = useNotification();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const defaultSignIn = async (values: z.infer<typeof defaultSignInSchema>, remember: boolean) => {
    const req = await defaultSignInAction(values, remember);

    if (req.errorMessage || !req.data) {
      notify({ title: "Auth", description: req.errorMessage }, { variant: "error" });
      return;
    }
    const isRedirectUrlExist = sessionStorage.getItem("auth-redirect-url");
    if (isRedirectUrlExist) {
      router.replace(sessionStorage.getItem("auth-redirect-url")!);
    } else {
      router.replace(req.data.decodedAccessToken.planSelected ? routes.home.fullUrl : routes.userSubscription.fullUrl);
    }
  };

  const thirdPartyAuth = {
    success: (planSelected?: boolean) => {
      const isRedirectUrlExist = sessionStorage.getItem("auth-redirect-url");
      if (isRedirectUrlExist) {
        router.replace(sessionStorage.getItem("auth-redirect-url")!);
      } else {
        router.replace(planSelected ? routes.home.fullUrl : routes.userSubscription.fullUrl);
      }
    },
    error: (data: { authAccessToken: string; authFirstName: string; authLastName: string; authEmail: string }) => {
      const newSearchParams = new URLSearchParams(params.toString());
      Object.keys(data).forEach((key) => {
        newSearchParams.set(key, data[key as keyof typeof data]);
      });
      newSearchParams.set("authSource", UserSource.Google);
      router.push(`${pathname === routes.auth.signIn.fullUrl ? routes.auth.signUp.fullUrl : pathname}?${newSearchParams.toString()}`);
    },
  };

  const removeRedirectUrlFromSession = () => {
    const isExist = sessionStorage.getItem("auth-redirect-url");
    if (isExist) {
      sessionStorage.removeItem("auth-redirect-url");
    }
  };

  const removeThirdPartyKeys = () => {
    const newSearchParams = new URLSearchParams(params.toString());
    ["authAccessToken", "authFirstName", "authLastName", "authEmail", "authSource"].forEach((key) => {
      const formattedKey = `auth${key[0].toLocaleUpperCase()}${key.slice(1)}`;
      newSearchParams.delete(formattedKey);
    });
  };

  return {
    removeRedirectUrlFromSession,
    defaultSignIn,
    thirdPartyAuth,
  };
};

export default useAuth;
