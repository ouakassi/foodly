import Queue from "bull";
import { sendEmail } from "../utils/sendEmail.js";

const emailQueue = new Queue("emailQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// Email job processor
emailQueue.process(async (job) => {
  try {
    const { to, subject, template, context } = job.data;
    await sendEmail({ to, subject, template, context });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
});

export default emailQueue;
