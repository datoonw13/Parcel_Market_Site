import { getAllStates, getCounties } from "@/helpers/states";
import { ILandsMarketplaceFilters } from "@/types/lands-marketplace";
import { FilterList, KeyboardArrowDown } from "@mui/icons-material";
import { Box, Button, Collapse, Divider, Drawer, FormControlLabel, Radio, TextField, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { acreagesFilters, getAcreageLabel, getPriceLabel, priceFilters } from "../../lands-marketplace-utils";

type FiltersType = "state" | "county" | "acreage" | "price";

interface IProps {
  filters: ILandsMarketplaceFilters;
  setFilters: Dispatch<SetStateAction<ILandsMarketplaceFilters>>;
}

const LandsMarketplaceMobileFilters = ({ filters, setFilters }: IProps) => {
  const [open, setOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState<FiltersType | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<ILandsMarketplaceFilters>({
    acreageMin: null,
    acreageMax: null,
    county: null,
    priceMin: null,
    priceMax: null,
    state: null,
    page: 1,
    pageSize: 10,
    sellerType: "instantsale",
  });

  const toggleFilter = (filter: FiltersType) => (openFilter === filter ? setOpenFilter(null) : setOpenFilter(filter));

  useEffect(() => {
    setSelectedFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (!open && openFilter) {
      setOpenFilter(null);
    }
  }, [open, openFilter]);

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
            <Typography sx={{ fontSize: 16, fontWeight: 500, my: 2 }}>Filter By</Typography>
            <Divider />
          </Box>
          <Box sx={{ width: "100%", pb: 2 }}>
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
                      key={`mobile-${state.label}`}
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
                      key={`mobile-${county.label}`}
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
                      value={selectedFilters.acreageMin || ""}
                      onChange={(e) => {
                        const newAcreageFilters = { min: selectedFilters.acreageMin, max: selectedFilters.acreageMax };
                        newAcreageFilters.min = Number(e.target.value) || null;
                        if (!newAcreageFilters.min && !newAcreageFilters.max) {
                          setSelectedFilters({ ...selectedFilters, acreageMin: null, acreageMax: null });
                        } else {
                          setSelectedFilters({ ...selectedFilters, acreageMin: newAcreageFilters.min, acreageMax: newAcreageFilters.max });
                        }
                      }}
                      InputProps={{ sx: { minHeight: 38 } }}
                      size="small"
                      fullWidth
                      label="Min"
                    />
                    <Divider sx={{ width: "100%", height: 2 }} />
                    <TextField
                      value={selectedFilters.acreageMax || ""}
                      onChange={(e) => {
                        const newAcreageFilters = { min: selectedFilters.acreageMin, max: selectedFilters.acreageMax };
                        newAcreageFilters.max = Number(e.target.value) || null;
                        if (!newAcreageFilters.min && !newAcreageFilters.max) {
                          setSelectedFilters({ ...selectedFilters, acreageMin: null, acreageMax: null });
                        } else {
                          setSelectedFilters({ ...selectedFilters, acreageMin: newAcreageFilters.min, acreageMax: newAcreageFilters.max });
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
                      control={<Radio checked={acreage.min === selectedFilters.acreageMin && acreage.max === selectedFilters.acreageMax} />}
                      label={getAcreageLabel(acreage)}
                      onChange={() => setSelectedFilters({ ...selectedFilters, acreageMin: acreage.min, acreageMax: acreage.max })}
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
                      value={selectedFilters.priceMin || ""}
                      onChange={(e) => {
                        const newPriceFilters = { min: selectedFilters.priceMin, max: selectedFilters.priceMax };
                        newPriceFilters.min = Number(e.target.value) || null;
                        if (!newPriceFilters.min && !newPriceFilters.max) {
                          setSelectedFilters({ ...selectedFilters, priceMin: null, priceMax: null });
                        } else {
                          setSelectedFilters({ ...selectedFilters, priceMin: newPriceFilters.min, priceMax: newPriceFilters.max });
                        }
                      }}
                      InputProps={{ sx: { minHeight: 38 } }}
                      size="small"
                      fullWidth
                      label="Min"
                    />
                    <Divider sx={{ width: "100%", height: 2 }} />
                    <TextField
                      value={selectedFilters.priceMax || ""}
                      onChange={(e) => {
                        const newPriceFilters = { min: selectedFilters.priceMin, max: selectedFilters.priceMax };
                        newPriceFilters.max = Number(e.target.value) || null;
                        if (!newPriceFilters.min && !newPriceFilters.max) {
                          setSelectedFilters({ ...selectedFilters, priceMin: null, priceMax: null });
                        } else {
                          setSelectedFilters({ ...selectedFilters, priceMin: newPriceFilters.min, priceMax: newPriceFilters.max });
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
                      control={<Radio checked={price.min === selectedFilters.priceMin && price.max === selectedFilters.priceMax} />}
                      label={getPriceLabel(price)}
                      onChange={() => setSelectedFilters({ ...selectedFilters, priceMin: price.min, priceMax: price.max })}
                      key={JSON.stringify(price)}
                    />
                  ))}
                </Box>
              </Collapse>
              <Divider sx={{ mt: 2 }} />
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

export default LandsMarketplaceMobileFilters;
