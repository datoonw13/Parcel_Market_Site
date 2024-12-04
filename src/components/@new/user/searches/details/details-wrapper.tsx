import { getAdditionalSearchDetails, getSearchDetails } from "@/server-actions/user-searches/actions";
import { getUserAction } from "@/server-actions/user/actions";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import SearchItemDetails from "./details";

const SearchDetailsWrapper = async ({ id }: { id: number }) => {
  const { data } = await getSearchDetails(id);
  const { data: additionalDataResult } = await getAdditionalSearchDetails(id);

  const user = await getUserAction();
  const userSubscription = await getUserSubscriptions();
  const isUserSubscriptionTrial = !!userSubscription.data?.find((el) => el.status === "trialing");

  return (
    data &&
    additionalDataResult && (
      <SearchItemDetails
        data={data}
        user={user}
        isUserSubscriptionTrial={isUserSubscriptionTrial}
        additionalDataResult={additionalDataResult}
      />
    )
  );
};

export default SearchDetailsWrapper;
