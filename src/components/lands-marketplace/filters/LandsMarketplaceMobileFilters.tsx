import { getAllStates, getCounties } from "@/helpers/states";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import { FilterList, KeyboardArrowDown } from "@mui/icons-material";
import { Box, Button, Collapse, Divider, Drawer, FormControlLabel, Radio, TextField, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { acreagesFilters, getAcreageLabel, getPriceLabel, priceFilters } from "../lands-marketplace-utils";

type FiltersType = "state" | "county" | "acreage" | "price";

interface IProps {
  filters: ILandsMarketplaceFilters;
  setFilters: Dispatch<SetStateAction<ILandsMarketplaceFilters>>;
}

const LandsMarketplaceMobileFilters = ({ filters, setFilters }: IProps) => {
  const [open, setOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState<FiltersType | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<ILandsMarketplaceFilters>({
    acreage: null,
    county: null,
    price: null,
    state: null,
  });

  const toggleFilter = (filter: FiltersType) => (openFilter === filter ? setOpenFilter(null) : setOpenFilter(filter));

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
        <Box sx={{ height: "95vh", display: "flex", flexDirection: "column", alignItems: "center", overflow: "scroll" }}>
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
              <Collapse in={openFilter === "state"}>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", height: 250, overflow: "scroll" }}>
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
              <Collapse in={openFilter === "county"}>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", height: 250, overflow: "scroll" }}>
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
            <Box sx={{ p: 2, pb: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "space-between",
                  width: "100%",
                  fontSize: 16,
                  fontWeight: 500,
                }}
                onClick={() => toggleFilter("acreage")}
              >
                Acreage
                <KeyboardArrowDown />
              </Box>
              <Collapse in={openFilter === "acreage"}>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 8px 1fr", gap: 0.5, width: "100%", alignItems: "center", mb: 1.5 }}>
                    <TextField
                      value={selectedFilters.acreage?.min || ""}
                      onChange={(e) => {
                        const newAcreageFilters = { ...(selectedFilters.acreage || { min: null, max: null }) };
                        newAcreageFilters.min = Number(e.target.value) || null;
                        if (!newAcreageFilters.min && !newAcreageFilters.max) {
                          setSelectedFilters({ ...selectedFilters, acreage: null });
                        } else {
                          setSelectedFilters({ ...selectedFilters, acreage: { ...newAcreageFilters } });
                        }
                      }}
                      InputProps={{ sx: { minHeight: 38 } }}
                      size="small"
                      fullWidth
                      label="Min"
                    />
                    <Divider sx={{ width: "100%", height: 2 }} />
                    <TextField
                      value={selectedFilters.acreage?.max || ""}
                      onChange={(e) => {
                        const newAcreageFilters = { ...(selectedFilters.acreage || { min: null, max: null }) };
                        newAcreageFilters.max = Number(e.target.value) || null;
                        if (!newAcreageFilters.min && !newAcreageFilters.max) {
                          setSelectedFilters({ ...selectedFilters, acreage: null });
                        } else {
                          setSelectedFilters({ ...selectedFilters, acreage: { ...newAcreageFilters } });
                        }
                      }}
                      InputProps={{ sx: { minHeight: 38 } }}
                      size="small"
                      fullWidth
                      label="Max"
                    />
                  </Box>
                  {acreagesFilters.map((acreage) => (
                    <FormControlLabel
                      slotProps={{ typography: { fontSize: 14, fontWeight: 500 } }}
                      value={acreage}
                      control={
                        <Radio checked={acreage.min === selectedFilters.acreage?.min && acreage.max === selectedFilters.acreage?.max} />
                      }
                      label={getAcreageLabel(acreage)}
                      onChange={() => setSelectedFilters({ ...selectedFilters, acreage })}
                      key={JSON.stringify(acreage)}
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
                }}
                onClick={() => toggleFilter("price")}
              >
                VOLT value
                <KeyboardArrowDown />
              </Box>
              <Collapse in={openFilter === "price"}>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 8px 1fr", gap: 0.5, width: "100%", alignItems: "center", mb: 1.5 }}>
                    <TextField
                      value={selectedFilters.price?.min || ""}
                      onChange={(e) => {
                        const newPriceFilters = { ...(selectedFilters.price || { min: null, max: null }) };
                        newPriceFilters.min = Number(e.target.value) || null;
                        if (!newPriceFilters.min && !newPriceFilters.max) {
                          setSelectedFilters({ ...selectedFilters, price: null });
                        } else {
                          setSelectedFilters({ ...selectedFilters, price: { ...newPriceFilters } });
                        }
                      }}
                      InputProps={{ sx: { minHeight: 38 } }}
                      size="small"
                      fullWidth
                      label="Min"
                    />
                    <Divider sx={{ width: "100%", height: 2 }} />
                    <TextField
                      value={selectedFilters.price?.max || ""}
                      onChange={(e) => {
                        const newPriceFilters = { ...(selectedFilters.price || { min: null, max: null }) };
                        newPriceFilters.max = Number(e.target.value) || null;
                        if (!newPriceFilters.min && !newPriceFilters.max) {
                          setSelectedFilters({ ...selectedFilters, price: null });
                        } else {
                          setSelectedFilters({ ...selectedFilters, price: { ...newPriceFilters } });
                        }
                      }}
                      InputProps={{ sx: { minHeight: 38 } }}
                      size="small"
                      fullWidth
                      label="Max"
                    />
                  </Box>
                  {priceFilters.map((price) => (
                    <FormControlLabel
                      slotProps={{ typography: { fontSize: 14, fontWeight: 500 } }}
                      value={price}
                      control={<Radio checked={price.min === selectedFilters.price?.min && price.max === selectedFilters.price?.max} />}
                      label={getPriceLabel(price)}
                      onChange={() => setSelectedFilters({ ...selectedFilters, price })}
                      key={JSON.stringify(price)}
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
