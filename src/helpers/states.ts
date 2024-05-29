import { usaStatesFull } from "typed-usa-states";

export const getAllStates = () =>
  usaStatesFull
    .filter((el) => el.contiguous)
    .map((state) => ({ label: state.name, value: state.abbreviation.toLowerCase(), counties: state.counties }));

export const getCounties = (state: string | null) => {
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
