import { defaultSignInAction } from "@/server-actions/auth/auth";
import { defaultSignInSchema } from "@/zod-validations/auth-validations";
import { z } from "zod";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { UserSource } from "@/types/common";
import useNotification from "./useNotification";

const useAuth = () => {
  const defaultSignIn = (data: { email: string; password: string; remember?: boolean }) => {};
  const thirdPartySignIn = (data: { token: string; userSource: UserSource }) => {};

  return null;
};

export default useAuth;
