"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();

  const [data, setData] = useState("");

  const getUserDetails = async () => {
    try {
      const res = await axios.post("/api/users/me");
      // console.log("user=d", res?.data.data._id);
      setData(res?.data.data._id);
    } catch (error: any) {
      toast.error(error?.message);
      console.log(
        `Something went wrong. Failed to fetch the user details ${error?.message}`
      );
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/users/logout");
      toast.success("Logout Success");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.message);
      console.log(`Something went wrong. Failed to logout.${error?.message}`);
    }
  };

  return (
    <section className="flex flex-col items-center gap-6 justify-center min-h-screen py-2">
      <h1 className="text-3xl font-semibold text-center">Profile Page</h1>
      <h2 className="text-white bg-orange-500 hover:underline underline-offset-2 p-2 rounded shadow text-center b text-sm font-semibold">
        {data === "" ? (
          "Nothing..."
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button
        onClick={() => getUserDetails()}
        type="button"
        className="bg-violet-500 hover:bg-violet-400 text-white rounded px-4 py-2 shadow"
      >
        User Details
      </button>
      <button
        onClick={() => logout()}
        type="button"
        className="bg-red-500 hover:bg-red-400 text-white rounded px-4 py-2 shadow"
      >
        Logout
      </button>
    </section>
  );
}
