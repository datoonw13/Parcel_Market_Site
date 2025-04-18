import routes from "@/helpers/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { uuid } from "short-uuid";

const QuestionsPage = () => (
  <div className="px-5 sm:px-8 md:px-11 lg:px-16 xl:px-[11vw] flex grid-cols-1 lg:grid-cols-[minmax(0,_max-content)_1fr] pt-8 md:pt-12 gap-24">
    <ul className=" gap-4 min-w-52 max-w-52 w-full hidden lg:flex flex-col">
      {list.map((el) => (
        <Link key={el.id} href={`#${el.id}`}>
          <li className="text-grey-800">{el.title}</li>
        </Link>
      ))}
    </ul>
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="font-extrabold text-3xl md:text-4xl xl:text-5xl">Frequently asked questions</h1>
        <h3 className={cn("text-grey-800 text-sm", "md:text-base")}>Last Modified: July 21, 2024</h3>
      </div>
      {list.map((el) => (
        <div key={el.id} id={el.id} className="space-y-3 md:space-y-5">
          <h1 className={cn("font-extrabold text-xl", "md:text-[22px]")}>{el.title}</h1>
          <p className={cn("text-grey-800 text-sm", "md:text-base")}>{el.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default QuestionsPage;

const list = [
  {
    title: `What is VOLT and VOLT Value?`,
    description: `VOLT is a free vacant land value tool that changes the way real estate professionals begin understanding values around a specific parcel of vacant land. Taking less than 30 seconds, VOLT utilizes county sale data and a subject property’s location and size to calculate the average price of sold properties in the market area. This average is called the VOLT Value. The VOLT Value offers a preliminary understanding of average land values in a specific area without sifting through qualified and unqualified comps and computing an average value on your own. It is the ultimate starting point for evaluating vacant land.`,
  },
  {
    title: `How is VOLT and Parcel Market different from other land information websites?`,
    description: `While there are many sophisticated land information websites out there offering tons of land data, Parcel Market’s VOLT gets to the point where we are all initially concerned the most – value! VOLT answers this question the quickest and with the least number of steps. Sophistication and information overload is great, but sometimes we just need a quick answer regarding value to see if a vacant land parcel is even worth investigating further. VOLT saves users huge amounts of time and resources when all you need is an idea of the market surrounding a specific tract of vacant land. `,
  },
  {
    title: `How does VOLT calculate the VOLT Value?`,
    description: (
      <span>
        The VOLT Value is an average of sold vacant land transactions of similar size, over the past 2 years, and within 10 miles. By
        employing advanced algorithms, VOLT analyzes county sales data with respect to the subject property’s location, and size. Our
        algorithms filter sales data to ensure VOLT is using the most relevant sales for calculating an average sold price in each market
        area. VOLT does not account for other property characteristics and is only a starting point for understanding the market values
        surrounding a parcel of vacant land of similar size. <b>It is not an appraisal of value for the subject property</b>.
      </span>
    ),
  },
  {
    title: `Do I need to create an account and pay to use the VOLT?`,
    description: `The short answer is no! We want VOLT to be free for everyone’s benefit. Although data is very expensive, VOLT is designed for immediate use without requiring you to create an account or submit personal information, ensuring a seamless and hassle-free experience. However, to access, export, and/or analyze the sales data which VOLT uses to calculate the VOLT Value, you will need a subscription to Parcel Market. This is how we monetize Parcel Market and provide the best possible data and tool features for our users.`,
  },
  {
    title: `How much time can VOLT save?`,
    description: `Our testers, who are real estate professionals in the land business, can research on average 10 vacant land parcels in the time it would typically take to analyze 2, using traditional methods. This substantial time saving enhances productivity, allowing you to explore more opportunities and make informed decisions much faster, leading to an increased deal flow and better understanding of vacant land markets.`,
  },
  {
    title: `Is VOLT available in all US states?`,
    description: `Currently, VOLT covers 38 states and 2,267 counties. We are actively working to expand our coverage to all 50 U.S. states, aiming to provide comprehensive nationwide access.`,
  },
  {
    title: `How often is the data used by VOLT updated?`,
    description: `The data used by VOLT is updated weekly to ensure users have access to the most current and accurate market information. However, please understand that our data is county dependent - we provide what the county provides.`,
  },
  {
    title: `Does VOLT work for every vacant land parcel?`,
    description: `VOLT can only work where sufficient sales data exists. Because vacant land can be in rural areas, there are cases where VOLT will be unable to calculate an average sold price due to insufficient data, meaning not enough sales of similar sized properties have occurred over the past 2 years. You will receive an insufficient data pop-up notification if this is the case.`,
  },
  {
    title: `How accurate is VOLT?`,
    description: `VOLT is extremely reliable and accurate in most areas. However, there are cases
where data can be skewed, and VOLT is unable to filter outlier sales. This occurs
most when large acreage transactions occur with multiple parcels and each
individual parcel is assigned the overall sale value. Our team and statisticians are
working to resolve this and make VOLT even more accurate. We will continue to
improve VOLT for these cases and others to improve accuracy.`,
  },
  {
    title: `What if a property is made up of multiple parcels?`,
    description: `Currently VOLT can only search and calculate for one specific parcel of vacant land
at a time. However, our team is currently developing additional VOLT functionality
where multi-parcel input will be enabled soon. If a property is made up of multiple
parcels, we suggest locating a single, similar acreage parcel nearby the subject
and running that parcel through VOLT for the VOLT Value`,
  },
  {
    title: `What do I receive with a subscription to Parcel Market?`,
    description: (
      <span>
        While obtaining the VOLT Value is completely free, the ability to save VOLT searches, view sales data, and export sales data require
        a subscription to Parcel Market. We strive to make this as affordable as possible. You can try Parcel Market and VOLT with a{" "}
        <Link href={routes.volt.fullUrl} className="underline">
          FREE TRIAL.
        </Link>
      </span>
    ),
  },
  {
    title: `How can VOLT help real estate agents and brokers?`,
    description: `Real estate agents and brokers can leverage VOLT's accurate and up-to-date data to gain valuable market insights and make informed decisions at lightning speeds. This helps handle potential client questions regarding values in unfamiliar markets faster, making VOLT users standout from others who need to “get back with you” after further research. Additionally, CMA’s can be more accurate as VOLT uses sales data outside of the MLS. Agents who handle land transactions have just found their new best friend. `,
  },
  {
    title: `What should I do if I encounter issues using VOLT?`,
    description: `If you experience any issues or have questions, please contact our customer support team at customerservice@parcelmarket.com. We are committed to providing you with the assistance you need in a timely manner.`,
  },
].map((el) => ({ ...el, id: uuid() }));
