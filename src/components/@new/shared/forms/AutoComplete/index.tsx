import React from "react";
import { TextField } from "@mui/material";
import Popper from "../../Popper";

const index = () => (
  <Popper anchorPlacement="bottom end" renderButton={<TextField />}>
    <div className="shadow-lg p-4 bg-primary-main-600 rounded-lg">Popper Content</div>
  </Popper>
);

export default index;
