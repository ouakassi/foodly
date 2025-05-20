import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the write stream
const option = fs.createWriteStream(
  path.join(__dirname, "../", "logs", "appLogs.log"),
  {
    flags: "a",
  }
);

export default option;
