import { getUserPaymentMethods } from "@/server-actions/subscription/actions";
import React from "react";
import PaymentMethods from "./payment-method";

const PaymentMethodsWrapper = async () => {
  const { data } = await getUserPaymentMethods();

  return data && <PaymentMethods initialData={data.map((el) => ({ ...el, deleted: false }))} />;
};

export default PaymentMethodsWrapper;