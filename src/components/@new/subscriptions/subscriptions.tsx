import { CheckIcon2, CheckIcon3, CheckIcon4 } from "../icons/CheckIcons";
import Button from "../shared/forms/Button";

enum SubscriptionsEnum {
  FREE,
  MONTHLY,
  ANNUAL,
}

const currentPlan = SubscriptionsEnum.MONTHLY;

const isSelected = (plan: SubscriptionsEnum) => currentPlan === plan;

const Subscriptions = () => (
  <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
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
    <div className="space-y-6">
      <h2 className="hidden sm:block text-center text-lg font-semibold">How Would You like to Pay?</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-8 p-4 md:p-6 lg:8 border border-grey-100 rounded-2xl">
          <div className="space-y-4 ">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-primary-main text-lg md:text-xl lg:text-2xl font-semibold">14 Days</h2>
                <div className="w-6 h-6 rounded-full bg-primary-main p-1">
                  <CheckIcon3 color="white" />
                </div>
              </div>
              {isSelected(SubscriptionsEnum.FREE) && <p className="text-sm text-grey-600 font-medium">Active Until 22/09/2024</p>}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Free</h3>
              <p className="font-medium text-sm">
                <span className="text-primary-main text-sm font-medium">14 Days</span> (No card needed)
              </p>
            </div>
          </div>
          <Button className="w-full" variant={isSelected(SubscriptionsEnum.FREE) ? "secondary" : "primary"}>
            {isSelected(SubscriptionsEnum.FREE) ? "Cancel Subscription" : "Subscribe"}
          </Button>
        </div>
        <div className="space-y-8 p-4 md:p-6 lg:8 border border-grey-100 rounded-2xl">
          <div className="space-y-4 ">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-primary-main text-lg md:text-xl lg:text-2xl font-semibold">Monthly</h2>
                <div className="w-6 h-6 rounded-full bg-primary-main p-1">
                  <CheckIcon3 color="white" />
                </div>
              </div>
              {isSelected(SubscriptionsEnum.MONTHLY) && <p className="text-sm text-grey-600 font-medium">Active Until 22/09/2024</p>}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">$20.00</h3>
              <p className="text-primary-main text-sm font-medium">Per Month</p>
            </div>
          </div>
          <Button className="w-full" variant={isSelected(SubscriptionsEnum.MONTHLY) ? "secondary" : "primary"}>
            {isSelected(SubscriptionsEnum.MONTHLY) ? "Cancel Subscription" : "Subscribe"}
          </Button>
        </div>
        <div className="space-y-8 p-4 md:p-6 lg:8 border border-grey-100 rounded-2xl sm:col-span-2 lg:col-auto m-auto sm:max-w-[75%] lg:max-w-full w-full">
          <div className="space-y-4 ">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-primary-main text-lg md:text-xl lg:text-2xl font-semibold">Annual</h2>
                <div className="w-6 h-6 rounded-full bg-primary-main p-1">
                  <CheckIcon3 color="white" />
                </div>
              </div>
              {isSelected(SubscriptionsEnum.ANNUAL) && <p className="text-sm text-grey-600 font-medium">Active Until 22/09/2024</p>}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                $215.00<span className="text-xs font-medium text-grey-800">/17.90 per month</span>
              </h3>
              <p className="font-medium text-sm">
                <span className="text-primary-main text-sm font-medium">Per Year</span> (Save 10% per month)
              </p>
            </div>
          </div>
          <Button className="w-full" variant={isSelected(SubscriptionsEnum.ANNUAL) ? "secondary" : "primary"}>
            {isSelected(SubscriptionsEnum.ANNUAL) ? "Cancel Subscription" : "Subscribe"}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default Subscriptions;
