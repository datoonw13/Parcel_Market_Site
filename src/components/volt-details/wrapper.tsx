import React, { FC, ReactNode } from "react";

interface IVoltDetailsWrapper {
  children: ReactNode;
}
const VoltDetailsWrapper: FC<IVoltDetailsWrapper> = ({ children }) => <div>VoltDetailsWrapper</div>;

export default VoltDetailsWrapper;
