import { useQuery } from "@tanstack/react-query";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const SearchQueryContext = createContext(null);

export const SearchQueryProvider = ({ children }) => {
  // URL
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search");
  console.log("I rerendered")
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState([]);
  const [page, setPage] = useState(0);


  const buildQueryCall = async (searchTerm, filter, page) => {
    const body = {
      searchString: searchTerm,
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
    queryKey: ["query", searchTerm, filter, page],
    queryFn: () => buildQueryCall(searchTerm, filter, page),
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!searchTerm,
  });

  const makeQuery = (queryString) => {
    setSearchParams({ search: queryString })
  }

  const memoizedSearchQuery = useMemo(() => {
    return searchQuery
  }, [searchQuery]);

  useEffect(() => {
    console.log("memoizedSearch", memoizedSearchQuery);
  }, [memoizedSearchQuery])
  
  useEffect(() => {
    console.log("unMemoSQ", searchQuery)
  }, [searchQuery])

  // const addFilter = () => {

  // };


  return (
    <SearchQueryContext.Provider value={{ queryResult, setSearchTerm, makeQuery }}>
      {children}
    </SearchQueryContext.Provider>
  );
};

export default SearchQueryContext;
