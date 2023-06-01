import { useQuery } from "@tanstack/react-query";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const SearchQueryContext = createContext(null);

export const SearchQueryProvider = ({ children }) => {
  // URL
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [filter, setFilter] = useState([]);
  const [page, setPage] = useState(0);


  const buildQueryCall = async (searchQuery, filter, page) => {
    const body = {
      searchString: searchQuery,
      // "facets": [
      //     // {"field": "tags", "value": "segwit"}
      //     {"field": "authors", "value": "pieter"}
      // ]
    };

    const jsonBody = JSON.stringify(body);

    return fetch("http://localhost:3000/api/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonBody,
    })
      .then(async (res) => {
        // let jsonData = await res.json()
        const data = await res.json();
        if (!data.success) {
          const errMessage = data.message || "Error while fetching";
          throw new Error(errMessage);
        }
        return data.data?.result;
      })
      .catch((err) => {
        throw new Error(err.message ?? "Error fetching results");
      });
  };

  const queryResult = useQuery({
    queryKey: ["query", searchQuery, filter, page],
    queryFn: () => buildQueryCall(searchQuery, filter, page),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!searchQuery?.trim(),
  });

  const makeQuery = (queryString) => {
    setSearchParams({ search: queryString });
  };

  // const addFilter = () => {

  // };

  return (
    <SearchQueryContext.Provider value={{ queryResult, makeQuery }}>
      {children}
    </SearchQueryContext.Provider>
  );
};

export default SearchQueryContext;
