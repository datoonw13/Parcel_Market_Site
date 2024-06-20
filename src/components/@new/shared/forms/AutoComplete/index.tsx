"use client";

import React, { useContext } from "react";
import Popper from "../../Popper";
import TextField from "../TextField";
import AutoCompleteListBox from "./AutoCompleteListBox";
import AutoCompleteListItem from "./AutoCompleteListItem";

const AutoComplete = () => (
  <Popper
    contentClassName="shadow-1 rounded-xl"
    anchorPlacement="bottom end"
    anchorGap={5}
    renderButton={<TextField label="State" />}
    renderContent={(closePopper) => (
      <>
        <AutoCompleteListBox>
          <AutoCompleteListItem onClick={closePopper}>aee</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
          <AutoCompleteListItem onClick={closePopper}>qwqd</AutoCompleteListItem>
        </AutoCompleteListBox>
      </>
    )}
  />
);

export default AutoComplete;
