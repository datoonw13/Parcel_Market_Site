/* eslint-disable react/jsx-no-duplicate-props */
import { Search } from "@mui/icons-material";
import { Box, IconButton, InputBase } from "@mui/material";
import { useState } from "react";

interface IProps {
  onSearch: (value: string | null) => void;
}

const marketlpaceSearch = ({ onSearch }: IProps) => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "grey.100",
        width: "100%",
        justifyContent: "space-between",
        height: 44,
        borderRadius: 36,
      }}
    >
      <InputBase
        value={value || ""}
        onChange={(e) => setValue(e.target.value || null)}
        inputProps={{ sx: { p: 0 } }}
        sx={{ height: "auto", width: "100%", pr: 1.25, pl: 2, minHeight: "auto", py: 1.25 }}
        placeholder="Search by Parcel ID, or by owner "
      />
      <Box
        sx={{
          bgcolor: "primary.main",
          width: 36,
          minWidth: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          mr: 0.5,
        }}
      >
        <IconButton onClick={() => onSearch(value)}>
          <Search sx={{ color: "white" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default marketlpaceSearch;
