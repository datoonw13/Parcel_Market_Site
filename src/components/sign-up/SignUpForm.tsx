"use client";

import { getAllStates, getCounties } from "@/helpers/states";
import GoogleIcon from "@/icons/GoogleIcon";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Eye, EyeSlash } from "iconsax-react";
import React, { useEffect, useState } from "react";
import CheckboxIcon from "@/icons/CheckboxIcon";
import CheckboxCheckedIcon from "@/icons/CheckboxCheckedIcon";
import Link from "next/link";
import routes from "@/helpers/routes";
import { ISignUp, UserType } from "@/types/auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "@/validations/auth-validation";
import { LoadingButton } from "@mui/lab";
import { useGoogleAuthMutation, useRegisterGoogleUserMutation, useRegisterMutation } from "@/lib/features/apis/authApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthPending } from "@/lib/features/slices/authedUserSlice";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import AutoCompleteListboxComponent from "../shared/AutoCompleteListboxComponent";

interface IProps {
  goBack: () => void;
  type: ISignUp["type"];
}

const defaultValues = {
  firstName: null,
  lastName: null,
  email: null,
  mailingAddress: null,
  county: null,
  state: null,
  confirmPassword: null,
  password: null,
  agreeSubscribe: false,
  agreeTerms: false,
  type: 1,
};

