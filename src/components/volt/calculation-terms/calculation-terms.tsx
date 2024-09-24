import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

const CalculationTerms = ({ onValueChange }: { onValueChange: (value: boolean) => void }) => (
  <div className="space-y-6 bg-white h-full">
    <p className="text-sm font-bold">Some information Before we calculate your price</p>
    <p className="text-sm text-grey-800">
      These terms and conditions (&quot;Terms&quot;) govern your use of the Land Marketplace (&quot;the Marketplace&quot;) provided by
      [Company Name]. By accessing or using the Marketplace, you agree to be bound by these Terms. If you do not agree to these Terms, you
      may not use the Marketplace.
    </p>
    {calculationTerms.map((term, termI) => (
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
    <Checkbox
      id="agree-calculation-terms"
      label={
        <p className="space-x-1 text-gray-600 text-xs font-medium">
          Yes, I understand and agree to the Parcel Market <span className="text-primary-main underline">Terms of Service</span> and
          <span className="text-primary-main underline">Privacy Policy</span>.
        </p>
      }
      onCheckedChange={(checked) => onValueChange(!!checked)}
    />
  </div>
);

export default CalculationTerms;

const calculationTerms = [
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
