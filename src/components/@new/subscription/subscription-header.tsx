import { CheckIcon4 } from "../icons/CheckIcons";

const SubscriptionHeader = () => (
  <div className="space-y-6">
    <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center">One Subscription. Full Access</h1>
    <div className="border border-primary-main-400 rounded-2xl bg-primary-main-50 p-4 md:p-6 lg:8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div className="space-y-3">
        <h3 className="font-medium text-lg">Sale and Value Data</h3>
        <ul className="space-y-3">
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            VOLT Tool
          </li>
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            Save Property Searches
          </li>
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            View Sales in Map
          </li>
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            Export Sale Data to KML and XML
          </li>
        </ul>
      </div>
      <div className="space-y-3">
        <h3 className="font-medium text-lg"> Parcel Marketplace</h3>
        <ul className="space-y-3">
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            Search and Post Wholesale Land Deals
          </li>
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            Make and Receive Offers
          </li>
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            Chat Directly with Investors and Landowners
          </li>
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            Save and Follow Listings
          </li>
        </ul>
      </div>
      <div className="space-y-3">
        <h3 className="font-medium text-lg">Sale and Value Data</h3>
        <ul className="space-y-3">
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            Contact Experienced Land Professionals
          </li>
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            Local to Your area
          </li>
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            Parcel Market Vetted and Approved
          </li>
          <li className="grid grid-cols-[minmax(0,_max-content)_1fr] items-baseline gap-1.5">
            <CheckIcon4 className="!h-3.5" color="primary-main" />
            Brokers, Appraisers, and more...
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default SubscriptionHeader;
