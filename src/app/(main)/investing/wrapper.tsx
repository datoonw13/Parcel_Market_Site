"use client";

import { GiCheckMark } from "react-icons/gi";
import { z } from "zod";
import { emailSchema } from "@/zod-validations/auth-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IDecodedAccessToken } from "@/types/auth";
import { useEffect } from "react";
import { userFeedbackAction } from "@/server-actions/common-actions";
import useNotification from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import { TextArea, TextInput } from "@/components/ui/input";
import Image from "next/image";

export const formSchema = z.object({
  email: emailSchema,
  name: z.string().trim().min(1),
  comment: z.string().trim().min(1),
});

const InvestingPageWrapper = ({ user }: { user: IDecodedAccessToken | null }) => {
  const { notify } = useNotification();
  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
    register,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const { errorMessage } = await userFeedbackAction({ ...data, type: "investing" });
    if (!errorMessage) {
      notify({ title: "Your investing has been received!", description: "We appreciate your input and will review it shortly" });
      reset({
        email: user?.email || "",
        comment: "",
        name: user ? `${user.firstName} ${user.lastName}` : "",
      });
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      });
    }
  }, [reset, user]);

  return (
    <div className="relative md:mx-11 lg:mx-16 xl:mx-[11vw] md:rounded-2xl md:mt-11 py-11 px-5 md:px-12 lg:px-14 grid lg:grid-cols-2 gap-y-11 gap-x-[5vw] items-center">
      <Image src="/investing-bg.png" fill alt="" className="hidden md:block md:rounded-3xl" />
      <Image src="/investing-mobile.png" alt="" className="md:hidden w-full h-full" fill />
      <div className="z-10 relative space-y-3">
        <h1 className="font-extrabold text-5xl md:text-5xl lg:text-[44px]">Investing</h1>
        <h2 className="text-grey-800 text-lg md:text-xl lg:text-[22px]">
          Interested in investing with Parcel Market? We are always eager to discuss new partnerships and ideas! Please reach out to us and
          we will be in touch soon!
        </h2>
      </div>

      <div className="bg-white rounded-2xl px-6 md:px-8 py-6 space-y-3 z-10 relative">
        <div className="space-y-1">
          <p className="font-semibold text-sm">Name</p>
          <TextInput disabled={!!user} placeholder="Enter Name" {...register("name")} />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-sm">Email</p>
          <TextInput disabled={!!user} placeholder="Enter Email" {...register("email")} />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-sm">Description</p>
          <TextArea placeholder="" className="" rootClassName="h-44" {...register("comment")} />
        </div>
        <Button className="!mt-6 w-full" onClick={onSubmit} loading={isSubmitting} disabled={!isValid}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default InvestingPageWrapper;
