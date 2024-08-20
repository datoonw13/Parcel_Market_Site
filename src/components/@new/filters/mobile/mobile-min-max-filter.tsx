import { FC } from "react";
import TextField from "../../shared/forms/text-field";
import RadioButton from "../../shared/forms/RadioButton";

type MinMaxFilterType = { min: number | null; max: number | null };
interface MinMaxMobileFilterProps {
  options: Array<MinMaxFilterType>;
  value: MinMaxFilterType;
  onChange: (value: MinMaxFilterType) => void;
  renderLabel: (min: MinMaxFilterType["min"], max: MinMaxFilterType["max"]) => string;
}

const MinMaxMobileFilter: FC<MinMaxMobileFilterProps> = ({ options, renderLabel, onChange, value }) => {
  const handleMinValueChange = (minValue: string) => {
    onChange({ min: Number(minValue) || null, max: value.max });
  };

  const handleMaxValueChange = (maxValue: string) => {
    onChange({ max: Number(maxValue) || null, min: value.min });
  };

  const isError = !!(value.min && value.max && Number(value.min) >= Number(value.max));

  return (
    <>
      <div className="flex gap-2 items-center">
        <TextField
          onChange={(newVal) => {
            handleMinValueChange(newVal);
          }}
          placeholder="Min"
          type="number"
          className="!h-[38px]"
          value={value.min ? value.min.toString() : ""}
          error={isError}
        />
        <hr className="w-7 border-grey-100" />
        <TextField
          onChange={(newVal) => {
            handleMaxValueChange(newVal);
          }}
          placeholder="Max"
          type="number"
          className="!h-[38px]"
          value={value.max ? value.max.toString() : ""}
          error={isError}
        />
      </div>
      {options.map((option) => (
        <RadioButton
          key={option.min}
          checked={value.min === option.min && value.max === option.max}
          name={`acreage-${option.min}`}
          label={renderLabel(option.min, option.max)}
          onChange={() => onChange({ min: option.min, max: option.max })}
        />
      ))}
    </>
  );
};

export default MinMaxMobileFilter;
