import { usaCities, usaStatesFull } from "typed-usa-states";

const statesBlackList = [
  "Louisiana",
  "Montana",
  "Texas",
  "Idaho",
  "Mississippi",
  "New",
  "Mexico",
  "Utah",
  "Kansas",
  "Missouri",
  "North",
  "Dakota",
  "Wyoming",
];

export const getAllStates = (props?: { filterBlackList?: boolean }) =>
  usaStatesFull
    .filter((el) => (el.contiguous && props?.filterBlackList ? !statesBlackList.includes(el.name) : true))
    .map((state) => ({ label: state.name, value: state.abbreviation.toLowerCase(), counties: state.counties }));

export const getState = (state: string | null) => {
  if (!state) {
    return null;
  }
  const result = getAllStates().find(
    (el) => el.value.toLocaleLowerCase() === state.toLocaleLowerCase() || el.label.toLocaleLowerCase() === state.toLocaleLowerCase()
  );
  return result ? { label: result.label, value: result.value } : null;
};

export const getCounties = (state: string | null) => {
  if (!state) {
    return [];
  }
  const selectedState = getState(state);

  const counties =
    getAllStates().find(({ value }) => value.toLocaleLowerCase() === selectedState?.value.toLocaleLowerCase())?.counties || [];
  const formattedCounties = counties.map((el) => ({
    label: el,
    value: el
      .replaceAll(",", "")
      .split(" ")
      .map((x) => x.toLocaleLowerCase())
      .filter((el) => el !== "county")
      .join("-"),
  }));
  return formattedCounties;
};

export const getCounty = (county: string | null, state: string | null) => {
  if (!county || !state) {
    return null;
  }

  return (
    getCounties(state).find(
      ({ value, label }) =>
        value.toLocaleLowerCase().includes(county.toLocaleLowerCase()) || label.toLocaleLowerCase().includes(county.toLocaleLowerCase())
    ) || null
  );
};

export const getCitiesByState = (stateValue: string | null) =>
  usaCities
    .filter((el) => el.state === getAllStates().find((x) => x.value === stateValue)?.label)
    .map((city) => ({ label: city.name, value: city.name }));
