"use client";

import BillingHistory from "./billing-history/billing-history";

const PaymentDetails = () => (
  <div className="space-y-8 md:space-y-6 !mt-20">
    <h1 className="font-semibold text-2xl xs:mb-3 md:mb-4">Payment Details</h1>
    <div className="grid gap-3 sm:border border-grey-100 rounded-2xl sm:p-4 md:p-8">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">My Payment Methods</p>
          {/* <p className="font-medium text-xs text-grey-600">Set a permanent password to login to your account</p> */}
        </div>
        <button type="button" className="font-medium text-xs text-primary-main" onClick={() => {}}>
          Edit
        </button>
      </div>
      <hr className="border-grey-100" />
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">Add New Payment Method</p>
          <p className="font-medium text-xs text-grey-600">Add New Card or paypal </p>
        </div>
        <button type="button" className="font-medium text-xs text-primary-main" onClick={() => {}}>
          Add Payment Method
        </button>
      </div>
      <hr className="border-grey-100" />
      <BillingHistory />
    </div>
  </div>
);

export default PaymentDetails;
