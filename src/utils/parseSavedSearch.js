// utils/parseSavedSearch.js

export const parseSavedSearch = (query_string = "") => {
  const urlParams = new URLSearchParams(query_string);
  const filters = Object.fromEntries(urlParams.entries());

  const splitOrEmptyArray = (value = "") =>
    value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];

  const finalFilters = {
    status: filters.bid_type || "Open Solicitations",
    keyword: filters.bid_name || "",
    location: filters.state || "",
    publishedDate: {
      from: filters.open_date_after || "",
      to: filters.open_date_before || "",
    },
    closingDate: {
      from: filters.close_date_after || "",
      to: filters.close_date_before || "",
    },
    solicitationType: splitOrEmptyArray(filters.solicitation),
    naics_codes: splitOrEmptyArray(filters.naics_codes),
    unspsc_codes: splitOrEmptyArray(filters.unspsc_codes),
    includeKeywords: splitOrEmptyArray(filters.include),
    excludeKeywords: splitOrEmptyArray(filters.exclude),
  };

  return finalFilters;
};
