"use client";

import { Info } from "@mui/icons-material";
import { Autocomplete, Box, Button, Divider, FormControlLabel, Radio, RadioGroup, SxProps, TextField } from "@mui/material";
import { usaStatesFull } from "typed-usa-states";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IFindPropertyInfo } from "@/types/find-property";
import { findPropertyInfoSchema } from "@/validations/find-property-schema";
import AutoCompleteListboxComponent from "../shared/AutoCompleteListboxComponent";

const getAllStates = () =>
  usaStatesFull
    .filter((el) => el.contiguous)
    .map((state) => ({ label: state.name, value: state.abbreviation.toLowerCase(), counties: state.counties }));

const getCounties = (state: string | null) => {
  if (!state) {
    return [];
  }
  const counties = getAllStates().find(({ value }) => value === state)?.counties || [];
  const formattedCounties = counties.map((el) => ({ label: el, value: el.split(" ")[0].toLowerCase() }));
  return formattedCounties;
};

const getStateValue = (state: string | null) => {
  if (!state) {
    return null;
  }
  return getAllStates().find((el) => el.value === state) || null;
};

const getCountyValue = (county: string | null, state: string | null) => {
  if (!county || !state) {
    return null;
  }
  return getCounties(state).find(({ value }) => value === county) || null;
};

const Label = ({ label, sx }: { label: string; sx?: SxProps }) => (
  <Box sx={{ fontSize: 14, fontWeight: 500, color: "grey.800", display: "flex", alignItems: "center", gap: 1, ...sx }}>
    {label} <Info sx={{ color: "grey.200" }} fontSize="small" />
  </Box>
);

const PropertyInfo = () => {
  const {
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    watch,
  } = useForm<IFindPropertyInfo>({
    resolver: yupResolver(findPropertyInfoSchema),
    defaultValues: {
      type: "parcelNumber",
      firstName: null,
      lastName: null,
      entityName: null,
      parcelNumber: null,
    },
    reValidateMode: "onChange",
  });

  const handleTypeChange = (value: IFindPropertyInfo["type"]) => {
    setValue("type", value, { shouldValidate: isSubmitted });
  };

  const onSubmit = handleSubmit(
    (data) => {
      console.log(data);
    },
    (errorFields) => {
      console.log(errorFields);
    }
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", mt: { xs: 1, md: 0 } }}>
      <Box sx={{ px: { xs: 2, md: 3, lg: 4, mb: 3 }, height: "100%" }}>
        <Box
          sx={(theme) => ({
            border: { xs: `1px solid transparent`, md: `1px solid ${theme.palette.grey[100]}` },
            borderRadius: 4,
            p: { md: 3, lg: 4 },
            height: "100%",
          })}
        >
          <Box>
            <Label label="Search By" />
            <RadioGroup sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, columnGap: 1, rowGap: 2, mt: 1.5 }}>
              <FormControlLabel
                value="parcelNumber"
                label={<Label label="Parcel Number" sx={{ fontSize: 16 }} />}
                control={<Radio size="small" checked={watch("type") === "parcelNumber"} />}
                onChange={() => handleTypeChange("parcelNumber")}
              />
              <FormControlLabel
                value="fullName"
                label={<Label label="Full Name" sx={{ fontSize: 16 }} />}
                control={<Radio size="small" checked={watch("type") === "fullName"} />}
                onChange={() => handleTypeChange("fullName")}
              />
              <FormControlLabel
                value="entityName"
                label={<Label label="Legal Entity" sx={{ fontSize: 16 }} />}
                control={<Radio size="small" checked={watch("type") === "entityName"} />}
                onChange={() => handleTypeChange("entityName")}
              />
            </RadioGroup>{" "}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            {watch("type") === "parcelNumber" && (
              <TextField
                fullWidth
                label="Enter parcel ID"
                value={watch("parcelNumber") || ""}
                onChange={(e) => setValue("parcelNumber", e.target.value, { shouldValidate: isSubmitted })}
                error={!!errors?.parcelNumber}
                helperText={errors?.parcelNumber?.message}
              />
            )}
            {watch("type") === "entityName" && (
              <TextField
                fullWidth
                label="Enter Name of the entity"
                value={watch("entityName") || ""}
                onChange={(e) => setValue("entityName", e.target.value, { shouldValidate: isSubmitted })}
                error={!!errors?.entityName}
                helperText={errors?.entityName?.message}
              />
            )}
            {watch("type") === "fullName" && (
              <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                <TextField
                  fullWidth
                  label="First name"
                  value={watch("firstName") || ""}
                  onChange={(e) => setValue("firstName", e.target.value, { shouldValidate: isSubmitted })}
                  error={!!errors?.firstName}
                  helperText={errors?.firstName?.message}
                />
                <TextField
                  fullWidth
                  label="Last name"
                  value={watch("lastName") || ""}
                  onChange={(e) => setValue("lastName", e.target.value, { shouldValidate: isSubmitted })}
                  error={!!errors?.lastName}
                  helperText={errors?.lastName?.message}
                />
              </Box>
            )}
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              <Autocomplete
                fullWidth
                disableClearable={!!watch("state")}
                renderInput={(params) => (
                  <TextField {...params} label="State" error={!!errors?.state} helperText={errors?.state?.message} />
                )}
                ListboxComponent={AutoCompleteListboxComponent}
                value={getStateValue(watch("state"))}
                options={getAllStates()}
                onChange={(_, newValue) => {
                  setValue("state", newValue?.value || null, { shouldValidate: isSubmitted });
                  setValue("county", null);
                }}
              />
              <Autocomplete
                ListboxComponent={AutoCompleteListboxComponent}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="County" error={!!errors?.county} helperText={errors?.county?.message} />
                )}
                options={getCounties(watch("state"))}
                value={getCountyValue(watch("county"), watch("state"))}
                disabled={!watch("state")}
                onChange={(_, newValue) => {
                  setValue("county", newValue?.value?.split(" ")?.[0].toLowerCase() || null, { shouldValidate: true });
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
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
        <Button sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="outlined">
          Back
        </Button>
        <Button sx={{ width: { xs: "100%", sm: "fit-content" } }} variant="contained" onClick={onSubmit}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default PropertyInfo;
