"use client";

import { CheckIcon4 } from "@/components/@new/icons/CheckIcons";
import { ExportIcon1 } from "@/components/@new/icons/ExportIcons";
import Button from "@/components/@new/shared/forms/Button";
import { numFormatter } from "@/helpers/common";
import useMediaQuery from "@/hooks/useMediaQuery";
import { IStripeCharge } from "@/types/subscriptions";
import clsx from "clsx";
import moment from "moment";
import Link from "next/link";

const HEADER_ROWS = [
  { responsive: true, label: "Product", key: "product" as const },
  { responsive: false, label: "Reference", key: "reference" as const },
  { responsive: false, label: "Date", key: "date" as const },
  { responsive: false, label: "Amount", key: "amount" as const },
  { responsive: true, label: "Status", key: "status" as const },
  { responsive: true, label: "", key: "download" as const },
];

const data = [
  {
    id: Math.random().toFixed(),
    product: "Monthly Plan",
    reference: "pc",
    date: "05-22-2024",
    amount: "$20",
    status: "success",
  },
  {
    id: Math.random().toFixed(),
    product: "Yearly Plan",
    reference: "pc",
    date: "05-22-2024",
    amount: "$200",
    status: "failed",
  },
];

const PaymentDetailsTable = ({ data }: { data: IStripeCharge[] }) => {
  const isSmallDevice = useMediaQuery(1024);

  return (
    <div className="w-full border border-grey-100 rounded-2xl">
      <table className={clsx("w-full")}>
        <thead>
          <tr className={clsx("bg-grey-30 rounded-2xl [&>th:first-child]:rounded-tl-2xl [&>th:last-child]:rounded-tr-2xl")}>
            {HEADER_ROWS.filter((el) => (isSmallDevice ? el.responsive : true)).map((item) => (
              <th
                className={clsx("py-3 px-6 text-sm font-normal group cursor-pointer")}
                align={item.key === "status" ? "center" : "left"}
                key={item.key}
              >
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className="[&>tr:last-child>td:first-child]:rounded-bl-2xl [&>tr:last-child>td:last-child]:rounded-br-2xl 
    [&>tr:not(:last-child)]:border-b [&>tr:not(:last-child)]:border-b-grey-50"
        >
          {data.length === 0 && (
            <tr>
              <th colSpan={HEADER_ROWS.filter((el) => (isSmallDevice ? el.responsive : true)).length}>
                <p className="py-6 md:py-8 !font-medium italic text-sm">Data not found...</p>
              </th>
            </tr>
          )}
          {data.map((el) => (
            <tr key={el.id}>
              {(isSmallDevice && HEADER_ROWS.find((el) => el.key === "product")?.responsive) || !isSmallDevice ? (
                <td className={clsx("py-3 px-6 text-grey-800 text-xs")} align="left">
                  {el.amount === 2000 ? "Monthly Plan" : "Yearly Plan"}
                </td>
              ) : null}
              {(isSmallDevice && HEADER_ROWS.find((el) => el.key === "reference")?.responsive) || !isSmallDevice ? (
                <td className={clsx("py-3 px-6 text-grey-800 text-xs")} align="left">
                  {el.invoice}
                </td>
              ) : null}
              {(isSmallDevice && HEADER_ROWS.find((el) => el.key === "date")?.responsive) || !isSmallDevice ? (
                <td className={clsx("py-3 px-6 text-grey-800 text-xs")} align="left">
                  {moment.unix(el.created).format("MM/DD/YYYY")}
                </td>
              ) : null}
              {(isSmallDevice && HEADER_ROWS.find((el) => el.key === "amount")?.responsive) || !isSmallDevice ? (
                <td className={clsx("py-3 px-6 text-grey-800 text-xs")} align="left">
                  {numFormatter.format(el.amount / 100)}
                </td>
              ) : null}
              {(isSmallDevice && HEADER_ROWS.find((el) => el.key === "status")?.responsive) || !isSmallDevice ? (
                <td className={clsx("py-3 px-6 text-grey-800 text-xs")} align="center">
                  <div>
                    <CheckIcon4 color="primary-main" className="" />
                  </div>
                </td>
              ) : null}
              {(isSmallDevice && HEADER_ROWS.find((el) => el.key === "download")?.responsive) || !isSmallDevice ? (
                <td className={clsx("py-3 px-6 text-grey-800 text-xs")} align="left">
                  <Link target="_blank" href={el.receipt_url}>
                    <Button endIcon={ExportIcon1} className="!bg-white !text-primary-main !outline-none [&>svg>*]:!fill-primary-main !p-2">
                      <p className="hidden md:block">Download</p>
                    </Button>
                  </Link>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentDetailsTable;
