import { Button, Container, Heading } from "@chakra-ui/react";
import { withSearch } from "@elastic/react-search-ui";
import React, { useState } from "react";
import { getTopKeywords } from "../../config/config-helper";

const KeywordsSearchSelection = ({
  resultSearchTerm,
  setSearchTerm,
  results,
  filters,
  isLoading,
}) => {
  const [selectedWord, setSelectedWord] = useState("");
  const isSearched = Boolean(
    results.length &&
      (resultSearchTerm?.trim() || (filters.length && results?.length))
  );

  const handleToggleKeyword = (filter, isSelected) => {
    if (isLoading) return;
    if (!isSelected) {
      setSearchTerm(filter.value);
      setSelectedWord(filter.value);
    } else {
      setSelectedWord("");
    }
  };

  if (isSearched) {
    return null;
  }

  return (
    <>
      {getTopKeywords()?.length ? (
        <Container maxW="1300px">
          <Heading
            textAlign="center"
            fontSize={[null, null, "14px", "18px", "20px"]}
            my={4}
          >
            Search by Keyword
          </Heading>
          <div className={`home-facet-container`}>
            {getTopKeywords()?.map((a, idx) => {
              const selected = selectedWord === a.value && isLoading;
              return (
                <Button
                  variant="facet-pill"
                  size="no-size"
                  style={{ animationDelay: `${idx * 60}ms` }}
                  key={`${a.value}_${idx}`}
                  className={`home-facet-tag ${selected ? "tag-selected" : ""}`}
                  onClick={() => handleToggleKeyword(a, selected)}
                >
                  {a.value}
                </Button>
              );
            })}
          </div>
        </Container>
      ) : null}
    </>
  );
};

export default withSearch(
  ({ resultSearchTerm, setSearchTerm, results, filters, isLoading }) => ({
    resultSearchTerm,
    setSearchTerm,
    results,
    filters,
    isLoading,
  })
)(KeywordsSearchSelection);
