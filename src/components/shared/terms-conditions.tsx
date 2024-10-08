"use client";

import React, { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import ResponsiveModal from "../ui/dialogs/responsive-dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { DialogFooter } from "../ui/dialogs/dialog";
import { Button } from "../ui/button";

const TermsConditions = ({
  modal,
  closeModal,
  onOk,
  showAgree,
}: {
  modal: boolean;
  closeModal: () => void;
  onOk?: () => void;
  showAgree: boolean;
}) => {
  const [agree, setAgree] = useState(false);

  return (
    <div className="space-y-8 w-full overflow-hidden flex flex-col">
      <ScrollArea className={modal ? "max-h-[75dvh] md:max-h-[60dvh]" : ""}>
        <div className="space-y-8">
          <div className="space-y-3">
            {!modal && <h1 className="font-extrabold text-3xl md:text-4xl xl:text-5xl">Terms of Use</h1>}
            <h3 className={cn("text-grey-800 text-sm", !modal && "md:text-base")}>Last Modified: July 21, 2024</h3>
          </div>
          <div className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Acceptance of the Terms of Use</h1>
            <p className={cn("text-grey-800 text-sm", !modal && "md:text-base")}>
              These Terms of Use govern your use of our Website, parcelmarket.com, including any content, features, and services offered
              thereon, whether as a guest or as a registered user. Please read the Terms of Use carefully before you use our Website and its
              services. By using the Website, you accept and agree to be bound and abide by these Terms of Use and our posted Privacy
              Policy, which is incorporated herein. If you do not want to agree to these Terms of Use, or the Privacy Policy, you must not
              access or use the Website.
            </p>
          </div>
          <div className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Your use of the Company Website</h1>
            <ul className={cn("text-grey-800 text-sm list-disc [&>li]:ml-6", !modal && "md:text-base")}>
              <li>
                The Company, Parcel Market LLC, is not, and shall not be deemed to be, a licensed real estate agent or broker, and the
                Company is not providing any licensed broker services in connection with the Website. The services provided on our Website
                include, market data, property listings, chatrooms, and property value estimates based on comparable sales data. The Company
                is not a party to any transactions ultimately executed by users of the Website. Sales transactions are governed by the
                transactional documents executed by the parties.
              </li>
              <li>
                By agreeing to the Terms of Use, you acknowledge:
                <ol type="a" className="[&>li]:ml-8" style={{ listStyleType: "lower-alpha" }}>
                  <li>The Company is not a party to, and shall have no liability for, any user sales transactions. </li>
                  <li>
                    The Company has no liability for any content information submitted to, or posted on, the Website by third parties.
                  </li>
                  <li>
                    The Company does not verify the completeness, accuracy, or legitimacy of any information submitted to, or posted on, the
                    Website by third parties.
                  </li>
                  <li>
                    The Company is not a real estate agent, broker, or professional appraiser, and any property value estimate provided
                    through the Website is not a professional appraisal and shall not be utilized as such.
                  </li>
                  <li>
                    The Company does not verify the completeness or accuracy of any content provided by sellers, lessors, brokers, lenders,
                    or other third parties, and does not verify the accuracy of the estimates provided by the Website.
                  </li>
                  <li>
                    Website users are solely responsible for conducting their own due diligence evaluation of all properties listed on the
                    Website.
                  </li>
                  <li>
                    Website users should obtain a professional appraisal prior to making any financial decision concerning real property,
                    and users accept the risk of failing to secure a professional appraisal prior to entering into a real estate transaction
                    or making any financial decision concerning a piece of property.
                  </li>
                  <li>
                    Website users agree that, if a dispute arises between parties to a sales transaction, or any other dispute concerning a
                    property listed on our Website or an estimate received therefrom, any such disputes shall be solely between the parties
                    or users. The Company is expressly released from any liability related to any such disputes, and the Website users shall
                    indemnify the Company for any claims made against it arising out of any such disputes.
                  </li>
                </ol>
              </li>
              <li>Changes to the Terms of Use</li>
              <li>
                The Company may revise its Terms of Use from time to time. Any such changes are effective immediately upon posting and apply
                to all access to and use of the Website thereafter. Your continued use of the Website following the posting of revised Terms
                of Use shall be deemed as acceptance of the changes. You are expected to check this
              </li>
            </ul>
          </div>
        </div>
      </ScrollArea>
      {showAgree && (
        <Checkbox
          className="px-5"
          onCheckedChange={(checked) => setAgree(!!checked)}
          id="terms"
          label={
            <p className="space-x-1 text-gray-600 text-xs font-medium">
              Yes, I understand and agree to the Parcel Market Terms of Service and Privacy Policy.
            </p>
          }
        />
      )}
      {showAgree && (
        <DialogFooter className="pb-2 gap-3">
          <Button type="submit" variant="secondary" onClick={closeModal}>
            Decline
          </Button>
          <Button
            type="submit"
            disabled={!agree}
            onClick={() => {
              setAgree(false);
              onOk && onOk();
            }}
          >
            Accept
          </Button>
        </DialogFooter>
      )}
    </div>
  );
};

export default TermsConditions;

export const TermsConditionsDialog = ({
  open,
  closeModal,
  children,
  showAgree,
  onOk,
}: {
  open: boolean;
  closeModal: () => void;
  onOk?: () => void;
  children?: ReactNode;
  showAgree?: boolean;
}) => (
  <ResponsiveModal
    drawerContentClassName="pb-6"
    dialogContentClassName="max-w-[70vw]"
    modalTitle="Terms of Use"
    open={open}
    closeModal={() => {
      closeModal();
    }}
  >
    <TermsConditions showAgree={!!showAgree} modal closeModal={closeModal} onOk={onOk} />
    {children}
  </ResponsiveModal>
);
