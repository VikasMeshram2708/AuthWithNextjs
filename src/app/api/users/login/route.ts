import { connectDB } from "@/DB/dbConfig";
import User from "@/models/UserModel";
import { MongooseError } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();

    const { email, password } = reqBody;

    // connect to DB
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User Doesn't exist",
        },
        {
          status: 500,
        }
      );
    }
    console.log("user-exist", user);

    // compare the password
    const validPassword = await bcrypt.compare(password, user?.password);

    if (!validPassword) {
      return NextResponse.json(
        {
          message: "Check your Credentials",
        },
        {
          status: 400,
        }
      );
    }

    // token
    const tokenData = {
      id: user._id,
      username: user?.username,
      email: user?.email,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });

    console.log("token", token);

    const response = NextResponse.json({
      status: true,
      message: "User Logged In",
    });

    response.cookies.set("token", token, {
      httpOnly: true, // user cannot manipulate the token
    });

    return response;
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
