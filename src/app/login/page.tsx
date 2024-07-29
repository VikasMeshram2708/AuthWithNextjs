"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const OnLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("signup-success", response.data);
      setLoading(false);
      router.push("/profile");
    } catch (error: any) {
      setLoading(false);
      toast.error("Login Failed. Try again later.");
      console.log(`Something went wrong. Sign up failed ${error}`);
    }
  };

  useEffect(() => {
    if (user?.email.length > 0 && user?.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <section className="">
      <form
        onSubmit={OnLogin}
        className="border rounded shadow grid gap-4 p-4 mt-10 max-w-lg mx-auto"
      >
        <h1 className="text-3xl font-bold text-center">
          {loading ? "Processing..." : "Login"}
        </h1>
        <input
          value={user?.email}
          onChange={(e) =>
            setUser({
              ...user,
              email: e?.target?.value,
            })
          }
          className="px-4 py-2 rounded text-black font-semibold"
          placeholder="Enter Email"
          type="email"
          name="email"
        />
        <input
          value={user?.password}
          onChange={(e) =>
            setUser({
              ...user,
              password: e?.target?.value,
            })
          }
          className="px-4 py-2 rounded text-black font-semibold"
          placeholder="Enter Password"
          type="password"
          name="password"
        />
        <button
          className="bg-pink-500 font-bold hover:bg-pink-400 px-4 py-2"
          type="submit"
        >
          {buttonDisabled ? "No Login" : "Login"}
        </button>
        <p>
          Not a User ?{" "}
          <Link className="hover:underline" href="/signup">
            Sign Up
          </Link>
        </p>
      </form>
    </section>
  );
}
