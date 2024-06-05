import { numFormatter } from "@/helpers/common";
import routes from "@/helpers/routes";
import CheckboxCheckedIcon from "@/icons/CheckboxCheckedIcon";
import CheckboxIcon from "@/icons/CheckboxIcon";
import { useSellPropertyTypeMutation } from "@/lib/features/apis/propertyApi";
import { setSelectedParcelOptions } from "@/lib/features/slices/authedUserSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ISellProperty } from "@/types/find-property";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Checkbox, Divider, FormControlLabel, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FindPropertySignature = ({ goBack }: { goBack: () => void }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { selectedParcelOptions } = useAppSelector((state) => state.authedUser);
  const [accepted, setAccepted] = useState<boolean>(false);
  const [sellProperty, { isLoading }] = useSellPropertyTypeMutation();
  const [values, setValues] = useState<ISellProperty | null>(null);

  const handleSubmit = async () => {
    if (accepted && values) {
      try {
        await sellProperty({ ...values }).unwrap();
        toast.success("Check your email");
        router.push(routes.user.properties);
      } catch {}
    }
  };

  useEffect(() => {
    dispatch(setSelectedParcelOptions(null));
  }, [dispatch]);

  useEffect(() => {
    if (selectedParcelOptions) {
      setValues(selectedParcelOptions);
    }
  }, [selectedParcelOptions]);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", mt: { xs: 1, md: 0 }, overflow: "hidden" }}>
      <Box sx={{ px: { xs: 2, md: 3, lg: 4, mb: 3 }, height: "100%" }}>
        <Box sx={{ bgcolor: "green.100", p: 3, borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 14, color: "grey.800" }}>Your Free Valuation</Typography>
          <Typography sx={{ fontSize: 36, fontWeight: 600, color: "primary.main" }}>
            {values?.salePrice && numFormatter.format(values.salePrice)}
          </Typography>
        </Box>
        <Box
          sx={(theme) => ({
            border: { xs: `1px solid transparent`, md: `1px solid ${theme.palette.grey[100]}` },
            borderRadius: 4,
            p: { md: 3, lg: 4 },
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          })}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Terms and Conditions of Land Marketplace</Typography>
            <Typography sx={{ fontSize: 14, color: "grey.800" }}>
              These terms and conditions (&quot;Terms&quot;) govern your use of the Land Marketplace (&quot;the Marketplace&quot;) provided
              by [Company Name]. By accessing or using the Marketplace, you agree to be bound by these Terms. If you do not agree to these
              Terms, you may not use the Marketplace.
            </Typography>
          </Box>
          {data.map((el, i) => (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }} key={el.title}>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{`${i + 1}. ${el.title}`}</Typography>
              {el.rules.map((childEl, childElI) => (
                <Typography sx={{ fontSize: 14, color: "grey.800" }} key={childEl}>
                  {i + 1}.{childElI + 1}. {childEl}
                </Typography>
              ))}
            </Box>
          ))}
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => setAccepted(!accepted)}
                size="small"
                icon={<CheckboxIcon />}
                checkedIcon={<CheckboxCheckedIcon />}
              />
            }
            label={
              <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                Yes, I understand and agree to the Parcel Market{" "}
                <Typography
                  component="span"
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
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
      <Divider sx={{ mt: 5 }} />

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
        <LoadingButton
          loading={isLoading}
          sx={{ width: { xs: "100%", sm: "fit-content" } }}
          variant="contained"
          disabled={!accepted}
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default FindPropertySignature;

const data = [
  {
    title: "Use of the Marketplace",
    rules: [
      "You must be at least 18 years old to use the Marketplace.",
      "You agree to use the Marketplace only for lawful purposes and in accordance with these Terms and all applicable laws and regulations.",
    ],
  },
  {
    title: "Listings",
    rules: [
      "All listings on the Marketplace are subject to review and approval by [Company Name]",
      "You are responsible for the accuracy of all information provided in your listings.",
      "[Company Name] reserves the right to reject or remove any listing that violates these Terms or is otherwise deemed inappropriate.",
    ],
  },
  {
    title: "Transactions",
    rules: [
      "All transactions conducted through the Marketplace are solely between the buyer and seller.",
      " [Company Name] is not responsible for any disputes between buyers and sellers or for the quality or legality of any properties listed on the Marketplace.",
      "Buyers are responsible for conducting their own due diligence before purchasing any property.",
    ],
  },
  {
    title: "Fees",
    rules: [
      "[Company Name] may charge fees for certain services provided through the Marketplace. Any applicable fees will be clearly stated before you complete a transaction.",
      "You agree to pay all fees associated with your use of the Marketplace.",
    ],
  },
  {
    title: "Intellectual Property",
    rules: [
      " All content on the Marketplace, including but not limited to text, graphics, logos, and images, is the property of [Company Name] and is protected by copyright and other intellectual property laws.",
      "You may not use, reproduce, or distribute any content from the Marketplace without the prior written consent of [Company Name].",
    ],
  },
];
