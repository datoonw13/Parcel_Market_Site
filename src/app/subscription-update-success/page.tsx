import routes from "@/helpers/routes";
import MiniLayout from "@/components/@new/shared/mini-layout";
import Container from "@/components/@new/shared/Container";
import SubscriptionSuccess from "./success";

const SubscriptionUpdatePage = ({ searchParams }: { searchParams: any }) => (
  <MiniLayout rootClasses="min-h-screen">
    <Container maxWidth="max-w-full">
      <div className="bg-white rounded-2xl max-w-[736px] w-full h-full mx-auto my-auto">
        <SubscriptionSuccess redirectUrl={searchParams.redirectUrl || routes.user.subscription.fullUrl} />
      </div>
    </Container>
  </MiniLayout>
);

export default SubscriptionUpdatePage;
