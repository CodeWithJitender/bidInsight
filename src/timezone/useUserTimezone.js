// // import { useState, useEffect } from "react";

// // export const useUserTimezone = () => {
// //   const [timezone, setTimezone] = useState("UTC"); // Default UTC
// //   const [locationPermission, setLocationPermission] = useState("default");

// //   useEffect(() => {
// //     if (navigator.geolocation) {
// //       navigator.geolocation.getCurrentPosition(
// //         (position) => {
// //           console.log("Latitude:", position.coords.latitude);
// //           console.log("Longitude:", position.coords.longitude);
// //           setLocationPermission("granted");

// //           // You can call a reverse geocoding API here to get actual timezone from lat/lng if needed.
// //           const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// //           setTimezone(browserTimeZone); // fallback to browser timezone for now
// //         },
// //         (error) => {
// //           console.warn("Location access denied or blocked.", error);
// //           setLocationPermission("denied");

// //           // Fallback to browser's timezone setting even if location denied.
// //           const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
// //           setTimezone(browserTimeZone);
// //         }
// //       );
// //     } else {
// //       console.error("Geolocation not supported in this browser.");
// //       const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
// //       setTimezone(browserTimeZone);
// //     }
// //   }, []);

// //   return { timezone, locationPermission };
// // };









// import { useState, useEffect } from "react";

// export const useUserTimezone = () => {
//   const [timezone, setTimezone] = useState("UTC"); // Default UTC
//   const [locationPermission, setLocationPermission] = useState("default");

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           console.log("Latitude:", position.coords.latitude);
//           console.log("Longitude:", position.coords.longitude);
//           setLocationPermission("granted");

//           // TODO: Call a reverse geocoding API here to get timezone from Lat/Lng
//           // For now, fallback to browser's timezone (can be replaced with API result)
//           const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
//           setTimezone(browserTimeZone);
//         },
//         (error) => {
//           console.warn("Location access denied or blocked.", error);
//           setLocationPermission("denied");
//           // Fallback to browser's timezone setting even if location denied.
//           // const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
//           setTimezone("UTC");
//         }
//       );
//     } else {
//       console.error("Geolocation not supported in this browser.");

//       // ❗ If geolocation is not supported, fallback to UTC
//       setTimezone("UTC");
//     }
//   }, []);

//   return { timezone, locationPermission };
// };
