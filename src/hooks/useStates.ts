"use client";

import { counties, getCountiesByState, getCounty, getState, states, statesBlackList } from "@/helpers/states";

const useStates = ({ hideBlackListedStated }: { hideBlackListedStated?: boolean }) => ({
  states: hideBlackListedStated ? states.filter((el) => !statesBlackList.includes(el.label)) : states,
  counties,
  getState,
  getCounty,
  getCountiesByState,
});

export default useStates;
