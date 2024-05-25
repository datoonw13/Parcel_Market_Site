"use client";

import Badge from "@/components/shared/Badge";
import TextField from "@/components/shared/TextField";
import { ISearchProperty } from "@/types/property";
import { Fragment } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
// import NumberFormat from "react-number-format";

// function NumberFormatCustom(props) {
//   const { inputRef, onChange, ...other } = props;

//   return (
//     <NumberFormat
//       {...other}
//       getInputRef={inputRef}
//       onValueChange={(values) => {
//         onChange({
//           target: {
//             value: values.value,
//           },
//         });
//       }}
//       thousandSeparator=","
//       decimalSeparator="."
//       isNumericString
//     />
//   );
// }

interface IPropertySearchAbout {
  setValue: UseFormSetValue<ISearchProperty>;
  watch: UseFormWatch<ISearchProperty>;
}
const PropertySearchAbout = ({ setValue, watch }: IPropertySearchAbout) => (
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
        value={watch("about.improvementsValue") === 0 ? "0" : watch("about.improvementsValue") || ""}
        onChange={(value) => {
          if (!Number.isNaN(value) || value === "" || value === "0") {
            setValue("about.improvementsValue", value || value === "0" ? Number(value) : null, { shouldDirty: true, shouldValidate: true });
          }
        }}
      />
    </div>
  </div>
);

export default PropertySearchAbout;

const list = [
  {
    label: "Does your property have a water feature such as a lake or stream?",
    key: "about.waterFeature",
    options: [
      {
        label: "NO",
        value: false,
      },
      {
        label: "Yes",
        value: true,
      },
    ],
  },
  {
    label: "Is your property water front?",
    key: "about.waterFront",
    options: [
      {
        label: "NO",
        value: false,
      },
      {
        label: "Yes",
        value: true,
      },
    ],
  },
  {
    label: "What is your land cover type?",
    key: "about.langCoverType",
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
    key: "about.propertyCondition",
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
    key: "about.wetProperty",
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
    key: "about.propertyRestriction",
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
    key: "about.propertyAccess",
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
