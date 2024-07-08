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

export const getCounties = (stateValue: string | null) => {
  if (!stateValue) {
    return [];
  }
  const counties = getAllStates({ filterBlackList: true }).find(({ value }) => value === stateValue)?.counties || [];
  const formattedCounties = counties.map((el) => ({ label: el, value: el.split(" ")[0].toLowerCase() }));
  return formattedCounties;
};

export const getStateValue = (stateValue: string | null) => {
  if (!stateValue) {
    return null;
  }
  return getAllStates({ filterBlackList: true }).find((el) => el.value === stateValue) || null;
};

export const getCountyValue = (countyValue: string | null, stateValue: string | null) => {
  if (!countyValue || !stateValue) {
    return null;
  }
  return getCounties(stateValue).find(({ value }) => value === countyValue) || null;
};

export const getCitiesByState = (stateValue: string | null) =>
  usaCities
    .filter((el) => el.state === getAllStates({ filterBlackList: true }).find((x) => x.value === stateValue)?.label)
    .map((city) => ({ label: city.name, value: city.name }));
