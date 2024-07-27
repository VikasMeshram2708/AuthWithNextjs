import { MongooseError } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const response = NextResponse.json(
      {
        status: true,
        message: "Logout Successfully.",
      },
      {
        status: 201,
      }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
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
