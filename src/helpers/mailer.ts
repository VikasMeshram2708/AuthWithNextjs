import User from "@/models/UserModel";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

interface NodeMailerProps {
  email: string;
  emailType: string;
  userId: string;
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: NodeMailerProps) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODE_MAILER_AUTH_USER,
        pass: process.env.NODE_MAILER_AUTH_USER_KEY,
      },
    });

    const mailOptions = {
      from: "vikas@vikas.ram",
      to: email,
      subject:
        emailType === "VERIFY" ? "VERIFY your email:" : "Rest Your Password",
      // text: "Hello world?", // plain text body
      html: `
      <p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to
      ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
      or copy and paste the link below in your browser
      <br /> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    const err = error as Error;
    throw new Error(err?.message);
  }
};
