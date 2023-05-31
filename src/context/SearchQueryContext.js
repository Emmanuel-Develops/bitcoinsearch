import { useQuery } from "@tanstack/react-query";
import React, { createContext, useState } from "react";

export const SearchQueryContext = createContext(null);

export const SearchQueryProvider = ({ children }) => {
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
        // console.log({res})
        const data = await res.json();
        if (!data.success) {
          const errMessage = data.message || "Error while fetching";
          throw new Error(errMessage);
        }
        console.log("ln33", data);
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

  // const addFilter = () => {

  // };


  return (
    <SearchQueryContext.Provider value={{ queryResult, setSearchTerm, test: "I'm here" }}>
      {children}
    </SearchQueryContext.Provider>
  );
};

export default SearchQueryContext;
