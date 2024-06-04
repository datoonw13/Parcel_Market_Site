import { getAllStates, getCounties } from "@/helpers/states";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import { FilterList, KeyboardArrowDown } from "@mui/icons-material";
import { Box, Button, Collapse, Divider, Drawer, FormControlLabel, Radio, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type FiltersType = "state" | "county";

interface IProps {
  filters: ILandsMarketplaceFilters;
  setFilters: Dispatch<SetStateAction<ILandsMarketplaceFilters>>;
}

const LandsMarketplaceMobileFilters = ({ filters, setFilters }: IProps) => {
  const [open, setOpen] = useState(false);
  const [openFilters, setOpenFilters] = useState<Array<FiltersType>>([]);
  const [selectedFilters, setSelectedFilters] = useState<ILandsMarketplaceFilters>({
    acreage: null,
    county: null,
    price: null,
    state: null,
  });

  const toggleFilter = (filter: FiltersType) =>
    openFilters.includes(filter) ? setOpenFilters(openFilters.filter((el) => el !== filter)) : setOpenFilters([...openFilters, filter]);

  useEffect(() => {
    setSelectedFilters(filters);
  }, [filters]);

  return (
    <Box>
      <Button
        endIcon={<FilterList sx={{ width: 14, height: 14 }} />}
        variant="outlined"
        color="inherit"
        size="small"
        sx={{ py: 0.813, borderColor: "grey.100", borderRadius: "74px", bgcolor: "transparent !important", fontSize: 12 }}
        onClick={() => setOpen(true)}
      >
        Filter
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="bottom"
        PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}
      >
        <Box sx={{ height: "95vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
            <Typography sx={{ fontSize: 16, fontWeight: 500, my: 2 }}>Filter By</Typography>
            <Divider />
          </Box>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ p: 2, pb: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "space-between",
                  width: "100%",
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onClick={() => toggleFilter("state")}
              >
                State
                <KeyboardArrowDown />
              </Box>
              <Collapse in={openFilters.includes("state")}>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
                  {getAllStates().map((state) => (
                    <FormControlLabel
                      slotProps={{ typography: { fontSize: 14, fontWeight: 500 } }}
                      value={state.value}
                      control={<Radio checked={state.value === selectedFilters.state} />}
                      label={state.label}
                      onChange={() => setSelectedFilters({ ...selectedFilters, state: state.value })}
                      key={state.value}
                    />
                  ))}
                </Box>
              </Collapse>
              <Divider sx={{ mt: 2 }} />
            </Box>
            <Box sx={{ p: 2, pb: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "space-between",
                  width: "100%",
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: selectedFilters.state ? "pointer" : "not-allowed",
                  opacity: selectedFilters.state ? 1 : 0.5,
                }}
                onClick={() => selectedFilters.state && toggleFilter("county")}
              >
                County
                <KeyboardArrowDown />
              </Box>
              <Collapse in={openFilters.includes("county")}>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
                  {getCounties(selectedFilters.state).map((county) => (
                    <FormControlLabel
                      slotProps={{ typography: { fontSize: 14, fontWeight: 500 } }}
                      value={county.value}
                      control={<Radio checked={county.value === selectedFilters.county} />}
                      label={county.label}
                      onChange={() => setSelectedFilters({ ...selectedFilters, county: county.value })}
                      key={county.value}
                    />
                  ))}
                </Box>
              </Collapse>
              <Divider sx={{ mt: 2 }} />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default LandsMarketplaceMobileFilters;
