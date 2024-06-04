import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Box, Button, Divider, InputAdornment, MenuItem, Popover, TextField } from "@mui/material";
import { MouseEvent, useState } from "react";

interface IOption {
  min: number | null;
  max: number | null;
}

interface ICustomMinMaxAutocomplete {
  options: Array<IOption>;
  onSelect: (val: IOption | null) => void;
  placeholder: string;
  getLabel: (value: IOption | null) => string;
}

const LandsMarketplaceFiltersMinMaxAutocomplete = ({ onSelect, options, placeholder, getLabel }: ICustomMinMaxAutocomplete) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<ICustomMinMaxAutocomplete["options"][0]>({ min: null, max: null });
  const [tempValue, setTempValue] = useState<ICustomMinMaxAutocomplete["options"][0]>({ min: null, max: null });

  const handlePopoverOpen = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <TextField
        placeholder={placeholder}
        InputProps={{
          sx: { minHeight: 36 },
          endAdornment: <InputAdornment position="end">{anchorEl ? <ArrowDropUp /> : <ArrowDropDown />}</InputAdornment>,
        }}
        sx={{ borderRadius: 74, "& fieldset": { borderRadius: 18.5 }, width: 150 }}
        size="small"
        onClick={handlePopoverOpen}
        autoComplete="off"
        value={getLabel(value)}
      />
      <Popover
        transitionDuration={0}
        disableScrollLock
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{ paper: { sx: { mt: 0.5, maxWidth: 240, p: 0, borderRadius: 4 }, elevation: 1 } }}
      >
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 8px 1fr", gap: 0.5, width: "100%", alignItems: "center", p: 2 }}>
          <TextField
            value={tempValue.min || ""}
            onChange={(e) => setTempValue({ ...tempValue, min: Number(e.target.value) })}
            InputProps={{ sx: { minHeight: 38 } }}
            size="small"
            fullWidth
            label="Min"
          />
          <Divider sx={{ width: "100%", height: 2 }} />
          <TextField
            value={tempValue.max || ""}
            onChange={(e) => setTempValue({ ...tempValue, max: Number(e.target.value) })}
            InputProps={{ sx: { minHeight: 38 } }}
            size="small"
            fullWidth
            label="Max"
          />
        </Box>
        <Box>
          {options.map((el) => (
            <MenuItem
              key={el.min}
              disableRipple
              sx={{ fontSize: 12, fontWeight: 500, py: 1.5, px: 2 }}
              onClick={() => setTempValue(el)}
              selected={el.min === tempValue.min && el.max === tempValue.max}
            >
              {getLabel(el)}
            </MenuItem>
          ))}
        </Box>
        <Divider />
        <Box sx={{ "& button": { py: 1.1 }, p: 1.5, ml: "auto", display: "flex", width: "100%", justifyContent: "flex-end", gap: 1 }}>
          <Button
            size="small"
            variant="text"
            color="inherit"
            onClick={() => {
              setTempValue(value);
              handlePopoverClose();
            }}
          >
            Clear
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              setValue({ ...tempValue });
              handlePopoverClose();
              onSelect(tempValue.min || tempValue.max ? tempValue : null);
            }}
          >
            Done
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};
export default LandsMarketplaceFiltersMinMaxAutocomplete;
