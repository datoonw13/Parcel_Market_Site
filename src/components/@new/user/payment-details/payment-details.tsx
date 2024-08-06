import AddPaymentMethod from "./add-payment-method/add-payment-method";
import BillingHistory from "./billing-history/billing-history";
import PaymentMethodsWrapper from "./payment-method/ payment-methods-wrapper";

const PaymentDetails = () => (
  <div className="space-y-8 md:space-y-6 !mt-20">
    <h1 className="font-semibold text-2xl xs:mb-3 md:mb-4">Payment Details</h1>
    <div className="grid gap-3 sm:border border-grey-100 rounded-2xl sm:p-4 md:p-8">
      <PaymentMethodsWrapper />
      <hr className="border-grey-100" />
      <AddPaymentMethod />
      <hr className="border-grey-100" />
      <BillingHistory />
    </div>
  </div>
);

export default PaymentDetails;
