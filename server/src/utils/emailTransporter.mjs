import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your@gmail.com",
    pass: "yourpassword",
  },
});

// Attach Handlebars template engine
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      partialsDir: path.resolve(__dirname, "templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "templates"),
    extName: ".hbs",
  })
);

export default transporter;
