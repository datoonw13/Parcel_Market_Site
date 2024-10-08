import { ArrowIconLeft1 } from "@/components/@new/icons/ArrowIcons";
import Container from "@/components/@new/shared/Container";
import Button from "@/components/@new/shared/forms/Button";
import SentOfferDetails from "@/components/@new/user/offers/sent/sent-offer-details";
import routes from "@/helpers/routes";
import { getOfferAction } from "@/server-actions/offer/actions";
import Link from "next/link";
import { redirect } from "next/navigation";

const SentOfferDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { data } = await getOfferAction(params.id);

  if (!data) {
    redirect(routes.user.offers.sent.fullUrl);
  }

  return (
    <Container className="py-6 px-5 pb-20">
      <div>
        <Link href={routes.user.offers.sent.fullUrl}>
          <Button variant="secondary" className="!p-0 !h-fit !outline-none">
            <div className="flex items-center gap-2 text-primary-main">
              <ArrowIconLeft1 className="!w-1.5 !h-3" color="primary-main" /> Back
            </div>
          </Button>
        </Link>
        <p className="text-lg font-semibold my-6">Offer Details</p>
      </div>
      <div className="font-semibold border border-grey-100 rounded-2xl p-6">
        <SentOfferDetails data={data} actionClassName="mt-10 py-4 flex-col-reverse [&>button]:ml-0 [&>a]:w-full [&>a>button]:w-full" />
      </div>
    </Container>
  );
};

export default SentOfferDetailsPage;
