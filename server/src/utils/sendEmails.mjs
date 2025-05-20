import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import log from "./logger.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Setup handlebars plugin
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".handlebars",
      partialsDir: path.resolve(__dirname, "../email/templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "../email/templates"),
    extName: ".handlebars",
  })
);

const sendEmail = async ({ to, subject, template, context }) => {
  try {
    await transporter.sendMail({
      from: `"Foodly" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      template, // the name of the .handlebars file (without extension)
      context, // values injected into template
    });

    log("email", "info", `Email sent to ${to}`);
  } catch (error) {
    log("email", "error", "Failed to send email", error);
    console.error("EMAIL SEND ERROR:", error); // Debug output
  }
};

export default sendEmail;
