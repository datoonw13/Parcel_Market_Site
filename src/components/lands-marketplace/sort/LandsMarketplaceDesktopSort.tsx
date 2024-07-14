import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { getAllStates, getCounties } from "@/helpers/states";
import AutoCompleteListboxComponent from "@/components/shared/AutoCompleteListboxComponent";
import { ArrowDown2, ArrowSwapVertical, ArrowUp2 } from "iconsax-react";
import { ImarketlpaceFilters, SortBy } from "@/types/lands";

interface IProps {
  filters: ImarketlpaceFilters;
  setFilters: Dispatch<SetStateAction<ImarketlpaceFilters>>;
}

const marketlpaceDesktopSort = ({ filters, setFilters }: IProps) => (
  <Autocomplete
    fullWidth
    renderInput={(params) => (
      <TextField
        {...params}
        size="small"
        placeholder="Sort By"
        InputProps={{
          ...params.InputProps,
          sx: { minHeight: 36, paddingRight: "6px !important" },
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end" sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <ArrowUp2 size={26} />
              <ArrowDown2 size={26} />
            </InputAdornment>
          ),
        }}
        sx={{ borderRadius: 74, border: "0 !important", "& fieldset": { borderRadius: 18.5, border: "0 !important" } }}
      />
    )}
    ListboxComponent={AutoCompleteListboxComponent}
    options={Object.values(SortBy)}
    sx={{ minWidth: 150, pr: 0 }}
    disableCloseOnSelect
    onChange={(_, val) => setFilters({ ...filters, sortBy: val })}
    value={filters.sortBy}
  />
);

export default marketlpaceDesktopSort;
