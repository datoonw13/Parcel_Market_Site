import { redirect } from "next/navigation";
import routes from "@/helpers/routes";
import { getLendDetailsAction } from "@/server-actions/marketplace/action";
import moment from "moment";
import clsx from "clsx";
import { getUserSubscriptions } from "@/server-actions/subscription/actions";
import { CiLocationOn } from "react-icons/ci";
import { BiCalendar } from "react-icons/bi";
import { getCountiesByState, getCounty, getState } from "@/helpers/states";
import { EyeIcon1 } from "../../icons/EyeIcons";
import LandDetails from "./details";
import RecentSalesList from "./recent-sales-list";

const Land = async ({ sellingPropertyId }: { sellingPropertyId: string }) => {
  const { data } = await getLendDetailsAction(sellingPropertyId);

  const userSubscription = await getUserSubscriptions();
  const isUserSubscriptionTrial = !!userSubscription.data?.find((el) => el.status === "trialing");

  if (!data) {
    redirect(routes.marketplace.fullUrl);
  }

  const state = getState(data.state.toLocaleLowerCase())?.label;
  const county = getCounty(data.state.toLocaleLowerCase(), data.county)?.short.label;

  return (
    <>
      <div>
        <div className="space-y-3 mb-6">
          <h1 className="font-semibold text-lg md:text-xl lg:text-2xl">{data.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <CiLocationOn className="size-4 text-primary-main" />
              <p className="text-xs text-grey-600">
                {state}; {county};{" "}
                <span className="capitalize">
                  {data?.property?.locality && data.property.locality?.split("-").length > 1
                    ? data.property.locality.split("-").splice(1).join(" ")
                    : data?.locality}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5">
                <EyeIcon1 className="!w-3.5 !h-3.5" />
                <p className="text-grey-600 text-xs font-medium">
                  Total Views: <span className="text-black">{data.totalViews}</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {/* <CalendarIcon1 className="!w-3.5 !h-3.5" /> */}
                <BiCalendar className="size-4 text-grey-600" />
                <p className="text-grey-600 text-xs font-medium">
                  Available till: <span className="text-black">{moment(data.availableTill, "YYYY-MM-DD").format("DD MMM")}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={clsx("flex gap-8 mb-20 sm:mb-26 md:mb-32 lg:mb-36", data.description ? "flex-col" : "flex-col-reverse")}>
          <div className="flex flex-col gap-4">
            {data.description && (
              <>
                <h2 className="font-semibold text-lg mb-3">About The Land</h2>
                <p className="text-sm text-grey-600">{data.description || "There is no description"}</p>
              </>
            )}
            <div className="space-y-4">
              {data.description && <p className="text-sm font-medium">Features we have on the land:</p>}
              <div className="flex flex-wrap gap-3">
                <div className="font-medium text-xs text-primary-main py-1 px-4 rounded-3xl bg-primary-main-100 border border-primary-main-200">
                  {data.waterFeature ? "Water Feature" : "No Water Feature"}
                </div>
                <div className="font-medium text-xs text-primary-main py-1 px-4 rounded-3xl bg-primary-main-100 border border-primary-main-200">
                  {data.frontNavigable ? "Water Front" : "No Water Front"}
                </div>
                {data.cover &&
                  data.cover.map((cover) => (
                    <div
                      key={cover}
                      className="font-medium text-xs text-primary-main py-1 px-4 rounded-3xl bg-primary-main-100 border border-primary-main-200"
                    >
                      {`${cover} cover type`}
                    </div>
                  ))}
                <div className="font-medium text-xs text-primary-main py-1 px-4 rounded-3xl bg-primary-main-100 border border-primary-main-200">
                  {data.wet}
                </div>
                <div className="font-medium text-xs text-primary-main py-1 px-4 rounded-3xl bg-primary-main-100 border border-primary-main-200">
                  {data.restriction ? "Restriction" : "No Restrictions"}
                </div>
                <div className="font-medium text-xs text-primary-main py-1 px-4 rounded-3xl bg-primary-main-100 border border-primary-main-200">
                  {data.access}
                </div>
              </div>
            </div>
          </div>
          {data && <LandDetails data={data} />}
        </div>
        {data.usedForPriceCalculations && (
          <RecentSalesList
            sellingProperty={{
              acreage: data.acrage,
              coordinates: data.coordinates,
              latitude: Number(data.lat),
              longitude: Number(data.lon),
              owner: data.owner,
              parcelNumber: data.parcelNumber,
              salePrice: data.salePrice,
            }}
            isUserSubscriptionTrial={isUserSubscriptionTrial}
            properties={data.usedForPriceCalculations.map((el, elI) => ({
              acreage: Number(el.arcage),
              latitude: Number(el.latitude),
              longitude: Number(el.longitude),
              parcelNumber: el.parcelNumber,
              lastSalePrice: Number(el.lastSalesPrice),
              county: el.county || "",
              state: el.state || "",
              lastSaleDate: el.lastSalesDate,
            }))}
          />
        )}
      </div>
    </>
  );
};

export default Land;