const SignUpForm = ({ goBack, type }: IProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const [googleAuth] = useGoogleAuthMutation();
  const [registerGoogleUser, { isLoading: googleRegisterLoading }] = useRegisterGoogleUserMutation();
  const { selectedParcelOptions } = useAppSelector((state) => state.authedUser);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const googleAuthToken = params.get("token");
  const googleAuthName = params.get("name");
  const googleAuthEmail = params.get("email");
  const isGoogleUser = !!(googleAuthToken && googleAuthName && googleAuthEmail);

  const {
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
    setValue,
    reset,
  } = useForm<ISignUp>({
    resolver: yupResolver(signUpSchema(isGoogleUser)),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = isGoogleUser
        ? await registerGoogleUser({
            token: googleAuthToken,
            state: data.state,
            county: data.county,
            mailingAddress: data.mailingAddress,
          }).unwrap()
        : await registerUser({ ...data, name: `${data.firstName} ${data.lastName}` }).unwrap();
      router.push(selectedParcelOptions ? routes.propertySearch.signature.url : routes.home.url);
      localStorage.setItem("token", res.data.user.token);
      dispatch(setAuthPending(true));
    } catch (error) {}
  });

  const onGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleAuth(tokenResponse.access_token).unwrap();
        if ("access_token" in res.data) {
          toast.success("You have successfully logged in");
          router.push(selectedParcelOptions ? routes.propertySearch.url : routes.home.url);
          localStorage.setItem("token", res.data.access_token);
        } else {
          router.push(`${routes.auth.signUp.url}?email=${res.data.email}&name=${res.data.name}&token=${res.data.token}`);
        }
      } catch (error) {}
    },
  });

  useEffect(() => {
    if (isGoogleUser) {
      reset({ ...defaultValues, email: googleAuthEmail, firstName: googleAuthName.split(" ")[0], lastName: googleAuthName.split(" ")[1] });
    }
  }, [googleAuthEmail, googleAuthName, isGoogleUser, reset]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", height: "100%", m: "auto" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography variant="h1" sx={{ textAlign: "center", fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, fontWeight: 600 }}>
          Sign Up
        </Typography>
        <Typography sx={{ fontWeight: 500, fontSize: 16, textAlign: "center" }}>
          Create account for who’s{" "}
          <Typography component="span" sx={{ fontWeight: 500, fontSize: 16, color: "primary.main" }}>
            Looking to sell
          </Typography>
        </Typography>
      </Box>
      <Box
        sx={{
          "& svg": { width: 24, height: 24 },
          display: "flex",
          gap: 2,
          boxShadow: "0px 2px 3px 0px rgba(0, 0, 0, 0.168)",
          borderRadius: 10,
          py: 1.5,
          justifyContent: "center",
          cursor: "pointer",
          px: 6,
        }}
        onClick={() => onGoogleLogin()}
      >
        <GoogleIcon />
        <Typography sx={{ fontWeight: 500, fontSize: 16, opacity: 0.56 }}>Continue with Google</Typography>
      </Box>
      <Divider>OR</Divider>
      <Box sx={{ width: "100%", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        <TextField
          autoComplete="new-password"
          value={watch("firstName") || ""}
          fullWidth
          label="First Name"
          error={!!errors.firstName}
          onChange={(e) => setValue("firstName", e.target.value, { shouldValidate: isSubmitted })}
        />
        <TextField
          autoComplete="new-password"
          fullWidth
          label="Last Name"
          value={watch("lastName") || ""}
          error={!!errors.lastName}
          onChange={(e) => setValue("lastName", e.target.value, { shouldValidate: isSubmitted })}
        />
        <TextField
          autoComplete="new-password"
          fullWidth
          label="Email"
          error={!!errors.email}
          onChange={(e) => setValue("email", e.target.value, { shouldValidate: isSubmitted })}
          value={watch("email") || ""}
          disabled={isGoogleUser}
        />
        <TextField
          autoComplete="new-password"
          fullWidth
          label="Mailing Address"
          error={!!errors.mailingAddress}
          onChange={(e) => setValue("mailingAddress", e.target.value, { shouldValidate: isSubmitted })}
        />
        {watch("type") === UserType.PROFESSIONAL && (
          <>
            <Autocomplete
              fullWidth
              renderInput={(params) => <TextField {...params} label="State" error={!!errors.state} autoComplete="new-password" />}
              ListboxComponent={AutoCompleteListboxComponent}
              options={getAllStates()}
              onChange={(_, newValue) => {
                setValue("state", newValue?.value || null, { shouldValidate: isSubmitted });
                setValue("county", null, { shouldValidate: isSubmitted });
              }}
            />

            <Autocomplete
              fullWidth
              renderInput={(params) => <TextField {...params} label="County" error={!!errors.county} autoComplete="new-password" />}
              ListboxComponent={AutoCompleteListboxComponent}
              options={getCounties(watch("state"))}
              disabled={!watch("state")}
              onChange={(_, newValue) => setValue("county", newValue?.value || null, { shouldValidate: isSubmitted })}
            />
          </>
        )}
        {!isGoogleUser && (
          <>
            <TextField
              label="Password"
              autoComplete="new-password"
              error={!!errors.password}
              type={showPassword ? "text" : "password"}
              onChange={(e) => setValue("password", e.target.value || null, { shouldValidate: isSubmitted })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <Eye /> : <EyeSlash />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Retype Password"
              error={!!errors.confirmPassword}
              autoComplete="new-password"
              onChange={(e) => setValue("confirmPassword", e.target.value || null, { shouldValidate: isSubmitted })}
              type={showRepeatPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowRepeatPassword(!showRepeatPassword)} edge="end" size="small">
                      {showRepeatPassword ? <Eye /> : <EyeSlash />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        )}
        <Box sx={{ width: "100%", gridColumn: { sm: "1/span 2" } }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                icon={<CheckboxIcon />}
                checkedIcon={<CheckboxCheckedIcon />}
                onChange={() => setValue("agreeSubscribe", !watch("agreeSubscribe"), { shouldValidate: isSubmitted })}
              />
            }
            label="Send me emails with tips on how to find talent that fits my needs."
            slotProps={{ typography: { sx: { fontSize: 12, fontWeight: 500, color: errors.agreeSubscribe ? "error.main" : "grey.800" } } }}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                icon={<CheckboxIcon />}
                checkedIcon={<CheckboxCheckedIcon />}
                onChange={() => setValue("agreeTerms", !watch("agreeTerms"), { shouldValidate: isSubmitted })}
              />
            }
            label={
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: errors.agreeTerms ? "error.main" : "black" }}>
                Yes, I understand and agree to the Parcel Market{" "}
                <Typography
                  component="span"
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: errors.agreeTerms ? "error.main" : "primary.main",
                    textDecoration: "underline",
                  }}
                >
                  Terms of Service
                </Typography>{" "}
                and{" "}
                <Typography
                  component="span"
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: errors.agreeTerms ? "error.main" : "primary.main",
                    textDecoration: "underline",
                  }}
                >
                  Privacy Policy
                </Typography>
                .
              </Typography>
            }
            slotProps={{ typography: { sx: { fontSize: 12, fontWeight: 500, color: "grey.800" } } }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          Already have an account?{" "}
          <Link href={routes.auth.signUp.url}>
            <Typography
              sx={{ fontSize: 14, fontWeight: 500, color: "primary.main", textDecoration: "underline", cursor: "pointer" }}
              component="span"
            >
              Sign In
            </Typography>
          </Link>
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexDirection: { xs: "column", md: "row" },
            width: { xs: "100%", md: "fit-content" },
          }}
        >
          <Button sx={{ width: { xs: "100%", md: "fit-content" } }} variant="outlined" onClick={goBack}>
            Back
          </Button>
          <LoadingButton
            loading={isLoading || googleRegisterLoading}
            sx={{ width: { xs: "100%", md: "fit-content" } }}
            variant="contained"
            onClick={onSubmit}
          >
            Create Account
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpForm;
