// "use client";

// import { getAllStates } from "@/helpers/states";
// import { moneyFormatter } from "@/helpers/common";
// import { z } from "zod";
// import { userPropertiesFiltersValidations } from "@/zod-validations/filters-validations";
// import { SellingPropertyDetails } from "@/types/property";
// import { IPagination } from "@/types/common";
// import { useEffect } from "react";
// import { useAtom } from "jotai";
// import { userFollowedPropertiesAtom } from "@/atoms/user-followed-properties-atom";
// import { UserIcon2 } from "../../icons/UserIcons";
// import { IdIcon1 } from "../../icons/IdIcons";
// import { ResizeIcon1 } from "../../icons/ResizeIcons";
// import { MoneyIcon1 } from "../../icons/MoneyIcons";
// import DataNotFound from "../../shared/DataNotFound";
// import TablePagination from "../../shared/table-pagination";
// import UserFollowedPropertiesListItem from "./list-item";

// const UserFollowedPropertiesList = ({
//   data,
//   totalItems,
//   filters,
//   pageSize,
// }: {
//   data: ({ list: SellingPropertyDetails[] } & IPagination) | null;
//   totalItems: number;
//   filters: z.infer<typeof userPropertiesFiltersValidations>;
//   pageSize: number;
// }) => {
//   const stringifiedFilters = JSON.stringify(filters);
//   const [userFollowedPropertiesOptions, setUserFollowedPropertiesOptions] = useAtom(userFollowedPropertiesAtom);
//   const list = userFollowedPropertiesOptions.list ? Object.values(userFollowedPropertiesOptions.list).flat() : null;

//   useEffect(() => {
//     if (data?.list && userFollowedPropertiesOptions.list && stringifiedFilters !== Object.keys(userFollowedPropertiesOptions.list)[0]) {
//       // @ts-ignore
//       setUserFollowedPropertiesOptions((prev) => ({ ...prev, list: { [stringifiedFilters]: data.list } || null }));
//     }
//   }, [data?.list, filters, setUserFollowedPropertiesOptions, stringifiedFilters, userFollowedPropertiesOptions.list]);

//   useEffect(() => {
//     if (!userFollowedPropertiesOptions.list) {
//       setUserFollowedPropertiesOptions((prev) => ({ ...prev, list: data?.list ? { [stringifiedFilters]: data.list } : null }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userFollowedPropertiesOptions.list]);

//   return (
//     <div className="mt-6 md:mt-10">
//       <div className="space-y-10 md:space-y-12">
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//           {list?.map((land) => {
//             const state = getAllStates({ filterBlackList: true }).find((el) => el.value === land.state.toLocaleLowerCase());
//             const county = state?.counties?.find((el) => el.split(" ")[0].toLocaleLowerCase() === land.county.toLocaleLowerCase()) || "";
//             return (
//               <UserFollowedPropertiesListItem
//                 className="max-w-2xl m-auto"
//                 key={land.id}
//                 sellingItemId={land.id}
//                 followedListingId={land.followedListingId}
//                 showBookmark
//                 view="vertical"
//                 data={{
//                   availableTill: land.availableTill,
//                   state: state?.label || "",
//                   county: county || "",
//                   name: land.title,
//                   options: {
//                     owner: {
//                       icon: <UserIcon2 className="w-4 h-4 " />,
//                       label: "Owner",
//                       value: land.owner,
//                     },
//                     parcelNumber: {
//                       icon: <IdIcon1 className="w-4 h-4 fill-grey-600" />,
//                       label: "Parcel ID",
//                       value: land.parcelNumber,
//                     },
//                     acreage: {
//                       icon: <ResizeIcon1 className="w-4 h-4 fill-grey-600" />,
//                       label: "Acreage",
//                       value: land.acrage.toString(),
//                     },
//                     voltValue: {
//                       icon: <MoneyIcon1 className="w-4 h-4 fill-grey-600" />,
//                       label: "VOLT value",
//                       value: moneyFormatter.format(Number(land.salePrice)),
//                     },
//                   },
//                 }}
//               />
//             );
//           })}
//         </div>
//         {data?.pagination && data.pagination.totalCount > 0 && (
//           <TablePagination
//             rowsPerPage={pageSize}
//             totalCount={data?.pagination.totalCount}
//             currentPage={filters.page ? Number(filters.page) - 1 : 0}
//           />
//         )}
//         {totalItems === 0 && list?.length === 0 && (
//           <DataNotFound message="You have not saved any properties yet. Go to the Marketplace to save and follow listings.." />
//         )}
//         {totalItems > 0 && list && list.length === 0 && <DataNotFound message="Saved properties not found..." />}
//       </div>
//     </div>
//   );
// };

// export default UserFollowedPropertiesList;

import React from "react";

const list = () => <div>list</div>;

export default list;
