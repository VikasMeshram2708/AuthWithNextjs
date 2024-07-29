"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifyMail() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(error?.message);
      console.log(error?.response?.data);
    }
  };

  useEffect(() => {
    setError(false);
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");

    // Next js way
    // const { query } = router;
    // const urlTokenTwo = query.token
  }, []);

  useEffect(() => {
    setError(false);
    if (token.length > 0) {
      verifyEmail();
    }
  }, [token]);

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : "no Token"}
      </h2>

      {verified && (
        <div>
          <h2>Verified</h2>
          <Link href="/login">Login</Link>
        </div>
      )}

      {error && (
        <div>
          <h2>Error</h2>
        </div>
      )}
    </section>
  );
}
