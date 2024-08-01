import PaymentMethods from "./payment-methods";
import OrderDetails from "./order-details";

const Payment = () => (
  <div className="space-y-6 md:space-y-8 max-w-3xl w-full mx-auto">
    <div className="space-y-3">
      <h1 className="text-center font-semibold text-2xl md:text-3xl lg:text-4xl">How would you like to pay?</h1>
      <h2 className="text-center text-sm md:text-base text-grey-800">Choose Payment method</h2>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] lg:gap-8 gap-6 w-full">
      <PaymentMethods />
      <OrderDetails />
    </div>
  </div>
);

export default Payment;
