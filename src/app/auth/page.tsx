"use client";

import routes from "@/helpers/routes";
import CheckboxCheckedIcon from "@/icons/CheckboxCheckedIcon";
import CheckboxIcon from "@/icons/CheckboxIcon";
import GoogleIcon from "@/icons/GoogleIcon";
import { useAuthMutation, useGoogleAuthMutation } from "@/lib/features/apis/authApi";
import { useAppSelector } from "@/lib/hooks";
import { ISignIn } from "@/types/auth";
import { signInSchema } from "@/validations/auth-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Checkbox, Divider, FormControlLabel, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { Eye, EyeSlash } from "iconsax-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const NewAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authUser, { isLoading }] = useAuthMutation();
  const [showPassword, setShowPassword] = useState(false);
  const { selectedParcelOptions } = useAppSelector((state) => state.authedUser);
  const [googleAuth] = useGoogleAuthMutation();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<ISignIn>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: null,
      password: null,
    },
  });

  const handleRedirect = () => {
    if (selectedParcelOptions) {
      router.push(routes.propertySearch.signature);
    } else if (searchParams.get("from") === "marketplace") {
      router.push(routes.home.marketplace);
    } else {
      router.push(routes.home.root);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await authUser(data).unwrap();
      toast.success("You have successfully logged in");
      handleRedirect();
      localStorage.setItem("token", res.data.access_token);
    } catch (error) {
      localStorage.removeItem("token");
    }
  });

  const onGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleAuth(tokenResponse.access_token).unwrap();
        if ("access_token" in res.data) {
          toast.success("You have successfully logged in");
          handleRedirect();
          localStorage.setItem("token", res.data.access_token);
        } else {
          router.push(`${routes.auth.signUp}?email=${res.data.email}&name=${res.data.name}&token=${res.data.token}`);
        }
      } catch (error) {}
    },
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", height: "100%", maxWidth: 296, m: "auto" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography variant="h1" sx={{ textAlign: "center", fontSize: { xs: 24, sm: 28, md: 32, lg: 36 }, fontWeight: 600 }}>
          Sign In
        </Typography>
      </Box>

      <Box sx={{ width: "100%", display: "grid", gridTemplateColumns: { xs: "1fr" }, gap: 2 }}>
        <TextField autoComplete="new-password" label="Email" {...register("email")} error={!!errors.email} />
        <TextField
          autoComplete="new-password"
          label="Password"
          {...register("password")}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!!errors.password}
        />
        <FormControlLabel
          control={<Checkbox size="small" icon={<CheckboxIcon />} checkedIcon={<CheckboxCheckedIcon />} />}
          label="Remember me"
          slotProps={{ typography: { sx: { fontSize: 12, fontWeight: 500, color: "grey.800" } } }}
        />
      </Box>
      <LoadingButton loading={isLoading} variant="contained" fullWidth onClick={onSubmit}>
        Sign In
      </LoadingButton>
      <Divider>OR</Divider>
      <Box
        sx={{
          "& svg": { width: 24, height: 24 },
          display: "flex",
          gap: 2,
          boxShadow: "0px 2px 3px 0px rgba(0, 0, 0, 0.168)",
          borderRadius: 10,
          py: 1.5,
          width: "100%",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() => onGoogleLogin()}
      >
        <GoogleIcon />
        <Typography sx={{ fontWeight: 500, fontSize: 16, opacity: 0.56 }}>Continue with Google</Typography>
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 500, mt: "auto" }}>
        Don&apos;t have an account?{" "}
        <Link href={routes.auth.signUp}>
          <Typography
            sx={{ fontSize: 14, fontWeight: 500, color: "primary.main", textDecoration: "underline", cursor: "pointer" }}
            component="span"
          >
            Sign Up{" "}
          </Typography>
        </Link>
      </Typography>
    </Box>
  );
};

export default NewAuth;
