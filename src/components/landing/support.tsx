"use client";

import { GiCheckMark } from "react-icons/gi";
import { z } from "zod";
import { emailSchema } from "@/zod-validations/auth-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IDecodedAccessToken } from "@/types/auth";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { TextArea, TextInput } from "../ui/input";

export const formSchema = z.object({
  email: emailSchema,
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

const LandingSupport = ({ user }: { user: IDecodedAccessToken | null }) => {
  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting, isValid },
    reset,
    register,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data, 22);
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
    <div
      className="px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[12vw] py-12 sm:py-14 md:py-20 lg:py-24 grid lg:grid-cols-2 gap-y-11 gap-x-[5vw]"
      style={{ background: "linear-gradient(101.53deg, #002E13 16.59%, #0E8B40 144.19%)" }}
    >
      <div className="space-y-11">
        <div className="space-y-4">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white">
            We are always here for your feedback and support.
          </h1>
          <h2 className="text-white md:text-lg lg:text-xl">Parcel Market was built for you! Your opinion is very important to us.</h2>
        </div>
        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="min-w-[30px] min-h-[30px] w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center">
              <GiCheckMark className="text-primary-main" />
            </div>
            <div className="space-y-2">
              <p className="text-white font-bold text-xl md:text-2xl">Technical Support</p>
              <p className="text-white text-sm md:text-lg">
                We are here to help you succeed. Making sure Parcel Market and VOLT works for you is important. Email us anytime and a tech
                agent will reach out within 24 hours.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="min-w-[30px] min-h-[30px] w-[30px] h-[30px] rounded-full bg-white flex items-center justify-center">
              <GiCheckMark className="text-primary-main" />
            </div>
            <div className="space-y-2">
              <p className="text-white font-bold text-xl md:text-2xl">General Support and Inquiries</p>
              <p className="text-white text-sm md:text-lg">
                Something on your mind? Please contact us and we will be happy to help in any way possible. We are here for you!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl px-8 py-6 space-y-3">
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
          <TextArea placeholder="" className="" rootClassName="h-44" {...register("description")} />
        </div>
        <Button className="!mt-6 w-full" onClick={onSubmit} disabled={!isValid}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default LandingSupport;
