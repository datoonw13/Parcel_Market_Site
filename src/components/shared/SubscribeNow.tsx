"use client";

import routes from "@/helpers/routes";
import { subscribeAction } from "@/server-actions/common-actions";
import { emailSchema } from "@/zod-validations/auth-validations";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SubscribeNow = () => {
  const [subscribePending, setSubscribePending] = useState(false);
  const [email, setEmail] = useState("");
  const pathname = usePathname();

  const handleSubscribe = async () => {
    const isValidEmail = !!emailSchema.safeParse(email).success;
    if (isValidEmail) {
      setSubscribePending(true);
      await subscribeAction(email);
      setSubscribePending(false);
    }
  };
  return (
    (pathname === routes.home.fullUrl || pathname === routes.aboutUs.fullUrl) && (
      <Box>
        <Box sx={{ height: { xs: 352, sm: 362, md: 372, lg: 392, position: "relative" } }}>
          <Image alt="" src="/stadium.png" fill loading="eager" />
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 24, sm: 28, md: 32, lg: 36 },
                fontWeight: 600,
                color: "white",
                maxWidth: { xs: "90%", md: 940, textAlign: "center" },
                width: "100%",
                mb: 4.5,
              }}
            >
              Join of our community of 10,0000 users of the world’s leading organizations
            </Typography>
            <TextField
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <LoadingButton loading={subscribePending} sx={{ py: 1 }} variant="contained" onClick={handleSubscribe}>
                      Subscribe Now
                    </LoadingButton>
                  </InputAdornment>
                ),
                sx: { outline: "0 !important", border: "0 !important" },
              }}
              sx={{
                background: "white",
                borderRadius: 2,
                outline: "none",
                border: "none",
                maxWidth: { xs: "90%", md: 545 },
                width: "100%",
              }}
            />
          </Box>
        </Box>
      </Box>
    )
  );
};

export default SubscribeNow;
