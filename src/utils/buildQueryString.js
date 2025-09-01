// // ✅ buildQueryString.js
// export function buildQueryString(obj) {
//   const params = new URLSearchParams();

//   for (const key in obj) {
//     const value = obj[key];

//     if (typeof value === "object" && value !== null && !Array.isArray(value)) {
//       for (const subKey in value) {
//         if (value[subKey]) {
//           params.append(`${key}[${subKey}]`, value[subKey]);
//         }
//       }
//     } else if (Array.isArray(value)) {
//       value.forEach((val) => {
//         if (val) params.append(`${key}[]`, val);
//       });
//     } else if (value) {
//       params.append(key, value);
//     }
//   }

//   return params.toString();
// }


export const buildQueryString = (filters) => {
    const params = new URLSearchParams();


    // Add default pagination
    params.append('page', '1');
    params.append('pageSize', '500');


    // Convert status (Active/Inactive)
    if (filters.status) {
      params.append('bid_type', filters.status);
    }


    // Convert location array to comma-separated state values
    if (filters.location && filters.location.length > 0) {
      params.append('state', filters.location.join(','));
    }


    // Convert solicitationType array to comma-separated solicitation values
    if (filters.solicitationType && filters.solicitationType.length > 0) {
      params.append('solicitation', filters.solicitationType.join(','));
    }


    // Convert keyword include array to comma-separated include values
    if (filters.keyword?.include && filters.keyword.include.length > 0) {
      params.append('include', filters.keyword.include.join(','));
    }


    // Convert keyword exclude array to comma-separated exclude values
    if (filters.keyword?.exclude && filters.keyword.exclude.length > 0) {
      params.append('exclude', filters.keyword.exclude.join(','));
    }


    // ✅ Convert NAICSCode array to comma-separated naics_codes values
    if (filters.NAICSCode && filters.NAICSCode.length > 0) {
      const codes = filters.NAICSCode.map(item => item.code || item);
      params.append('naics_codes', codes.join(','));
    }


    // Convert UNSPSCCode array to comma-separated unspsc_codes values
    if (filters.UNSPSCCode && filters.UNSPSCCode.length > 0) {
      const codes = filters.UNSPSCCode.map(item => item.code || item);
      params.append('unspsc_codes', codes.join(','));
    }


    // ✅ Add published date parameters
    if (filters.publishedDate && filters.publishedDate.after) {
      params.append('open_date_after', filters.publishedDate.after);
    }
    if (filters.publishedDate && filters.publishedDate.before) {
      params.append('open_date_before', filters.publishedDate.before);
    }


    // ✅ Add closing date parameters
    if (filters.closingDate && filters.closingDate.after) {
      params.append('closing_date_after', filters.closingDate.after);
    }
    if (filters.closingDate && filters.closingDate.before) {
      params.append('closing_date_before', filters.closingDate.before);
    }


    return params.toString();
  };
