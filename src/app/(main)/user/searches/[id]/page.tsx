import SearchItemDetailsMobileMapFull from "@/components/@new/user/searches/details/mobile-full";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import { getAdditionalSearchDetails, getSearchDetails } from "@/server-actions/user-searches/actions";
import { getUserAction } from "@/server-actions/user/actions";

const SearchDetailsPage = async ({ params }: any) => {
  const { data } = await getSearchDetails(params.id);
  const { data: additionalDataResult } = await getAdditionalSearchDetails(params.id);
  const user = await getUserAction();
  const userSubscription = await getUserSubscriptions();
  const isUserSubscriptionTrial = !!userSubscription.data?.find((el) => el.status === "trialing");

  return (
    data &&
    additionalDataResult && (
      <SearchItemDetailsMobileMapFull
        additionalDataResult={additionalDataResult}
        data={data}
        user={user}
        isUserSubscriptionTrial={isUserSubscriptionTrial}
      />
    )
  );
};

export default SearchDetailsPage;
