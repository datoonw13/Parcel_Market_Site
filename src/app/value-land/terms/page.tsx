"use client";

import { ArrowIconLeft1 } from "@/components/@new/icons/ArrowIcons";
import Container from "@/components/@new/shared/Container";
import Button from "@/components/@new/shared/forms/Button";
import ValueLendTerms from "@/components/@new/value-land/terms/terms";
import routes from "@/helpers/routes";
import { useRouter } from "next/navigation";

const ValueLendTermsPage = () => {
  const router = useRouter();
  return (
    <Container className="py-6 px-5 pb-20">
      <div>
        <Button variant="secondary" className="!p-0 !h-fit !outline-none" onClick={() => router.push(routes.valueLand.about.fullUrl)}>
          <div className="flex items-center gap-2 text-primary-main">
            <ArrowIconLeft1 className="!w-1.5 !h-3" color="primary-main" /> Back
          </div>
        </Button>
        <p className="text-lg font-semibold my-6">Information before we calculate</p>
      </div>
      <ValueLendTerms closeRootModal={() => {}} />
    </Container>
  );
};

export default ValueLendTermsPage;
