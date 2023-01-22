import React from "react";
import { Parser } from "html-to-react";
import sanitizeHtml from "sanitize-html";
import { getResultTags } from "../../config/config-helper";
import FilterTags from "../filterTag/FilterTags";

const htmlToReactParser = new Parser();

const CustomResultView = ({ result, onClickLink }) => {
  let dateString = null;
  const createdDate = result.created_at?.raw || result.created_at?.snippet;
  if (createdDate) {
    try {
      const date = new Date(createdDate);
      const [month, day, year] = [
        date.toLocaleString("default", { month: "short" }),
        date.getDate(),
        date.getFullYear(),
      ];
      dateString = `${day} ${month}, ${year}`;
    } catch {
      dateString = null;
    }
  }
  return (
    <div className="searchresult">
      <h2 className="search-result-link">
        <a onClick={onClickLink} href={result.url.raw}>
          {htmlToReactParser.parse(sanitizeHtml(result.title.snippet))}
        </a>
      </h2>
      <a onClick={onClickLink} href={result.url.raw} className="url-display">
        {result.url.raw}
      </a>
      <p className="search-result-body">
        {htmlToReactParser.parse(
          sanitizeHtml(
            (result.body_type.raw === "raw"
              ? result.body.raw
              : JSON.parse(`[${result.body.raw}]`)
                  .map((i) => i.text)
                  .join(" ")
            ).replaceAll("\n", "")
          )
            .substring(0, 300)
            .trim()
        )}
      </p>

      <div className="search-result-filter">
        {getResultTags().map((field) => {
          if (result[field])
            return <FilterTags field={field} options={result[field]} />;
        })}
        {dateString && <span className="search-result-date">{dateString}</span>}
      </div>
    </div>
  );
};

export default CustomResultView;
