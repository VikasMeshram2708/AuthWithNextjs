import { connectDB } from "@/DB/dbConfig";
import User from "@/models/UserModel";
import { MongooseError } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();

    const { username, email, password } = reqBody;

    // Connect to DB
    await connectDB();

    // Validation
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        {
          message: "User already Exist",
        },
        {
          status: 400,
        }
      );
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Send email
    await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser?._id,
    });

    console.log(savedUser);

    return NextResponse.json(
      {
        message: "User Registered Successfully.",
        success: true,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const err = error as Error;
    if (error instanceof MongooseError) {
      return NextResponse.json(
        {
          message: error?.message,
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      {
        message: err?.message,
      },
      {
        status: 500,
      }
    );
  }
};
