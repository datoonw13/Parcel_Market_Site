import { Box, Divider, SxProps, Typography } from "@mui/material";

const MiniFooter = ({ sx }: { sx?: SxProps }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      gap: 1.5,
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      pt: { xs: 3, sm: 3.5, md: 4, lg: 5 },
      pb: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
      ...sx,
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center" }}>
      <Typography sx={{ fontSize: 14, color: "grey.800", "&:hover": { fontWeight: 600 }, cursor: "pointer" }}>Privacy Policy</Typography>
      <Divider orientation="vertical" sx={{ width: 2, height: 16 }} />
      <Typography sx={{ fontSize: 14, color: "grey.800", "&:hover": { fontWeight: 600 }, cursor: "pointer" }}>Terms of use</Typography>
    </Box>
    <Typography sx={{ fontSize: 12, fontWeight: 500, color: "grey.600" }}>
      ©{new Date().getFullYear()} Parcel Market. All rights reserved.
    </Typography>
  </Box>
);

export default MiniFooter;
