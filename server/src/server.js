import "dotenv/config";

import http from "http";
import app from "./app.js";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  // await mongoConnect();
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}

startServer();
