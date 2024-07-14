import AutoCompleteListboxComponent from "@/components/shared/AutoCompleteListboxComponent";
import { Autocomplete, Box, Button, ClickAwayListener, Divider, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface ICustomAutocomplete {
  options: Array<{ label: string; value: string }>;
  onSelect: (val: string | null) => void;
  placeholder: string;
  disabled?: boolean;
}

const marketlpaceFiltersAutocomplete = ({ onSelect, options, placeholder, disabled }: ICustomAutocomplete) => {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState<{ label: string; value: string } | null>(null);
  const [value, setValue] = useState<{ label: string; value: string } | null>(null);

  useEffect(() => {
    if (!open && value !== tempValue) {
      setTempValue(value);
    }
  }, [open, tempValue, value]);

  return (
    <Autocomplete
      fullWidth
      disableClearable={!!tempValue}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          size="small"
          InputProps={{ ...params.InputProps, sx: { minHeight: 36 } }}
          sx={{ borderRadius: 74, "& fieldset": { borderRadius: 18.5 } }}
          onClick={() => setOpen(true)}
        />
      )}
      ListboxComponent={AutoCompleteListboxComponent}
      options={options}
      sx={{ width: 150 }}
      open={open}
      disabled={disabled}
      disableCloseOnSelect
      onChange={(_, val) => {
        setTempValue(val);
      }}
      value={tempValue}
      PaperComponent={({ children, ...rest }) => (
        <ClickAwayListener disableReactTree onClickAway={() => setOpen(false)}>
          <Paper {...rest} sx={{ width: 240, maxHeight: "30vh !important" }}>
            {children}
            <Divider />
            <Box sx={{ "& button": { py: 1.1 }, p: 1.5, ml: "auto", display: "flex", width: "100%", justifyContent: "flex-end", gap: 1 }}>
              <Button
                size="small"
                variant="text"
                color="inherit"
                onClick={() => {
                  setOpen(false);
                  setValue(null);
                  onSelect(null);
                }}
              >
                Clear
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={(e) => {
                  setOpen(false);
                  setValue(tempValue);
                  onSelect(tempValue?.value || null);
                }}
              >
                Done
              </Button>
            </Box>
          </Paper>
        </ClickAwayListener>
      )}
    />
  );
};

export default marketlpaceFiltersAutocomplete;
