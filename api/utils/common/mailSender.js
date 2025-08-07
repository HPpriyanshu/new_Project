import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.mail_address,
    pass: process.env.mail_Password,
  },
});

const sendMail = async (email, subject, message) => {
  const mailOptions = {
    from: process.env.mail_address,
    to: email,
    subject,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("mail sender m h error", error);
    next(error);
  }
};

export default sendMail;
