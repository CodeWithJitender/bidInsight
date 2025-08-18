// src/utils/urlHelpers.js

// 🔥 YE FUNCTIONS AAPKE DASHBOARD MEIN THE - Ab separate file mein rakhe hain
// WHY: Ye functions bahut bade the aur main component ko messy bana rahe the

// 🔥 FUNCTION 1: URL से Filters निकालना
// Ye function aapके dashboard mein "decodeUrlToFilters" naam se tha
export const decodeUrlToFilters = (searchParams) => {
  const decodedFilters = {
    status: "",
    keyword: { include: [], exclude: [] },
    location: [],
    UNSPSCCode: [],
    solicitationType: [],
    NAICSCode: [],
    publishedDate: { after: "", before: "" },
    closingDate: { after: "", before: "" },
    ordering: "closing_date",
    entityType: "",
  };

  // 🔥 URL PARAMETERS को FILTERS में convert करना
  if (searchParams.get("bid_type")) {
    decodedFilters.status = searchParams.get("bid_type");
  }

  if (searchParams.get("state")) {
    decodedFilters.location = searchParams.get("state").split(",");
  }

  if (searchParams.get("solicitation")) {
    decodedFilters.solicitationType = searchParams.get("solicitation").split(",");
  }

  if (searchParams.get("include")) {
    decodedFilters.keyword.include = searchParams.get("include").split(",");
  }

  if (searchParams.get("exclude")) {
    decodedFilters.keyword.exclude = searchParams.get("exclude").split(",");
  }

  if (searchParams.get("unspsc_codes")) {
    const codes = searchParams.get("unspsc_codes").split(",");
    decodedFilters.UNSPSCCode = codes.map((code) => ({ code }));
  }

  if (searchParams.get("naics_codes")) {
    const codes = searchParams.get("naics_codes").split(",");
    decodedFilters.NAICSCode = codes.map((code) => ({ code }));
  }

  if (searchParams.get("open_date_after")) {
    decodedFilters.publishedDate.after = searchParams.get("open_date_after");
  }

  if (searchParams.get("open_date_before")) {
    decodedFilters.publishedDate.before = searchParams.get("open_date_before");
  }

  if (searchParams.get("closing_date_after")) {
    decodedFilters.closingDate.after = searchParams.get("closing_date_after");
  }

  if (searchParams.get("closing_date_before")) {
    decodedFilters.closingDate.before = searchParams.get("closing_date_before");
  }

  if (searchParams.get("ordering")) {
    decodedFilters.ordering = searchParams.get("ordering");
  }

  if (searchParams.get("entity_type")) {
    decodedFilters.entityType = searchParams.get("entity_type");
  }

  return decodedFilters;
};

// 🔥 FUNCTION 2: Filters से URL बनाना  
// Ye function aapके dashboard mein "buildQueryString" naam se tha
export const buildQueryString = (filters, currentPage, perPage) => {
  const params = new URLSearchParams();

  // 🔥 PAGE और PAGE SIZE हमेशा add करते हैं
  params.append("page", currentPage.toString());
  params.append("pageSize", perPage.toString());

  // 🔥 सिर्फ उन FILTERS को add करते हैं जो empty नहीं हैं
  if (filters.status) {
    params.append("bid_type", filters.status);
  }

  if (filters.location && filters.location.length > 0) {
    params.append("state", filters.location.join(","));
  }

  if (filters.solicitationType && filters.solicitationType.length > 0) {
    params.append("solicitation", filters.solicitationType.join(","));
  }

  if (filters.keyword?.include && filters.keyword.include.length > 0) {
    params.append("include", filters.keyword.include.join(","));
  }

  if (filters.keyword?.exclude && filters.keyword.exclude.length > 0) {
    params.append("exclude", filters.keyword.exclude.join(","));
  }

  if (filters.UNSPSCCode && filters.UNSPSCCode.length > 0) {
    const codes = filters.UNSPSCCode.map((item) => item.code);
    params.append("unspsc_codes", codes.join(","));
  }

  if (filters.NAICSCode && filters.NAICSCode.length > 0) {
    const codes = filters.NAICSCode.map((item) => item.code);
    params.append("naics_codes", codes.join(","));
  }

  if (filters.publishedDate?.after) {
    params.append("open_date_after", filters.publishedDate.after);
  }

  if (filters.publishedDate?.before) {
    params.append("open_date_before", filters.publishedDate.before);
  }

  if (filters.closingDate?.after) {
    params.append("closing_date_after", filters.closingDate.after);
  }

  if (filters.closingDate?.before) {
    params.append("closing_date_before", filters.closingDate.before);
  }

  if (filters.ordering) {
    params.append("ordering", filters.ordering);
  }

  if (filters.entityType) {
    params.append("entity_type", filters.entityType);
  }

  // 🔥 Final URL string return करते हैं
  return params.toString();
};