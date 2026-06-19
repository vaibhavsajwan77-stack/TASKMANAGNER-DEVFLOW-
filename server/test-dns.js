const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

console.log("DNS Servers:", dns.getServers());

dns.resolveSrv(
  "_mongodb._tcp.clustertask.eg3balu.mongodb.net",
  (err, records) => {
    console.log("ERROR:", err);
    console.log("RECORDS:", records);
  }
);

dns.lookup("google.com", (err, address) => {
  console.log("GOOGLE ERROR:", err);
  console.log("GOOGLE ADDRESS:", address);
});