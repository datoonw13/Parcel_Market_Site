"use client";

import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";
import { InView } from "react-intersection-observer";
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
  setSelected,
}: {
  modal: boolean;
  closeModal?: () => void;
  onOk?: () => void;
  showAgree?: boolean;
  setSelected?: Dispatch<SetStateAction<number>>;
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
          <div id="1" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Acceptance of the Terms of Use</h1>
            <InView
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(1);
                }
              }}
            >
              <p className={cn("text-grey-800 text-sm", !modal && "md:text-base")}>
                These Terms of Use govern your use of our Website, parcelmarket.com, including any content, features, and services offered
                thereon, whether as a guest or as a registered user. Please read the Terms of Use carefully before you use our Website and
                its services. By using the Website, you accept and agree to be bound and abide by these Terms of Use and our posted Privacy
                Policy, which is incorporated herein. If you do not want to agree to these Terms of Use, or the Privacy Policy, you must not
                access or use the Website.
              </p>
            </InView>
          </div>
          <div id="2" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Your use of the Company Website</h1>
            <InView
              threshold={1}
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(2);
                }
              }}
            >
              <ul className={cn("text-grey-800 text-sm list-disc [&>li]:ml-6", !modal && "md:text-base")}>
                <li>
                  The Company, Parcel Market LLC, is not, and shall not be deemed to be, a licensed real estate agent or broker, and the
                  Company is{" "}
                  <span className="font-semibold">
                    <span className="underline">not</span> providing any licensed broker services
                  </span>{" "}
                  in connection with the Website. The services provided on our Website include, market data, property listings, chatrooms,
                  and property value estimates based on comparable sales data. The Company is not a party to any transactions ultimately
                  executed by users of the Website. Sales transactions are governed by the transactional documents executed by the parties.
                </li>
                <li>
                  By agreeing to the Terms of Use, you acknowledge:
                  <ol type="a" className="[&>li]:ml-8" style={{ listStyleType: "lower-alpha" }}>
                    <li>The Company is not a party to, and shall have no liability for, any user sales transactions.</li>
                    <li>
                      The Company has no liability for any content information submitted to, or posted on, the Website by third parties.
                    </li>
                    <li>
                      The Company does not verify the completeness, accuracy, or legitimacy of any information submitted to, or posted on,
                      the Website by third parties.
                    </li>
                    <li>
                      The Company is not a real estate agent, broker, or professional appraiser, and any property value estimate provided
                      through the Website is <span className="font-semibold underline">not</span> a professional appraisal and shall not be
                      utilized as such.
                    </li>
                    <li>
                      The Company does not verify the completeness or accuracy of any content provided by sellers, lessors, brokers,
                      lenders, or other third parties, and does not verify the accuracy of the estimates provided by the Website.
                    </li>
                    <li>
                      Website users are solely responsible for conducting their own due diligence evaluation of all properties listed on the
                      Website.
                    </li>
                    <li>
                      Website users should obtain a professional appraisal prior to making any financial decision concerning real property,
                      and users accept the risk of failing to secure a professional appraisal prior to entering into a real estate
                      transaction or making any financial decision concerning a piece of property.
                    </li>
                    <li>
                      Website users agree that, if a dispute arises between parties to a sales transaction, or any other dispute concerning
                      a property listed on our Website or an estimate received therefrom, any such disputes shall be solely between the
                      parties or users. The Company is expressly released from any liability related to any such disputes, and the Website
                      users shall indemnify the Company for any claims made against it arising out of any such disputes.
                    </li>
                  </ol>
                </li>
              </ul>
            </InView>
          </div>
          <div id="3" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Changes to the Terms of Use</h1>
            <InView
              threshold={1}
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(3);
                }
              }}
            >
              <p className={cn("text-grey-800 text-sm", !modal && "md:text-base")}>
                The Company may revise its Terms of Use from time to time. Any such changes are effective immediately upon posting and apply
                to all access to and use of the Website thereafter. Your continued use of the Website following the posting of revised Terms
                of Use shall be deemed as acceptance of the changes. You are expected to check this page so you are aware of any changes, as
                they are binding on you.
              </p>
            </InView>
          </div>

          <div id="4" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Accessing the Website and Account Security</h1>
            <InView
              threshold={1}
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(4);
                }
              }}
            >
              <p className={cn("text-grey-800 text-sm space-y-3", !modal && "md:text-base")}>
                <span>
                  The Company reserves the right to delete this Website and cease its services. From time to time, we may restrict user
                  access, including registered users, to some parts of the Website or the entire Website. To access the Website, or some of
                  the resources it offers, you may be asked to provide certain registration details or other information. It is a condition
                  of your use of the Website that all the information you provide on the Website is correct, current, and complete. You
                  agree that all information you provide to our Website is governed by our posted Privacy Policy, and you consent to all
                  actions we take with respect to your information consistent with our Privacy Policy.
                </span>
                <span>
                  If you choose, or are provided with, a username, password, or any other piece of information as part of our security
                  procedures, you must treat such information as confidential, and you must not disclose it to any other person or entity.
                  You also acknowledge that your account is personal to you and agree not to share your username and password with anyone
                  else. You agree to notify us immediately of any unauthorized access to or use of your username or password or any other
                  breach of security. You also agree to ensure that you exit from your account at the end of each session. You should use
                  particular caution when accessing your account from a public or shared computer, or on a public network, so that others
                  are not able to view or record your password or other personal information. We have the right to disable any username,
                  password, or other identifier, at any time, in our sole discretion, if, in our opinion, you have violated any provision of
                  these Terms of Use or the Privacy Policy.
                </span>
              </p>
            </InView>
          </div>

          <div id="5" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Intellectual Property & Trademark Rights</h1>
            <InView
              threshold={1}
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(5);
                }
              }}
            >
              <p className={cn("text-grey-800 text-sm space-y-3", !modal && "md:text-base")}>
                <span>
                  The Website and its entire contents, features, and functionality (including but not limited to all information, software,
                  text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by the Company,
                  its licensors, or other providers of such material and are protected by proprietary rights laws.
                </span>
                <span>
                  These Terms of Use permit you to use the Website for your personal, non-commercial use only. You must not reproduce,
                  distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or
                  transmit any of the material on our Website, except as follows: (1) Your computer may temporarily store copies of such
                  materials in RAM incidental to your accessing and viewing those materials; (2) You may store files that are automatically
                  cached by your Web browser for display enhancement purposes, (3) You may print or download one copy of a reasonable number
                  of pages of the Website for your own personal, non-commercial use and not for further reproduction, publication, or
                  distribution; and (4) If we provide desktop, mobile, or other applications for download, you may download a single copy to
                  your computer or mobile device solely for your own personal use, provided you agree to be bound by our end user license
                  agreement for such applications. You must not: (1) Modify copies of any materials from this site; (2) Use any
                  illustrations, photographs, video or audio sequences, or any graphics separately from the accompanying text or (3) Delete
                  or alter any copyright, trademark, or other proprietary rights notices from copies of materials from this site. If you
                  print, copy, modify, download, or otherwise use or provide any other person with access to any part of the Website in
                  breach of the Terms of Use, your right to use the Website will stop immediately and you must, at our option, return or
                  destroy any copies of the materials you have made. No right, title, or interest in or to the Website or any content on the
                  Website is transferred to you, and all rights not expressly granted are reserved by the Company. Any use of the Website
                  not expressly permitted by these Terms of Use is a breach of these Terms of Use and may violate copyright, trademark, and
                  other laws.
                </span>
                <span>
                  The Company name, the Company logo, and all related names, logos, product and service names, designs, and slogans are
                  trademarks of the Company or its affiliates or licensors. You must not use such marks without the prior written permission
                  of the Company. All other names, logos, product and service names, designs, and slogans on this Website are the trademarks
                  of their respective owners.
                </span>
              </p>
            </InView>
          </div>

          <div id="6" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Prohibited Uses</h1>
            <InView
              threshold={1}
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(6);
                }
              }}
            >
              <p className={cn("text-grey-800 text-sm", !modal && "md:text-base")}>
                You may use the Website only for lawful purposes and in accordance with these Terms of Use. You agree not to use the Website
                in any way that violates any applicable federal, state, local, or international law. You agree not to post offensive or
                inappropriate content of any kind on the Website, and you agreed not to use the Website in any manner that could disable,
                overburden, damage, or impair the site. You agree not to use any robot, spider, or other automatic device, process, or means
                to access the Website for any purpose, including monitoring or copying any of the material on the Website. You agree not to
                introduce any viruses, logic bombs, or other material that is malicious or technologically harmful to the Website.
              </p>
            </InView>
          </div>

          <div id="7" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>
              User Contributions Monitoring and Enforcement; Termination
            </h1>
            <InView
              threshold={1}
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(7);
                }
              }}
            >
              <p className={cn("text-grey-800 text-sm", !modal && "md:text-base")}>
                The Website may contain listing pages that allow users to post content or materials to the Website. All user contributions
                must comply with these Terms of Use. Any material that you post to the Website will be considered non-confidential and
                non-proprietary. By posting photographs, videos, information, or any other content to our Website, you grant the Company,
                and our affiliates, a perpetual and royalty-free license and right to use, reproduce, modify, display, distribute, and
                otherwise disclose to third parties any such material for any purpose. By posting to our Website, you represent and warrant
                that you own the sole rights to any content that you post. You acknowledge that you are responsible for any content that you
                post to the Website, and you, not the Company, have full responsibility for such content, including its legality,
                reliability, accuracy, and appropriateness of any such content. We have the right to remove user contributions for any or no
                reason in our sole discretion and to terminate or suspend your access to all or part of the Website for any violation of
                these Terms of Use. Without limiting the foregoing, we have the right to cooperate fully with any law enforcement
                authorities or court order requesting or directing us to disclose the identity or other information of anyone posting any
                materials on or through the Website. You agree to hold the Company harmless from any claims resulting from any action taking
                by any law enforcement authority, or any third-party, as a result of actions or inactions that you took while using our
                Website. The Company does not actively monitor the materials posted to our Website by users. The Company does not review
                material before it is posted and cannot ensure prompt removal of objectionable material. Accordingly, we assume no liability
                for any action or inaction regarding transmissions, communications, or content provided by any user or third party. If a
                user finds material posted to the Website offensive or objectionable, the user should notify the Company by sending an email
                to
                <span className="font-semibold underline">customerservice@parcelmarket.com</span>
              </p>
            </InView>
          </div>

          <div id="8" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Links from the Website</h1>
            <InView
              threshold={1}
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(8);
                }
              }}
            >
              <p className={cn("text-grey-800 text-sm", !modal && "md:text-base")}>
                If the Website contains links to other sites and resources provided by third parties, these links are provided for your
                convenience only. This includes links contained in advertisements, including banner advertisements and sponsored links. We
                have no control over the contents of those sites or resources and accept no responsibility for them or for any loss or
                damage that may arise from your use of them. If you decide to access any of the third-party websites linked to this Website,
                you do so entirely at your own risk and subject to the terms and conditions of use for such websites.
              </p>
            </InView>
          </div>

          <div id="9" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Geographic Restrictions</h1>
            <InView
              threshold={1}
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(9);
                }
              }}
            >
              <p className={cn("text-grey-800 text-sm", !modal && "md:text-base")}>
                The owner of the Website is based in the State of Georgia in the United States. We provide this Website for use only by
                persons located in the United States. We make no claims that the Website or any of its content is accessible or appropriate
                outside of the United States. Access to the Website may not be legal by certain persons or in certain countries. If you
                access the Website from outside the United States, you do so on your own initiative and are responsible for compliance with
                local laws.
              </p>
            </InView>
          </div>

          <div id="10" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Disclaimer of Warranties and Limited Liability </h1>
            <InView
              threshold={1}
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(10);
                }
              }}
            >
              <p className={cn("text-grey-800 text-sm space-y-3", !modal && "md:text-base")}>
                <span>
                  You understand that we cannot and do not guarantee or warrant that files available for downloading from the internet or
                  the Website will be free of viruses or other destructive code. You are responsible for implementing sufficient procedures
                  and checkpoints to satisfy your particular requirements for anti-virus protection and accuracy of data input and output,
                  and for maintaining a means external to our site for any reconstruction of any lost data. Your use of this Website, and
                  its content and services, is at your own risk. The Company makes no warranties, express or implied, regarding the
                  completeness, accuracy, security, reliability, quality, or availability of the information obtained through the Website.
                  To the contrary, the Company expressly disclaims all warranties of any kind.
                </span>
                <span>
                  In no event, shall the Company, or its affiliates or employees, be held liable for any damages, or under any legal theory,
                  arising out, or in connection with, your use of this Website. You agree to defend, indemnify, and hold harmless the
                  Company, its owners, affiliates and employees, from and against any claims, liabilities, damages, judgments, awards,
                  losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to your violation
                  of these Terms of Use or your use of the Website.
                </span>
              </p>
            </InView>
          </div>

          <div id="11" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Governing Law and Jurisdiction </h1>
            <InView
              threshold={1}
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(11);
                }
              }}
            >
              <p className={cn("text-grey-800 text-sm space-y-3", !modal && "md:text-base")}>
                All matters relating to the Website and these Terms of Use, and any dispute or claim arising therefrom, or related thereto,
                shall be governed by and construed in accordance with the internal laws of the State of Georgia, without giving effect to
                any choice or conflict of law provision or rule. Any legal suit, action, or proceeding arising out of, or related to, these
                Terms of Use or the Website shall be instituted exclusively in the courts of Jefferson County, Georgia, although we retain
                the right to bring any suit, action, or proceeding against you for breach of these Terms of Use in your country of residence
                or any other relevant country. You waive any and all objections to the exercise of jurisdiction over you by such courts and
                to venue in such courts. ANY CAUSE OF ACTION OR CLAIM YOU MAY HAVE ARISING OUT OF OR RELATING TO THESE TERMS OF USE OR THE
                WEBSITE MUST BE COMMENCED WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES; OTHERWISE, SUCH CAUSE OF ACTION OR CLAIM IS
                PERMANENTLY BARRED. If any provision of these Terms of Use is held by a court or other tribunal of competent jurisdiction to
                be invalid, illegal, or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent
                such that the remaining provisions of the Terms of Use will continue in full force and effect. The Terms of Use and Privacy
                Policy constitute the sole and entire agreement between you and Parcel Market LLC regarding the Website and supersede all
                prior and contemporaneous agreements.
              </p>
            </InView>
          </div>

          <div id="12" className="space-y-3 md:space-y-5">
            <h1 className={cn("font-extrabold text-xl", !modal && "md:text-2xl")}>Your Comments and Concerns </h1>
            <InView
              threshold={1}
              onChange={(isInView) => {
                if (setSelected && isInView) {
                  setSelected(12);
                }
              }}
            >
              <p className={cn("text-grey-800 text-sm space-y-3", !modal && "md:text-base")}>
                This website is operated by Parcel Market LLC. All notices of copyright infringement claims should be sent to
                <span className="font-semibold underline">customerservice@parcelmarket.com</span> in the manner and by the means set out
                therein. All other feedback, comments, requests for technical support, and other communications relating to the Website
                should be directed to: <span className="font-semibold underline">customerservice@parcelmarket.com</span>.
              </p>
            </InView>
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
              By clicking this box, you are acknowledging awareness of, and agreement, to our Terms of Use and Privacy Policy
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
