import data from "../../public/files/states_counties.json";

export const statesBlackList: string[] = [
  // "Louisiana",
  // "Montana",
  // "Texas",
  // "Idaho",
  // "Mississippi",
  // "New Mexico",
  // "Utah",
  // "Kansas",
  // "Missouri",
  // "North Dakota",
  // "Wyoming",
];

export const states = Object.keys(data)
  .map((el) => ({ value: el, label: data[el as keyof typeof data][0].stateName }))
  .sort((a, b) => a.label.localeCompare(b.label));
export const counties = Object.values(data).flat();
export const getCountiesByState = (stateId: string) =>
  stateId ? data?.[stateId as keyof typeof data].map((el) => ({ value: el.county, label: el.county })) || null : null;

export const getState = (stateId: string) =>
  states.find((el) => el.value === stateId) ||
  states.find((el) => el.label.toLocaleLowerCase().includes(stateId?.toLocaleLowerCase())) ||
  null;

export const getCounty = (stateId: string, county: string) => {
  const state = getState(stateId);
  const countyId = county?.toLocaleLowerCase()?.replace("county", "").trim();

  const res =
    data?.[state?.value as keyof typeof data]?.find(
      (x) => x.county?.toLocaleLowerCase() === countyId || x.county?.toLocaleLowerCase()?.replaceAll(" ", "-") === countyId
    ) || null;

  // eslint-disable-next-line no-nested-ternary
  return !res
    ? null
    : {
        short: { value: res.county, label: res.county },
        full: res,
      };
};
