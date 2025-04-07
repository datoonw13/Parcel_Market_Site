"use client";

import { GiCheckMark } from "react-icons/gi";
import { z } from "zod";
import { emailSchema } from "@/zod-validations/auth-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IUserBaseInfo } from "@/types/auth";
import { useEffect } from "react";
import { userFeedbackAction } from "@/server-actions/common-actions";
import useNotification from "@/hooks/useNotification";
import { Button } from "../ui/button";
import { TextArea, TextInput } from "../ui/input";

export const formSchema = z.object({
  email: emailSchema,
  name: z.string().trim().min(1),
  comment: z.string().trim().min(1),
});

const VoltSupport = ({ user }: { user: IUserBaseInfo | null }) => {
  const { notify } = useNotification();
  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting, isValid },
    reset,
    register,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const { errorMessage } = await userFeedbackAction({ ...data, type: "feedback" });
    if (!errorMessage) {
      notify({ title: "Your feedback has been received!", description: "We appreciate your input and will review it shortly" });
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
    <div
      className="px-5 py-12 sm:py-14 md:py-20 lg:py-24  mt-16 md:mt-20 lg:mt-24 relative"
      style={{ background: "linear-gradient(101.53deg, #0E8B40 16.59%, #16DB65 144.19%)" }}
    >
      <svg
        className="absolute w-full h-full top-0 left-0 hidden xl:block"
        preserveAspectRatio="none"
        viewBox="0 0 1440 662"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={1440} height={662} transform="translate(0 0.000244141)" fill="url(#paint0_linear_3750_28724)" />
        <mask
          id="mask0_3750_28724"
          style={{
            maskType: "alpha",
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={1440}
          height={662}
        >
          <rect width={1440} height={662} transform="translate(0 0.000244141)" fill="url(#paint1_linear_3750_28724)" />
        </mask>
        <g mask="url(#mask0_3750_28724)">
          <path
            d="M-436.489 -32.4594C-320.094 201.038 3.1985 642.727 365.204 541.5C817.711 414.967 1010.75 -38.8088 1622.66 664.146C2112.19 1226.51 2315.16 1506.51 2355.45 1576.22"
            stroke="url(#paint2_linear_3750_28724)"
            strokeOpacity={0.6}
          />
          <path
            d="M-456.992 -86.2194C-340.597 147.278 -17.3045 588.967 344.701 487.74C797.208 361.206 990.252 -92.5689 1602.16 610.386C2091.68 1172.75 2294.65 1452.75 2334.95 1522.46"
            stroke="url(#paint3_linear_3750_28724)"
            strokeOpacity={0.6}
          />
          <path
            d="M-477.496 -139.976C-361.1 93.522 -37.8082 535.211 324.198 433.984C776.705 307.45 969.748 -146.325 1581.65 556.63C2071.18 1118.99 2274.15 1398.99 2314.44 1468.7"
            stroke="url(#paint4_linear_3750_28724)"
            strokeOpacity={0.6}
          />
          <path
            d="M-497.996 -193.725C-381.601 39.773 -58.3085 481.462 303.697 380.235C756.204 253.701 949.248 -200.074 1561.15 502.881C2050.68 1065.24 2253.65 1345.25 2293.94 1414.95"
            stroke="url(#paint5_linear_3750_28724)"
            strokeOpacity={0.6}
          />
          <path
            d="M-518.494 -247.464C-402.099 -13.9663 -78.8067 427.722 283.199 326.495C735.706 199.962 928.75 -253.814 1540.66 449.141C2030.18 1011.51 2233.15 1291.51 2273.44 1361.21"
            stroke="url(#paint6_linear_3750_28724)"
            strokeOpacity={0.6}
          />
          <path
            d="M-538.998 -301.228C-422.603 -67.73 -99.3104 373.959 262.695 272.732C715.202 146.198 908.246 -307.577 1520.15 395.378C2009.68 957.742 2212.65 1237.74 2252.94 1307.45"
            stroke="url(#paint7_linear_3750_28724)"
            strokeOpacity={0.6}
          />
        </g>
        <defs>
          <linearGradient id="paint0_linear_3750_28724" x1={208} y1={179.33} x2={2056.25} y2={999.68} gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E8B40" />
            <stop offset={1} stopColor="#16DB65" />
          </linearGradient>
          <linearGradient id="paint1_linear_3750_28724" x1={208} y1={179.33} x2={2056.25} y2={999.68} gradientUnits="userSpaceOnUse">
            <stop stopColor="#255A3A" />
            <stop offset={1} stopColor="#3EA266" />
          </linearGradient>
          <linearGradient id="paint2_linear_3750_28724" x1={-13.2311} y1={1077.26} x2={1888.5} y2={351.929} gradientUnits="userSpaceOnUse">
            <stop offset={0.3} stopColor="#16DB65" />
            <stop offset={0.49} stopColor="#255B3B" />
            <stop offset={0.645} stopColor="#255B3B" />
            <stop offset={0.86} stopColor="#0ED15C" />
          </linearGradient>
          <linearGradient id="paint3_linear_3750_28724" x1={-33.7342} y1={1023.5} x2={1867.99} y2={298.169} gradientUnits="userSpaceOnUse">
            <stop offset={0.3} stopColor="#16DB65" />
            <stop offset={0.49} stopColor="#255B3B" />
            <stop offset={0.645} stopColor="#255B3B" />
            <stop offset={0.86} stopColor="#0ED15C" />
          </linearGradient>
          <linearGradient id="paint4_linear_3750_28724" x1={-54.2378} y1={969.748} x2={1847.49} y2={244.413} gradientUnits="userSpaceOnUse">
            <stop offset={0.3} stopColor="#16DB65" />
            <stop offset={0.49} stopColor="#255B3B" />
            <stop offset={0.645} stopColor="#255B3B" />
            <stop offset={0.86} stopColor="#0ED15C" />
          </linearGradient>
          <linearGradient id="paint5_linear_3750_28724" x1={-74.7382} y1={915.999} x2={1826.99} y2={190.664} gradientUnits="userSpaceOnUse">
            <stop offset={0.3} stopColor="#16DB65" />
            <stop offset={0.49} stopColor="#255B3B" />
            <stop offset={0.645} stopColor="#255B3B" />
            <stop offset={0.86} stopColor="#0ED15C" />
          </linearGradient>
          <linearGradient id="paint6_linear_3750_28724" x1={-95.2364} y1={862.259} x2={1806.49} y2={136.924} gradientUnits="userSpaceOnUse">
            <stop offset={0.3} stopColor="#16DB65" />
            <stop offset={0.49} stopColor="#255B3B" />
            <stop offset={0.645} stopColor="#255B3B" />
            <stop offset={0.86} stopColor="#0ED15C" />
          </linearGradient>
          <linearGradient id="paint7_linear_3750_28724" x1={-115.74} y1={808.496} x2={1785.99} y2={83.1606} gradientUnits="userSpaceOnUse">
            <stop offset={0.3} stopColor="#16DB65" />
            <stop offset={0.49} stopColor="#255B3B" />
            <stop offset={0.645} stopColor="#255B3B" />
            <stop offset={0.86} stopColor="#0ED15C" />
          </linearGradient>
        </defs>
      </svg>
      <div className="max-w-7xl mx-auto lg:px-8 xl:px-20 grid lg:grid-cols-2 gap-y-11 gap-x-[5vw] z-10 relative">
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
                  We are here to help you succeed. Making sure Parcel Market and VOLT works for you is important. Email us anytime and our
                  representative will reach out within 24 hours.
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
            <TextArea placeholder="" className="" rootClassName="h-44" {...register("comment")} />
          </div>
          <Button id="landing-support-submit-btn" className="!mt-6 w-full" onClick={onSubmit} loading={isSubmitting} disabled={!isValid}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoltSupport;
