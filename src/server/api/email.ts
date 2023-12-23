import * as nodemailer from "nodemailer";
import { env } from "~/env";

export default async function SendEmail(
  recipient: string,
  recipientName: string,
  sender: string,
  movieTitle: string,
) {
  // Create a transporter with Gmail SMTP settings
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.GMAIL_EMAIL_ADDRESS,
      pass: env.GMAIL_APP_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: env.GMAIL_EMAIL_ADDRESS,
    to: recipient,
    subject: `${sender} has added ${movieTitle} to your watchlist!`,
    html: `<p>Hi ${recipientName}, ${sender} has added ${movieTitle} to your watchlist. Click <a href="https://www.movie-mate.co.uk/watchlist">here</a> to see it.</p>`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}
