import React from "react";
import { getUserSearches } from "@/server-actions/user-searches/actions";
import { numFormatter } from "@/helpers/common";
import { getCountyValue, getStateValue } from "@/helpers/states";
import SearchAccordion from "./search-accordion";
import SearchDetails from "./search-details";
import DataNotFound from "../../shared/DataNotFound";
import UserSearchHeader from "./search-header";
import UserSearchesPagination from "./user-searches-pagination";

const UserSearches = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const { data } = await getUserSearches(searchParams);
  return (
    <div className="space-y-8 md:space-y-6">
      {!data || data.pagination.totalCount === 0 ? (
        <DataNotFound message="Data not found..." />
      ) : (
        <>
          <UserSearchHeader totalCount={data.pagination.totalCount} />
          <div
            className="border border-grey-100 rounded-2xl 
            [&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-grey-100
            [&>div:first-child>div:first-child]:!pt-5 [&>div:last-child>div:first-child]:!pb-5
            [&>div:first-child>div:first-child]:!rounded-t-2xl [&>div:last-child>div:first-child]:rounded-b-2xl"
          >
            {data.list.map((item) => (
              <SearchAccordion
                title={`${getStateValue(item.state)?.label}/${getCountyValue(item.county, item.state)?.label}/${
                  item.acrage
                }/${numFormatter.format(Number(item.price))}`}
                id={item.id}
                key={item.id}
              >
                <SearchDetails data={item} />
              </SearchAccordion>
            ))}
          </div>
          <UserSearchesPagination totalCount={data.pagination.totalCount} />
        </>
      )}
    </div>
  );
};

export default UserSearches;
