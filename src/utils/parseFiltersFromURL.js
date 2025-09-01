  export function parseFiltersFromURL(searchParams) {
    const filters = {
      status: searchParams.get("status") || "",
      location: searchParams.getAll("location"),
      NAICSCode: searchParams.getAll("NAICSCode"),
      UNSPSCCode: searchParams.getAll("UNSPSCCode"),
      solicitationType: searchParams.getAll("solicitationType"),
      keyword: {
        include: searchParams.getAll("keywordInclude"),
        exclude: searchParams.getAll("keywordExclude"),
      },
      publishedDate: {
        type: searchParams.get("publishedType") || "",
        within: searchParams.get("publishedWithin") || "",
        date: searchParams.get("publishedDate") || "",
        from: searchParams.get("publishedFrom") || "",
        to: searchParams.get("publishedTo") || "",
        after: searchParams.get("publishedAfter") || "",
        before: searchParams.get("publishedBefore") || "",
      },
      closingDate: {
        type: searchParams.get("closingType") || "",
        within: searchParams.get("closingWithin") || "",
        date: searchParams.get("closingDate") || "",
        from: searchParams.get("closingFrom") || "",
        to: searchParams.get("closingTo") || "",
        after: searchParams.get("closingAfter") || "",
        before: searchParams.get("closingBefore") || "",
      },
    };

    return filters;
  }
