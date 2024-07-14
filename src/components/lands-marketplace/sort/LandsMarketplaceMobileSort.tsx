import { getAllStates, getCounties } from "@/helpers/states";
import { ImarketlpaceFilters, SortBy } from "@/types/lands";
import { FilterList, KeyboardArrowDown } from "@mui/icons-material";
import { Box, Button, Collapse, Divider, Drawer, FormControlLabel, Radio, TextField, Typography } from "@mui/material";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface IProps {
  filters: ImarketlpaceFilters;
  setFilters: Dispatch<SetStateAction<ImarketlpaceFilters>>;
}

const marketlpaceMobileSort = ({ filters, setFilters }: IProps) => {
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<ImarketlpaceFilters>({
    acreageMin: null,
    acreageMax: null,
    county: null,
    priceMin: null,
    priceMax: null,
    state: null,
    page: 1,
    pageSize: 10,
    sellerType: "sale",
    sortBy: null,
  });

  useEffect(() => {
    setSelectedFilters(filters);
  }, [filters]);

  return (
    <Box>
      <Button
        endIcon={
          <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
            <ArrowUp2 size={12} />
            <ArrowDown2 size={12} />
          </Box>
        }
        variant="outlined"
        color="inherit"
        size="small"
        sx={{
          py: 0.813,
          borderColor: "transparent",
          borderRadius: "74px",
          bgcolor: "transparent !important",
          fontSize: 12,
          width: "max-content",
        }}
        onClick={() => setOpen(true)}
      >
        {selectedFilters.sortBy || "Sort by"}
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}
      >
        <Box sx={{ height: "90vh", display: "flex", flexDirection: "column", alignItems: "center", overflow: "scroll" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "sticky",
              top: 0,
              bgcolor: "white",
              zIndex: 2,
            }}
          >
            <Divider sx={{ width: 60, borderWidth: 4, mt: 1, borderRadius: 1, borderColor: "#E7E7E7" }} />
            <Typography sx={{ fontSize: 16, fontWeight: 500, my: 2 }}>Sort By</Typography>
            <Divider />
          </Box>
          <Box sx={{ width: "100%", pb: 2, height: "100%" }}>
            <Box sx={{ p: 2, pb: 0 }}>
              <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
                {Object.keys(SortBy).map((sortItem) => (
                  <FormControlLabel
                    slotProps={{ typography: { fontSize: 14, fontWeight: 500 } }}
                    value={SortBy[sortItem as keyof typeof SortBy]}
                    control={<Radio checked={SortBy[sortItem as keyof typeof SortBy] === selectedFilters.sortBy} />}
                    label={SortBy[sortItem as keyof typeof SortBy]}
                    onChange={() => setSelectedFilters({ ...selectedFilters, sortBy: SortBy[sortItem as keyof typeof SortBy] })}
                    key={`mobile-${sortItem}`}
                  />
                ))}
              </Box>
            </Box>
          </Box>
          <Box
            boxShadow={1}
            sx={{
              width: "100%",
              display: "flex",
              p: 2,
              flexDirection: "column",
              gap: 1,
              bgcolor: "white",
              zIndex: 2,
              position: "sticky",
              bottom: 0,
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setFilters(selectedFilters);
                setOpen(false);
              }}
            >
              Apply
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                setSelectedFilters(filters);
                setOpen(false);
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default marketlpaceMobileSort;
