"use client";

import clsx from "clsx";
import classes from "@/app/value-land/styles.module.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { aboutLandSchema } from "@/zod-validations/value-land-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { IFindPropertyAbout } from "@/types/find-property";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";
import TextArea from "../../shared/forms/text-area/text-area";
import TextField from "../../shared/forms/text-field";
import LabelWithInfo from "../../shared/label-with-info";
import Button from "../../shared/forms/Button";
import CheckBox from "../../shared/forms/CheckBox";
import { useState } from "react";
import ValueLandSubmitTermsModal from "../terms/terms-modal";
import { useAtom } from "jotai";
import { valueLandAtom } from "@/atoms/value-land-atom";

const AboutLandForm = () => {
  const router = useRouter();
  const [valueLandData, setValueLandData] = useAtom(valueLandAtom) 
  const [showTermsModal, setShowTermsModal] = useState(false)
  const {
    handleSubmit,
    formState: { isSubmitted, errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<z.infer<typeof aboutLandSchema>>({
    resolver: zodResolver(aboutLandSchema),
  });

  const onSubmit = handleSubmit(
    (aboutLand) => {
      setValueLandData(prev => ({...prev, aboutLand}))
      setShowTermsModal(true)
    },
    (err) => console.log(err, 22)
  );
  

  // reset atom on success submit

  return (
    <>
      <ValueLandSubmitTermsModal open={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <div className={classes["content-space-x"]}>
        <div className={clsx("gap-6 md:gap-8 flex flex-col w-full lg:p-6 xl:p-8 lg:border lg:border-grey-100 rounded-2xl")}>
          <div className="space-y-3 w-full">
            <LabelWithInfo
              labelClassName="text-sm"
              label="1. Property Name"
              description="Give your property a unique name. This usually includes a feature on the property such as the road name, creek name, etc"
            />
            <TextField
              placeholder="Type here"
              className="w-full"
              value={watch("title")}
              onChange={(value) => setValue("title", value, { shouldValidate: true })}
            />
          </div>
          <div className="space-y-3 w-full">
            <LabelWithInfo
              labelClassName="text-sm"
              label="2. Land Description"
              description="Briefly describe your property's features as well as the local area."
            />
            <div className="w-full flex flex-col justify-end gap-1">
              <TextArea
                rows={5}
                placeholder="Type here"
                value={watch("description")}
                onChange={(value) => setValue("description", value.length <= 300 ? value : "", { shouldValidate: true })}
              />
              <p className="text-xss text-grey-600 text-end">{watch("description")?.length ?? 0}/300</p>
            </div>
          </div>
          {list.map((item, i) => (
            <div className="space-y-3" key={item.key}>
              <p className="text-sm font-medium">
                {i + 3}. {item.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.options.map((opt) => (
                  <div
                    key={item.key + opt.label}
                    className={clsx(
                      "cursor-pointer border border-grey-100 rounded-3xl py-1 px-4 text-xs font-medium",
                      watch(item.key as keyof IFindPropertyAbout) === opt.value && "bg-primary-main-100 border-primary-main-200"
                    )}
                    onClick={() => setValue(item.key as keyof IFindPropertyAbout, opt.value, { shouldValidate: true })}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-3 w-full">
            <p className="font-medium text-sm">10. Please estimate a value for any improvements. Sheds, Barns, Well installed, etc.</p>
            <TextField
              prefix="$"
              suffix=" USD"
              type="number"
              placeholder="Type here"
              value={watch("improvmentsValue")?.toString() ?? ""}
              onChange={(value) => {
                console.log(value, 22);
                
                setValue("improvmentsValue", value ? Number(value) : undefined, { shouldValidate: true })
              }}
            />
          </div>
          <CheckBox
            checked={watch("agreement")}
            onChange={() => setValue("agreement", !watch("agreement"), { shouldValidate: true })}
            label={
              <p className="space-x-1">
                Yes, I understand and agree to theParcel Market <span className="text-primary-main underline">Terms of Service</span> and
                <span className="text-primary-main underline">Privacy Policy</span>.
              </p>
            }
          />
        </div>
      </div>
      <div className={classes.action}>
        <Button variant="secondary" onClick={() => router.push(routes.valueLand.value.fullUrl)}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={!isValid}>
          Add Land
        </Button>
      </div>
    </>
  );
};

export default AboutLandForm;

const list = [
  {
    label: "Does your property have a water feature such as a private lake or stream?",
    key: "waterFeature",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
    ],
  },
  {
    label: "Does your property front navigable water such as a large river or lake?",
    key: "frontNavigable",
    options: [
      {
        label: "Yes",
        value: true,
      },
      {
        label: "No",
        value: false,
      },
    ],
  },
  {
    label: "What is your land cover type?",
    key: "cover",
    options: [
      {
        label: "Wooded",
        value: "Wooded",
      },
      {
        label: "Open Field",
        value: "Open Field",
      },
      {
        label: "Mixed",
        value: "Mixed",
      },
      {
        label: "Clear Cut",
        value: "Clear Cut",
      },
      {
        label: "Desert",
        value: "Desert",
      },
    ],
  },
  {
    label: "What is the topography like on your property?",
    key: "topography",
    options: [
      {
        label: "Very Steep",
        value: "Very Steep",
      },
      {
        label: "Some Steep areas",
        value: "Some Steep areas",
      },
      {
        label: "Gently Rolling",
        value: "Gently Rolling",
      },
      {
        label: "Flat",
        value: "Flat",
      },
    ],
  },
  {
    label: "How wet is your property?",
    key: "wet",
    options: [
      {
        label: "Wet",
        value: "Wet",
      },
      {
        label: "Some portions wet",
        value: "Some portions wet",
      },
      {
        label: "Not Wet",
        value: "Not Wet",
      },
    ],
  },
  {
    label: "Does your property have restrictions such as covenants or easements?",
    key: "restriction",
    options: [
      {
        label: "Has Restrictions",
        value: true,
      },
      {
        label: "No Restrictions",
        value: false,
      },
    ],
  },
  {
    label: "How is the access to your property?",
    key: "access",
    options: [
      {
        label: "Road Frontage",
        value: "Road Frontage",
      },
      {
        label: "Legal easement",
        value: "Legal easement",
      },
      {
        label: "Non-recorded easement",
        value: "Non-recorded easement",
      },
      {
        label: "No legal access",
        value: "No legal access",
      },
    ],
  },
];