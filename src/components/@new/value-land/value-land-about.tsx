"use client";

import routes from "@/helpers/routes";
import { IFindPropertyAbout } from "@/types/find-property";
import { findPropertyAbout } from "@/validations/find-property-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Checkbox, Divider, FormControlLabel, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import { NumericFormat } from "react-number-format";
import { useAtom } from "jotai";
import { valueLandAtom } from "@/atoms/value-land-atom";
import { ISignInResponse } from "@/types/auth";

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

const ValueLandAbout = ({ user }: { user: ISignInResponse["payload"] | null }) => {
  const router = useRouter();
  const [valueLand, setValueLand] = useAtom(valueLandAtom);

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
      propertyRestriction: null,
      waterFeature: null,
      waterFront: null,
      wetProperty: null,
      agreement: false,
    },
    reValidateMode: "onChange",
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!valueLand.calculatedPrice || !valueLand.selectedLand) {
      return;
    }
    setValueLand((prev) => ({
      ...prev,
      sellOptions: {
        state: valueLand.selectedLand?.properties.fields.state2,
        county: valueLand.selectedLand?.properties.fields.county,
        propertyType:
          valueLand.selectedLand?.properties?.fields?.zoning_description || valueLand.selectedLand?.properties?.fields?.usedesc || "",
        acrage: valueLand.selectedLand!.properties.fields.ll_gisacre,
        parcelNumber: valueLand.selectedLand?.properties.fields.parcelnumb_no_formatting,
        sellerType: "sale",
        owner: valueLand.selectedLand!.properties.fields.owner,
        salePrice: valueLand.calculatedPrice!.price || 0,
        accepted: true,
        coordinates: JSON.stringify(valueLand.selectedLand!.geometry.coordinates),
        lat: valueLand.selectedLand!.properties.fields.lat,
        lon: valueLand.selectedLand!.properties.fields.lon,
        propertyId: valueLand.calculatedPrice!.id,
        ...data,
      },
    }));
    if (!user) {
      router.push(routes.auth.signIn.fullUrl);
    } else {
      router.push(routes.valueLand.signature.fullUrl);
    }
  });

  useEffect(() => {
    if (!valueLand.calculatedPrice) {
      router.push(routes.valueLand.fullUrl);
    }
  }, [router, valueLand.calculatedPrice]);

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
          my: 2,
          px: { xs: 2, md: 3, lg: 4, mb: 3 },
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Button
          sx={{ width: { xs: "100%", sm: "fit-content" } }}
          variant="outlined"
          onClick={() => router.push(routes.valueLand.found.fullUrl)}
        >
          Back
        </Button>
        <LoadingButton loading={isSubmitting} sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="contained" onClick={onSubmit}>
          Continue
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default ValueLandAbout;

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
