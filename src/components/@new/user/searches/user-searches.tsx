import React from "react";
import SearchAccordion from "./search-accordion";
import SearchDetails from "./search-details";
import DataNotFound from "../../shared/DataNotFound";
import UserSearchHeader from "./search-header";

const UserSearches = () => {
  const data = {
    pagination: {
      totalCount: 2,
    },
  };
  return (
    <div className="space-y-8 md:space-y-6">
      {!data || data.pagination.totalCount === 0 ? (
        <DataNotFound message="Data not found..." />
      ) : (
        <>
          <UserSearchHeader totalCount={data.pagination.totalCount} />
          <div className="border border-grey-100 rounded-2xl py-2 [&>div:not(:last-child)]:border-b [&>div:not(:last-child)]:border-grey-100">
            <SearchAccordion id={1}>
              <SearchDetails />
            </SearchAccordion>
            <SearchAccordion id={122}>
              <SearchDetails />
            </SearchAccordion>
            <SearchAccordion id={1231231}>
              <SearchDetails />
            </SearchAccordion>
            <SearchAccordion id={11233241}>
              <SearchDetails />
            </SearchAccordion>
            <SearchAccordion id={133213}>
              <SearchDetails />
            </SearchAccordion>
            <SearchAccordion id={563}>
              <SearchDetails />
            </SearchAccordion>
            <SearchAccordion id={124234543}>
              <SearchDetails />
            </SearchAccordion>
          </div>
          {/* <UserListingPagination totalCount={data.pagination.totalCount} /> */}
        </>
      )}
    </div>
  );
};

export default UserSearches;
