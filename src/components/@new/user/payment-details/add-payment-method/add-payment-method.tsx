"use client";

import { useState } from "react";
import PaymentDetailsItem from "../payment-details-item";
import AddPaymentModal from "./add-payment-modal";

const AddPaymentMethod = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <AddPaymentModal open={openModal} closeModal={() => setOpenModal(false)} />
      <PaymentDetailsItem
        title="Add New Payment Method"
        description="Add New Card"
        buttonLabel="Add Payment Method"
        onClick={() => setOpenModal(true)}
      />
    </>
  );
};

export default AddPaymentMethod;
