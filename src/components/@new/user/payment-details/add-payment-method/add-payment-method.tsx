"use client";

import PaymentDetailsItem from "../payment-details-item";
import AddPaymentModal from "./add-payment-modal";

const AddPaymentMethod = () => (
  <>
    <AddPaymentModal open={false} closeModal={() => {}} />
    <PaymentDetailsItem title="Add New Payment Method" description="Add New Card" buttonLabel="Add Payment Method" onClick={() => {}} />
  </>
);

export default AddPaymentMethod;
