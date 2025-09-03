// utils/ttlCheck.js
export const checkTTLAndClear = (navigate) => {
  const ttlStart = sessionStorage.getItem("ttlStartTime");
  const maxTTL = 10 * 60 * 1000; // 10 minutes in ms

  if (ttlStart) {
    const now = Date.now();
    const elapsed = now - parseInt(ttlStart, 10);
    if (elapsed > maxTTL) {
      console.log("⏰ TTL expired, clearing sessionStorage");
      sessionStorage.clear();
      navigate("/login"); // or show expired page
    }
  }
};
