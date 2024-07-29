"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const OnSignUp = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("signup-success", response.data);
      setLoading(false);
      router.push("/login");
    } catch (error: any) {
      setLoading(false);
      console.log(`Something went wrong. Sign up failed ${error}`);
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (
      user?.email.length > 0 &&
      user?.password.length > 0 &&
      user?.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <section className="">
      <form
        onSubmit={OnSignUp}
        className="border rounded shadow grid gap-4 p-4 mt-10 max-w-lg mx-auto"
      >
        <h1 className="text-3xl font-bold text-center">
          {loading ? "Processing..." : "Sign Up"}
        </h1>
        <input
          value={user?.username}
          onChange={(e) =>
            setUser({
              ...user,
              username: e?.target?.value,
            })
          }
          className="px-4 py-2 rounded text-black font-semibold"
          placeholder="Enter Username"
          type="text"
          name="username"
        />
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
          {buttonDisabled ? "No Sign Up" : "Sign Up"}
        </button>
        <p>
          Already a User ?{" "}
          <Link className="hover:underline" href="/login">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}
