"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { useEffect, useRef, useState } from "react";
import { IPropertiesInteraction, VoltSearchModel } from "@/types/volt";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { voltSearchSchema } from "@/zod-validations/volt";
import { ResponseModel } from "@/types/common";
import { IMainPropertyBaseInfo } from "@/types/property";
import { z } from "zod";
import { IDecodedAccessToken } from "@/types/auth";
import SignInForm from "@/app/auth/sign-in/sign-in";
import SignUpForm from "@/app/auth/sign-up/sign-up";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import VoltDesktop from "./volt-desktop";
import { breakPoints } from "../../../tailwind.config";
import VoltMobile from "./volt-mobile";
import ResponsiveModal from "../ui/dialogs/responsive-dialog";

const VoltLayout = ({
  data,
  initialParams,
  user,
}: {
  data: ResponseModel<IMainPropertyBaseInfo[] | null> | null;
  initialParams: z.infer<typeof voltSearchSchema> | null;
  user: IDecodedAccessToken | null;
}) => {
  const { targetReached: isSm, detecting } = useMediaQuery(parseFloat(breakPoints.lg));
  const [propertiesInteraction, setPropertiesInteraction] = useState<IPropertiesInteraction>({ hover: null, popup: null });
  const [authModal, setAuthModal] = useState<"sign-in" | "sign-up" | null>(null);
  const lastFetchedId = useRef<number | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

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
    if (!authModal) {
      const newParams = new URLSearchParams(initialParams || "");
      // newParams.delete("access_token");
      // newParams.delete("firstName");
      // newParams.delete("lastName");
      // newParams.delete("email");
      // router.push(`${pathname}?${newParams.toString()}`);
    }
  }, [authModal, initialParams, params, pathname, router]);

  if (detecting) return null;

  return (
    <>
      <ResponsiveModal
        dialogContentClassName="max-w-2xl w-full max-h-70vh [&>div>div:last-child]:pt-2"
        drawerContentClassName="max-h-[90vh] flex px-0 [&>div:last-child]:px-5 [&>div:last-child]:overflow-auto"
        open={!!authModal}
        closeModal={() => setAuthModal(null)}
      >
        <div className="py-5">
          {authModal === "sign-in" ? (
            <SignInForm
              searchParams={{}}
              onSignUpClick={() => {
                setAuthModal("sign-up");
              }}
              onSuccessFinish={() => {
                router.push(`/volt/${lastFetchedId.current}`);
              }}
              googleAuth={{
                onSuccessFinish: () => {
                  router.push(`/volt/${lastFetchedId.current}`);
                },
                redirectOnSignUp: (data) => {
                  const newParams = new URLSearchParams(params.toString());
                  newParams.set("access_token", data.accessToken);
                  newParams.set("firstName", data.firstName);
                  newParams.set("lastName", data.lastName);
                  newParams.set("email", data.email);
                  router.push(`${pathname}?${newParams.toString()}`);
                  setAuthModal("sign-up");
                },
              }}
            />
          ) : (
            <SignUpForm
              onSignInClick={() => {
                setAuthModal("sign-in");
              }}
              googleAuth={{
                onSuccessFinish: () => {
                  router.push(`/volt/${lastFetchedId.current}`);
                },
                redirectOnSignUp: (data) => {
                  const newParams = new URLSearchParams(params.toString());
                  newParams.set("access_token", data.accessToken);
                  newParams.set("firstName", data.firstName);
                  newParams.set("lastName", data.lastName);
                  newParams.set("email", data.email);
                  router.push(`${pathname}?${newParams.toString()}`);
                  setAuthModal("sign-up");
                },
              }}
              onEmailSignUpFinish={() => {
                if (lastFetchedId.current) {
                  localStorage.setItem("voltLastFetchedId", lastFetchedId.current.toString());
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
