import { redirect } from "next/navigation";
import routes from "@/helpers/routes";
import { getLendDetailsAction } from "@/server-actions/marketplace/action";
import moment from "moment";
import { getAllStates, getCounties } from "@/helpers/states";
import { LocationIcon1 } from "../../icons/LocationIcons";
import { EyeIcon1 } from "../../icons/EyeIcons";
import { CalendarIcon1 } from "../../icons/CalendarIcons";
import LandDetails from "./details";

// import routes from "@/helpers/routes";
// import { getLendDetailsAction } from "@/server-actions/marketplace/action";
// import { redirect } from "next/navigation";
// import { getUserAction } from "@/server-actions/user/actions";
// import Land from "./land";

// const LandWrapper = async ({ landId }: { landId: string }) => {
//   const { data } = await getLendDetailsAction(landId);
//   const user = await getUserAction();

//   if (!data) {
//     redirect(routes.marketplace.fullUrl);
//   }

//   return (
//     <div>
//       <Land data={data} user={user!} />
//     </div>
//   );
// };

// export default LandWrapper;

// const Map = dynamic(() => import("@/components/shared/Map"), { ssr: false });

const Land = async ({ landId }: { landId: string }) => {
  if (!landId) {
    redirect(routes.marketplace.fullUrl);
  }
  const { data } = await getLendDetailsAction(landId);
  if (!data) {
    redirect(routes.marketplace.fullUrl);
  }

  const state = getAllStates().find((state) => state.value === data.state.toLocaleLowerCase())?.label;
  const county = getCounties(data.state.toLocaleLowerCase() || null).find((el) => el.value === data.county)?.label;

  // const [openModal, setOpenModal] = useState(false);

  // const createOffer = () => {
  //   if (!isSmallDevice) {
  //     setOpenModal(true);
  //   } else {
  //     router.push(`${pathname}/offer`);
  //   }
  // };

  return (
    <>
      {/* <CreateOfferModal open={openModal} closeModal={() => setOpenModal(false)} sellingPropertyId={data.id.toString()} /> */}
      <div>
        <div className="space-y-3 mb-6">
          <h1 className="font-semibold text-lg md:text-xl lg:text-2xl">{data.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <LocationIcon1 color="primary-main" className="!w-3 !h-3.5" />
              <p className="text-xs text-grey-600">
                {state}; {county}; {data.city || "Some City"}
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
                <CalendarIcon1 className="!w-3.5 !h-3.5" />
                <p className="text-grey-600 text-xs font-medium">
                  Available till: <span className="text-black">{moment(data.availableTill, "YYYY-MM-DD").format("DD MMM")}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-3">About The Land</h2>
          <p className="text-sm text-grey-600">{data.description || "There is no description"}</p>
          <div className="space-y-4 mt-4">
            <p className="text-sm font-medium">Features we have on the land:</p>
            <div className="flex flex-wrap gap-3">
              <div className="font-medium text-xs text-primary-main py-1 px-4 rounded-3xl bg-primary-main-100 border border-primary-main-200">
                {data.waterFeature ? "Water Feature" : "No Water Feature"}
              </div>
              <div className="font-medium text-xs text-primary-main py-1 px-4 rounded-3xl bg-primary-main-100 border border-primary-main-200">
                {data.frontNavigable ? "Water Front" : "No Water Front"}
              </div>
              <div className="font-medium text-xs text-primary-main py-1 px-4 rounded-3xl bg-primary-main-100 border border-primary-main-200">
                {data.cover}
              </div>
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
    </>
  );
};

export default Land;