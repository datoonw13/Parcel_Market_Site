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
import SignInForm from "@/app/auth/sign-in/sign-in";
import SignUpForm from "@/app/auth/sign-up/sign-up";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import routes from "@/helpers/routes";
import { IUserBaseInfo } from "@/types/auth";
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
  user: IUserBaseInfo | null;
}) => {
  const { targetReached: isSm, detecting } = useMediaQuery(parseFloat(breakPoints.lg));
  const [propertiesInteraction, setPropertiesInteraction] = useState<IPropertiesInteraction>({ hover: null, popup: null });
  const [authModal, setAuthModal] = useState<"sign-in" | "sign-up" | null>(null);
  const lastFetchedId = useRef<number | null>(null);
  const router = useRouter();

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

  if (detecting) return null;

  return (
    <>
      <ResponsiveModal
        dialogContentClassName="max-w-2xl w-full max-h-70vh [&>div>div:last-child]:py-2"
        drawerContentClassName="max-h-[90vh] flex px-0 [&>div:last-child]:px-5 [&>div:last-child]:overflow-auto"
        open={!!authModal}
        closeModal={() => setAuthModal(null)}
      >
        <div className="py-5">
          {authModal === "sign-in" ? (
            <SignInForm
              modal={{
                showSignUp: () => setAuthModal("sign-up"),
                onAuth: () => router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`),
                closeModal: () => setAuthModal(null),
              }}
            />
          ) : (
            <SignUpForm
              modal={{
                onAuth: () => router.push(`${routes.volt.fullUrl}/${lastFetchedId.current}`),
                onRegister: () => {
                  sessionStorage.setItem("voltLastFetchedId", lastFetchedId.current?.toString() || "");
                },
                showSignIn: () => {
                  setAuthModal("sign-in");
                },
                closeModal: () => setAuthModal(null),
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
