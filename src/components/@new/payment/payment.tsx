import { getUserPaymentMethods, getUserSubscriptions } from "@/server-actions/subscription/actions";
import { getUserAction } from "@/server-actions/user/actions";
import PaymentMethods from "./payment-methods";
import OrderDetails from "./order-details";

const Payment = async () => {
  const user = await getUserAction();
  const userPaymentMethods = await getUserPaymentMethods();
  const userSubscription = await getUserSubscriptions();

  return (
    <div className="space-y-6 md:space-y-8 max-w-fit lg:max-w-4xl w-full mx-auto">
      <div className="space-y-3">
        <h1 className="text-center font-semibold text-2xl md:text-3xl lg:text-4xl">How would you like to pay?</h1>
        <h2 className="text-center text-sm md:text-base text-grey-800">Choose Payment method</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] lg:gap-8 gap-6 w-full">
        <PaymentMethods userSubscriptions={userSubscription.data} userPaymentMethods={userPaymentMethods.data} />
        <OrderDetails user={user} />
      </div>
    </div>
  );
};

export default Payment;
