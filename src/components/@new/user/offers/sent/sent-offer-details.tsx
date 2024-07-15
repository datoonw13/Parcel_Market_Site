import { ArrowIconLeft1 } from "@/components/@new/icons/ArrowIcons";
import Container from "@/components/@new/shared/Container";
import Button from "@/components/@new/shared/forms/Button";
import routes from "@/helpers/routes";
import { OfferModel } from "@/types/offer";
import Link from "next/link";
import OfferDetailsWrapper from "./offer-details-wrapper";

const SentOfferDetails = ({ data }: { data: OfferModel }) => (
  <Container className="py-6 px-5 pb-20">
    <div>
      <Link href={routes.user.offers.sent.fullUrl}>
        <Button variant="secondary" className="!p-0 !h-fit !outline-none">
          <div className="flex items-center gap-2 text-primary-main">
            <ArrowIconLeft1 className="!w-1.5 !h-3" color="primary-main" /> Back
          </div>
        </Button>
      </Link>
      <p className="text-lg font-semibold my-6">Make an offer</p>
    </div>
    <div className="font-semibold border border-grey-100 rounded-2xl p-6">
      <OfferDetailsWrapper data={data} actionClassName="mt-10 py-4 flex-col-reverse [&>button]:ml-0 [&>a]:w-full [&>a>button]:w-full" />
    </div>
  </Container>
);

export default SentOfferDetails;
