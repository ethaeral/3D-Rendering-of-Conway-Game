/**
 * Mock parcels API: serves Parcels_2025.geojson from disk.
 * Run in dev so the app can load parcels without Vite serving the file.
 *
 *   node scripts/parcels-mock-api.js
 *   # or: npm run parcels-api
 *
 * Then in the app (dev), parcels are loaded from http://localhost:3001/parcels
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PARCELS_API_PORT) || 3001;
const parcelsPath = path.resolve(
  __dirname,
  "../src/features/boston-map/api/data/Parcels_2025.geojson"
);

const server = http.createServer((req, res) => {
  if (req.method !== "GET" || (req.url !== "/parcels" && req.url !== "/")) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found. Use GET /parcels");
    return;
  }

  if (!fs.existsSync(parcelsPath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(
      `Parcels_2025.geojson not found at:\n${parcelsPath}\nAdd the file there and restart.`
    );
    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/geo+json",
    "Access-Control-Allow-Origin": "*",
  });
  fs.createReadStream(parcelsPath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Parcels mock API: http://localhost:${PORT}/parcels`);
});
