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
export const getAllStates = () =>
  usaStatesFull
    .filter((el) => el.contiguous && !statesBlackList.includes(el.name))
    .map((state) => ({ label: state.name, value: state.abbreviation.toLowerCase(), counties: state.counties }));

export const getCounties = (state?: string | null) => {
  if (!state) {
    return [];
  }
  const counties = getAllStates().find(({ value }) => value === state)?.counties || [];
  const formattedCounties = counties.map((el) => ({ label: el, value: el.split(" ")[0].toLowerCase() }));
  return formattedCounties;
};

export const getStateValue = (state: string | null) => {
  if (!state) {
    return null;
  }
  return getAllStates().find((el) => el.value === state) || null;
};

export const getCountyValue = (county: string | null, state: string | null) => {
  if (!county || !state) {
    return null;
  }
  return getCounties(state).find(({ value }) => value === county) || null;
};

export const getCitiesByState = (state?: string) =>
  usaCities
    .filter((el) => el.state === getAllStates().find((x) => x.value === state)?.label)
    .map((city) => ({ label: city.name, value: city.name }));
