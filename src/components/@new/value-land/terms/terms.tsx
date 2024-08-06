"use clint";

import SimpleBar from "simplebar-react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import routes from "@/helpers/routes";
import { useState } from "react";
import { useAtom } from "jotai";
import { valueLandAtom } from "@/atoms/value-land-atom";
import { sellLendAction } from "@/server-actions/value-land/actions";
import { ISellProperty } from "@/types/find-property";
import DialogActions from "../../shared/modals/dialog/dialog-actions";
import CheckBox from "../../shared/forms/CheckBox";
import ResponsiveWarningModal from "../../shared/modals/ResponsiveWarningModal";

const ValueLendTerms = ({ closeRootModal }: { closeRootModal: () => void }) => {
  const [valueLandData, setValueLandData] = useAtom(valueLandAtom);
  const [agreed, setAgreed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [openModal, setOpenModal] = useState<"error" | "success" | null>(null);
  const [landId, setLendId] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!valueLandData.selectedLand || !valueLandData.calculatedPrice || !valueLandData.aboutLand || !valueLandData.sellerType) {
      return;
    }
    const reqData: ISellProperty = {
      ...valueLandData.aboutLand,
      accepted: true,
      propertyType:
        valueLandData.selectedLand.properties.fields.zoning_description || valueLandData.selectedLand.properties.fields.usedesc || "",
      acrage: valueLandData.selectedLand.properties.fields.ll_gisacre,
      coordinates: JSON.stringify(valueLandData.selectedLand.geometry.coordinates),
      state: valueLandData.selectedLand.properties.fields.state2.toLocaleLowerCase(),
      county: valueLandData.selectedLand.properties.fields.county,
      lat: valueLandData.selectedLand.properties.fields.lat,
      lon: valueLandData.selectedLand.properties.fields.lon,
      owner: valueLandData.selectedLand.properties.fields.owner,
      parcelNumber: valueLandData.selectedLand.properties.fields.parcelnumb_no_formatting,
      propertyId: valueLandData.calculatedPrice.id,
      sellerType: valueLandData.sellerType,
      salePrice: valueLandData.calculatedPrice.price,
      city: valueLandData.selectedLand.properties.fields.city,
    };
    setPending(true);
    const { errorMessage, data } = await sellLendAction(reqData);
    setPending(false);
    if (errorMessage) {
      setError(errorMessage === "Posting already exists" ? "Posting already exists" : "Something went wrong");
      setOpenModal("error");
    } else {
      setOpenModal("success");
      setLendId(data);
    }
  };

  const closeModal = () => {
    if (openModal === "success") {
      router.push(routes.user.listings.fullUrl);
    } else {
      setOpenModal(null);
      if (error === "Posting already exists") {
        router.push(routes.marketplace.fullUrl);
      }
    }
  };

  const onOK = () => {
    if (openModal === "success") {
      router.push(`${routes.marketplace.fullUrl}/${landId}`);
    } else {
      handleSubmit();
    }
  };

  return (
    <>
      <ResponsiveWarningModal
        variant={openModal === "success" ? "success" : "error"}
        title={openModal === "success" ? "Land added" : error}
        description={openModal === "success" ? "Congratulations! Your Listing has posted to Parcel Marketplace." : "Please try again"}
        open={!!openModal}
        closeModal={closeModal}
        onCancel={closeModal}
        cancelLabel="Close"
        onOK={onOK}
        okPending={pending}
        disableOK={error === "Posting already exists"}
        okLabel={openModal === "success" ? "View Land" : "Try Again"}
      />
      <div className="flex flex-col justify-between h-full overflow-hidden">
        <div
          className={clsx(
            "mt-6 mb-8 border border-grey-100 rounded-2xl h-full overflow-hidden",
            pathname !== routes.valueLand.terms.fullUrl && "mx-8 "
          )}
        >
          <SimpleBar className="h-full">
            <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 space-y-6">
              <p className="text-sm font-bold">Terms and Conditions of Land Marketplace</p>
              <p className="text-sm text-grey-800">
                These terms and conditions (&quot;Terms&quot;) govern your use of the Land Marketplace (&quot;the Marketplace&quot;)
                provided by [Company Name]. By accessing or using the Marketplace, you agree to be bound by these Terms. If you do not agree
                to these Terms, you may not use the Marketplace.
              </p>
              {terms.map((term, termI) => (
                <div key={term.title} className="space-y-1">
                  <p className="text-sm font-bold">
                    {termI + 1}. {term.title}
                  </p>
                  {term.options.map((opt, optI) => (
                    <p className="text-sm text-grey-800" key={opt}>
                      {`${termI + 1}.${optI + 1}.`} {opt}
                    </p>
                  ))}
                </div>
              ))}
              <CheckBox
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                label={
                  <p className="space-x-1">
                    Yes, I understand and agree to the Parcel Market <span className="text-primary-main underline">Terms of Service</span>{" "}
                    and
                    <span className="text-primary-main underline">Privacy Policy</span>.
                  </p>
                }
              />
            </div>
          </SimpleBar>
        </div>
        <DialogActions disableSubmit={!agreed} onClose={closeRootModal} onSubmit={handleSubmit} submitPending={pending} />
      </div>
    </>
  );
};

export default ValueLendTerms;

const terms = [
  {
    title: "Use of the Marketplace",
    options: [
      "You must be at least 18 years old to use the Marketplace.",
      "You agree to use the Marketplace only for lawful purposes and in accordance with these Terms and all applicable laws and regulations.",
    ],
  },
  {
    title: "Listings",
    options: [
      "All listings on the Marketplace are subject to review and approval by [Company Name].",
      "You are responsible for the accuracy of all information provided in your listings. ",
      "[Company Name] reserves the right to reject or remove any listing that violates these Terms or is otherwise deemed inappropriate.",
    ],
  },
  {
    title: "Transactions",
    options: [
      "All transactions conducted through the Marketplace are solely between the buyer and seller. ",
      "[Company Name] is not responsible for any disputes between buyers and sellers or for the quality or legality of any properties listed on the Marketplace.",
      "Buyers are responsible for conducting their own due diligence before purchasing any property.",
    ],
  },
  {
    title: "Fees",
    options: [
      "[Company Name] may charge fees for certain services provided through the Marketplace. Any applicable fees will be clearly stated before you complete a transaction. ",
      "You agree to pay all fees associated with your use of the Marketplace.",
    ],
  },
  {
    title: "Intellectual Property",
    options: [
      "All content on the Marketplace, including but not limited to text, graphics, logos, and images, is the property of [Company Name] and is protected by copyright and other intellectual property laws. ",
      "You may not use, reproduce, or distribute any content from the Marketplace without the prior written consent of [Company Name].",
    ],
  },
];
