import { connectDB } from "@/DB/dbConfig";
import User from "@/models/UserModel";
import { MongooseError } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();

    const { token } = reqBody;

    console.log("token", token);

    // connect to DB
    await connectDB();

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid Token",
        },
        {
          status: 400,
        }
      );
    }
    console.log("user", user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Email Verified Successfully",
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
