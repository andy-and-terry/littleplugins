// ipblock.js — load in <head> with: <script src="ipblock.js"></script>
// (no defer/async, so it runs before the page renders)

// [1] Hide everything immediately while we check the IP
document.documentElement.style.visibility = "hidden";

// [2] Blocklist — add IPs here
const addresses = ["18.239.69.28", "18.239.69.31", "18.239.69.58", "18.239.69.59"]

// [3] Wipes the page and shows the block message
function block() {
  document.documentElement.innerHTML =
    "<h1>Your IP has been blocked due to security reasons</h1>";
  document.documentElement.style.visibility = "visible";
}

// [4] Look up the visitor's IPv4 AND IPv6, then decide
(async () => {
  try {
    const endpoints = [
      "https://api.ipify.org?format=json",   // IPv4
      "https://api64.ipify.org?format=json", // IPv6 (falls back to IPv4)
    ];
 
    const results = await Promise.allSettled(
      endpoints.map((url) =>
        fetch(url, { signal: AbortSignal.timeout(5000) }) // don't hang forever
          .then((res) => res.json())
          .then((data) => data.ip)
      )
    );
 
    // Keep the lookups that succeeded (IPv4-only visitors fail the v6 one, etc.)
    const ips = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
 
    if (ips.length === 0) throw new Error("all lookups failed");
 
    if (ips.some((ip) => addresses.includes(ip))) {
      block(); // either IP is on the list
    } else {
      document.documentElement.style.visibility = "visible"; // reveal page
    }
  } catch {
    // [5] Lookup blocked, offline, or timed out → alert + keep page blocked
    alert("IP Lookup failed - Please try again later");
    document.documentElement.innerHTML =
      "<h1>IP Lookup failed - Please try again later</h1>";
    document.documentElement.style.visibility = "visible";
  }
})();
