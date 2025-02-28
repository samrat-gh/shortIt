"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Page = () => {
  const [links, setLinks] = useState<{ id: string; url: string }[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getUrl() {
      //${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shorturl
      const res = await fetch(`/api/geturl`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
        mode: "no-cors",
      });

      if (!res.ok) {
        console.log("Error Occur red: ", res.status);
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("data :", data);
      setLinks(data.url || []);
    }

    if (!links) {
      getUrl();
      setLoading(false);
    }
  }, [links]);

  console.log(links);

  if (loading)
    return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (links?.length === 0)
    return <div className="text-center text-gray-500">No URLs found.</div>;

  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Shortened Links
      </h2>
      <div className="flex flex-col gap-3">
        {links?.map((link) => (
          <Link
            href={link.url}
            key={link.id}
            className="block rounded-md bg-blue-100 px-4 py-2 text-blue-600 transition hover:bg-blue-200"
          >
            {link.url}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
