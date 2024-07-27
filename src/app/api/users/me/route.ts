import { connectDB } from "@/DB/dbConfig";
import User from "@/models/UserModel";
import { MongooseError } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import { GetDataFromToken } from "@/helpers/GetDataFromToken";

export const POST = async (request: NextRequest) => {
  try {
    // connect to DB
    await connectDB();

    // extract data from token
    const userId = await GetDataFromToken(request);
    const user = await User.findOne({
      _id: userId,
    }).select("-password");

    // check if there if no user
    return NextResponse.json(
      {
        message: "User Found.",
        data: user,
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
