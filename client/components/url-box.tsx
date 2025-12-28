"use client";

import { LinkIcon, ClipboardCopy, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import copy from "clipboard-copy";
import { toast } from "sonner";
import Link from "next/link";

import HistorySidebar from "./history-sidebar";
import { getUserId } from "@/lib/getUserId";

interface UrlData {
  id: string;
  url: string;
  shorturl: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export default function UrlBox() {
  const [url, setUrl] = useState<UrlData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (window !== undefined) {
      const uid = getUserId();
      setUserId(uid);
    }
  }, []);

  // console.log("User ID:", userId);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<{ url: string }>();

  const submitHandler = async (data: { url: string }) => {
    const url = data.url.endsWith("/") ? data.url.slice(0, -1) : data.url;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("url", {
        type: "manual",
        message: "URL must start with http:// or https://",
      });
      toast.error("URL must start with http:// or https://");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/seturl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userId,
          url: data.url,
        }),
      });

      if (!res.ok) throw new Error("Failed to create URL");

      const info = await res.json();

      if (info.success) {
        console.log("infos", info.data);
        setUrl(info.data);
        reset();
        toast.success("URL shortened successfully!");
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error("An error occurred while shortening the URL");
    }
    setIsLoading(false);
  };

  const handleCopy = async (text: string) => {
    try {
      await copy(text);
      toast.success("URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting URL with id:", id);
    try {
      const res = await fetch(`/api/urls/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete URL");

      setUrl(null);
      toast.success("URL deleted successfully");
    } catch (error) {
      toast.error("Failed to delete URL");
    }
  };

  // console.log(urls);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <header className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-emerald-500" />
          <span className="text-xl font-bold">shortIt</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="#"
            className="hidden text-sm transition-colors hover:text-emerald-500 sm:inline-block"
          >
            Features
          </Link>
          <HistorySidebar />
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Shorten your links, <span className="text-emerald-500">expand</span>{" "}
            your reach
          </h1>
          <p className="mx-auto max-w-2xl text-gray-500">
            Create short, memorable links in seconds that redirect to your
            original URL. Track clicks and manage all your links in one place.
          </p>
        </div>

        <div className="mx-auto w-full max-w-2xl rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Paste your long URL here"
                className="h-12 w-full text-black"
                {...register("url", {
                  required: {
                    value: true,
                    message: "URL cannot be empty!",
                  },
                })}
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.url.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="h-12 bg-emerald-500 px-6 hover:bg-emerald-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Shorten"
              )}
            </Button>
          </form>
        </div>
        {url && (
          <div
            key={url.id}
            className="group relative mx-auto mt-7 w-full max-w-2xl overflow-hidden rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex w-full items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/${url.shorturl}`}
                    target="_blank"
                    className="text-sm font-medium text-emerald-500 transition-colors hover:text-emerald-600"
                  >
                    {process.env.NEXT_PUBLIC_HOST_URL}/{url.shorturl}
                  </Link>
                  <button
                    onClick={() =>
                      handleCopy(
                        `${process.env.NEXT_PUBLIC_HOST_URL}/${url.shorturl}`,
                      )
                    }
                    className="rounded-md p-1 text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-emerald-500 group-hover:opacity-100"
                    aria-label="Copy to clipboard"
                  >
                    <ClipboardCopy size={16} />
                  </button>
                </div>
                <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                  <Link
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <ExternalLink size={12} />
                    <span className="max-w-[200px] truncate">{url.url}</span>
                  </Link>
                  {/* <span>•</span>
                  <span>{url.clicks} clicks</span> */}
                  {/* <span>•</span>
                  <span>{new Date(url.createdAt).to}</span> */}
                </div>
              </div>
              <button
                onClick={() => handleDelete(url.id)}
                className="ml-4 rounded-md p-2 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                aria-label="Delete URL"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full p-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} shortIt. All rights reserved.</p>
      </footer>
    </div>
  );
}
