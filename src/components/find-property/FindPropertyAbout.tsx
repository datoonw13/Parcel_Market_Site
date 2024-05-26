import { useLazyCalculatePriceQuery } from "@/lib/features/apis/propertyApi";
import { IFindPropertyAbout, IFindPropertyEstimatedPrice, IFindPropertyEstimatedPriceResponse } from "@/types/find-property";
import { IMapItem } from "@/types/map";
import { findPropertyAbout } from "@/validations/find-property-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Checkbox, Divider, FormControlLabel, TextField, Typography } from "@mui/material";
import React, { forwardRef } from "react";
import { useForm } from "react-hook-form";

import { NumericFormat } from "react-number-format";

const NumberFormatCustom = forwardRef((props: any, inputRef: any) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator=","
      decimalSeparator="."
      prefix="$"
      suffix=" USD"
      decimalScale={2}
    />
  );
});

interface IProps {
  goBack: () => void;
  onNext: (data: IFindPropertyEstimatedPriceResponse) => void;
  selectedRegridItem: IMapItem | null;
}

const FindPropertyAbout = ({ goBack, onNext, selectedRegridItem }: IProps) => {
  const [calculatePrice] = useLazyCalculatePriceQuery();

  const {
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitting },
    setValue,
    watch,
  } = useForm<IFindPropertyAbout>({
    resolver: yupResolver(findPropertyAbout),
    defaultValues: {
      improvementsValue: null,
      langCoverType: null,
      propertyAccess: null,
      propertyCondition: null,
      propertyRestriction: null,
      waterFeature: null,
      waterFront: null,
      wetProperty: null,
      agreement: false,
    },
    reValidateMode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    const { agreement, ...aboutProperty } = data;
    if (!selectedRegridItem) {
      return;
    }
    const reqData: IFindPropertyEstimatedPrice = {
      body: {
        ...aboutProperty,
        county: selectedRegridItem?.properties.fields.county.toLocaleLowerCase(),
        state: selectedRegridItem?.properties.fields.state2.toLocaleLowerCase(),
        parcelNumber: selectedRegridItem?.properties.fields.parcelnumb,
        owner: selectedRegridItem.properties.fields.owner,
        improvementsValue: data.improvementsValue || 0,
        propertyType: selectedRegridItem.properties.fields?.zoning_description || selectedRegridItem.properties.fields.usedesc || "",
      },
      queryParams: {
        acre: selectedRegridItem.properties.fields.ll_gisacre.toString(),
        lat: selectedRegridItem.properties.fields.lat,
        lon: selectedRegridItem.properties.fields.lon,
      },
    };
    try {
      const res = await calculatePrice({ ...reqData }).unwrap();
      onNext(res.data);
    } catch (error) {}
  });

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", mt: { xs: 1, md: 0 } }}>
      <Box sx={{ px: { xs: 2, md: 3, lg: 4, mb: 3 }, height: "100%" }}>
        <Box
          sx={(theme) => ({
            border: { xs: `1px solid transparent`, md: `1px solid ${theme.palette.grey[100]}` },
            borderRadius: 4,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: { xs: 4 },
            py: { md: 3, lg: 4 },
          })}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 4 }, px: { md: 4, lg: 5 } }}>
            {list.map((el, i) => (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }} key={el.key}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: errors?.[el.key as keyof IFindPropertyAbout]?.message ? "error.main" : "black",
                  }}
                >{`${i + 1}. ${el.label}`}</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {el.options.map((opt) => (
                    <Box
                      onClick={() => setValue(el.key as keyof IFindPropertyAbout, opt.value, { shouldValidate: isSubmitted })}
                      key={opt.label}
                      sx={(theme) => ({
                        border: `1px solid ${
                          watch(el.key as keyof IFindPropertyAbout) === opt.value ? theme.palette.green["200"] : theme.palette.grey[100]
                        }`,
                        bgcolor: watch(el.key as keyof IFindPropertyAbout) === opt.value ? "green.100" : "transparent",
                        color: watch(el.key as keyof IFindPropertyAbout) === opt.value ? "primary.main" : "black",
                        borderRadius: "100px",
                        fontSize: 12,
                        fontWeight: 500,
                        px: 2,
                        py: 1,
                        cursor: "pointer",
                      })}
                    >
                      {opt.label}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
          <Divider />
          <Box sx={{ px: { md: 4, lg: 5 } }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
              Please estimate a value for any improvements. Sheds, Barns, Well installed, etc.
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              sx={{ mt: 2, border: 0, outline: 0 }}
              InputProps={{ inputComponent: NumberFormatCustom, sx: { border: 0, outline: 0 } }}
              value={watch("improvementsValue") || ""}
              onChange={(e) => setValue("improvementsValue", e.target.value === "" ? null : Number(e.target.value))}
            />
          </Box>
        </Box>
      </Box>
      <FormControlLabel
        sx={{ px: { md: 4, lg: 5 }, mt: 2 }}
        control={<Checkbox onChange={() => setValue("agreement", !watch("agreement"), { shouldValidate: isSubmitted })} />}
        label={
          <Typography sx={{ fontSize: 12, color: errors.agreement ? "error.main" : "black" }}>
            Yes, I understand and agree to the Parcel Market{" "}
            <Typography
              component="span"
              sx={{ color: errors.agreement ? "error.main" : "primary.main", textDecoration: "underline", fontSize: 12 }}
            >
              Terms of Service
            </Typography>{" "}
            and{" "}
            <Typography
              component="span"
              sx={{ color: errors.agreement ? "error.main" : "primary.main", textDecoration: "underline", fontSize: 12 }}
            >
              Privacy Policy
            </Typography>
            .
          </Typography>
        }
      />
      <Divider sx={{ mt: 4 }} />
      <Box
        sx={{
          mt: 2,
          px: { xs: 2, md: 3, lg: 4, mb: 3 },
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="outlined" onClick={goBack}>
          Back
        </Button>
        <LoadingButton loading={isSubmitting} sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="contained" onClick={onSubmit}>
          Find out Your Estimated Sale Price
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default FindPropertyAbout;

const list = [
  {
    label: "Does your property have a water feature such as a lake or stream?",
    key: "waterFeature",
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
    key: "waterFront",
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
