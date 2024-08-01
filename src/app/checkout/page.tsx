import Payment from "@/components/@new/payment/payment";
import MiniLayout from "@/components/@new/shared/mini-layout";
import routes from "@/helpers/routes";
import { SubscriptionType } from "@/types/subscriptions";
import { redirect } from "next/navigation";

const CheckoutPage = ({ searchParams }: { searchParams: { plan: SubscriptionType } }) => {
  if (!searchParams.plan || !SubscriptionType[searchParams.plan]) {
    redirect(routes.home.fullUrl);
  }

  return (
    <MiniLayout rootClasses="min-h-screen">
      <Payment />
    </MiniLayout>
  );
};

export default CheckoutPage;
