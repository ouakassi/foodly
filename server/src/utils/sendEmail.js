import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configure Handlebars
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      partialsDir: path.resolve("server/src/templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve("server/src/templates"),
    extName: ".hbs",
  })
);

// Send email function
export const sendEmail = async ({ to, subject, template, context }) => {
  const mailOptions = {
    from: `"Foodly" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    template, // Name of the template file (without .hbs)
    context, // Dynamic variables for the template
  };

  await transporter.sendMail(mailOptions);
};
