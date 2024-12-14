"use client";

import { useCallback, useMemo } from "react";
import data from "../../public/files/states_counties.json";

const statesBlackList = [
  "Louisiana",
  "Montana",
  // "Texas",
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

const useStates = () => {
  const allStates = useMemo(() => {
    const result = Object.keys(data)
      .map((el) => ({ value: el, label: data[el as keyof typeof data][0].stateName }))
      .sort((a, b) => a.label.localeCompare(b.label));
    return result;
  }, []);

  const states = useMemo((showAll?: boolean) => {
    let result = Object.keys(data)
      .map((el) => ({ value: el, label: data[el as keyof typeof data][0].stateName }))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (!showAll) {
      result = result.filter((el) => !statesBlackList.includes(el.label));
    }
    return result;
  }, []);

  const counties = useMemo(() => Object.values(data).flat(), []);
  const getCountiesByState = useCallback(
    (stateId: string) =>
      stateId ? data?.[stateId as keyof typeof data].map((el) => ({ value: el.county, label: el.county })) || null : null,
    []
  );
  const getState = useCallback((stateId: string) => states.find((el) => el.value === stateId) || null, [states]);
  const getCounty = useCallback((stateId: string, county: string) => {
    const res = data?.[stateId as keyof typeof data]?.find((x) => x.county.toLocaleLowerCase() === county.toLocaleLowerCase()) || null;
    // eslint-disable-next-line no-nested-ternary
    return !res
      ? null
      : {
          short: { value: res.county, label: res.county },
          full: res,
        };
  }, []);

  return {
    allStates,
    states,
    counties,
    getState,
    getCounty,
    getCountiesByState,
  };
};

export default useStates;
