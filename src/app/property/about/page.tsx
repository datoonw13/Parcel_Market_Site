"use client";

import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import TextField from "@/components/shared/TextField";
import { setAbout } from "@/lib/features/slices/findPropertySlice";
import { useAppDispatch } from "@/lib/hooks";
import { IFindPropertyAbout } from "@/types/property";
import { findPropertyAboutSchema } from "@/validations/property-schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { useForm } from "react-hook-form";

const PropertyAbout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    formState: { isValid },
    setValue,
    watch,
  } = useForm<IFindPropertyAbout>({
    resolver: yupResolver(findPropertyAboutSchema),
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(setAbout(data));
    router.push("/property/estimated-price");
  });

  return (
    <div className="flex flex-col gap-6">
      {list.map((el) => (
        <div key={el.label}>
          <p className="mb-4 text-grey-500 font-semibold text-lg">{el.label}</p>
          <div className="flex items-center gap-4 flex-wrap">
            {el.options.map((opt) => (
              <Fragment key={opt.label}>
                <Badge
                  select={watch(el.key as any) === opt.value}
                  label={opt.label}
                  onClick={() => setValue(el.key as any, opt.value, { shouldDirty: true, shouldValidate: true })}
                />
              </Fragment>
            ))}
          </div>
        </div>
      ))}
      <div>
        <p className="mb-4 text-grey-500 font-semibold text-lg">
          Please estimate a value for any improvements. Sheds, Barns, Well installed, etc.
        </p>
        <TextField
          name="improvements-value"
          startIcon="$"
          value={watch("improvementsValue") || ""}
          onChange={(value) => {
            if (/^-?\d+\.?\d*$/.test(value) || value === "") {
              setValue("improvementsValue", value);
            }
          }}
        />
      </div>
      <Button classNames="mt-4 md:w-fit" disabled={!isValid} onClick={onSubmit}>
        Find out Your Estimated Sale Price
      </Button>
    </div>
  );
};

export default PropertyAbout;

const list = [
  {
    label: "Does your property have a water feature such as a lake or stream?",
    key: "waterFeature",
    options: [
      {
        label: "NO",
        value: 0,
      },
      {
        label: "Yes",
        value: 1,
      },
    ],
  },
  {
    label: "Is your property water front?",
    key: "waterFront",
    options: [
      {
        label: "NO",
        value: 0,
      },
      {
        label: "Yes",
        value: 1,
      },
    ],
  },
  {
    label: "What is your land cover type?",
    key: "langCoverType",
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
    ],
  },
  {
    label: "What is the property condition?",
    key: "propertyCondition",
    options: [
      {
        label: "Clean and Ready to build on",
        value: "Clean and Ready to build on",
      },
      {
        label: "Needs some site work",
        value: "Needs some site work",
      },
      {
        label: "Needs Extensive site work",
        value: "Needs Extensive site work",
      },
    ],
  },
  {
    label: "How wet is the property?",
    key: "wetProperty",
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
        label: "Not wet",
        value: "Not wet",
      },
    ],
  },
  {
    label: "Property have Restrictions?",
    key: "propertyRestriction",
    options: [
      {
        label: "Has restrictions",
        value: "Has restrictions",
      },
      {
        label: "No restrictions",
        value: "No restrictions",
      },
    ],
  },
  {
    label: "How is the access to the property?",
    key: "propertyAccess",
    options: [
      {
        label: "Road frontage",
        value: "Road frontage",
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
