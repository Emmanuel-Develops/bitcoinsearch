import { SearchBox } from "@elastic/react-search-ui";
import React, { useCallback, useMemo } from "react";
import SearchInput from "../components/customSearchboxView/SearchInput";
import HomeFacetSelection from "../components/homeFacetSelection";

const Header = ({ openForm }) => {
  const SearchInputWrapper = ({ ...rest }) => {
    return <SearchInput openForm={openForm} {...rest} />;
  };

  // const MemoizedHomeFacetSelection = React.memo(HomeFacetSelection)
  const MemoizedHomeFacetSelection = React.memo(HomeFacetSelection);

  return (
    <>
      <SearchBox
        autocompleteMinimumCharacters={3}
        // autocompleteResults={{
        //   linkTarget: "_blank",
        //   sectionTitle: "Suggested Queries",
        //   titleField: "title",
        //   urlField: "nps_link",
        //   shouldTrackClickThrough: true,
        //   clickThroughTags: ["test"],
        // }}
        autocompleteSuggestions={true}
        debounceLength={0}
        inputView={SearchInputWrapper}
      />
      <MemoizedHomeFacetSelection />
    </>
  );
};

export default React.memo(Header);