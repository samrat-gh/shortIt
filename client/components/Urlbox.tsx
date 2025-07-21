"use client";

import { LinkIcon, ClipboardCopy, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import copy from "clipboard-copy";
import { toast } from "sonner";
import Link from "next/link";

import LoginModel from "./login-model";

interface UrlData {
  id: string;
  url: string;
  shorturl: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export default function UrlBox() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingUrls, setIsLoadingUrls] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<{ url: string }>();

  const submitHandler = async (data: { url: string }) => {
    const url = data.url;
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
          url: data.url,
        }),
      });

      if (!res.ok) throw new Error("Failed to create URL");

      const info = await res.json();

      if (info.success) {
        setUrls(info.data);
        reset();
        toast.success("URL shortened successfully!");
      } else {
        toast.error(info.message || "Failed to create URL");
      }
    } catch (error) {
      toast.error("Failed to create URL");
    } finally {
      setIsLoading(false);
    }
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
    try {
      const res = await fetch(`/api/urls/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete URL");

      setUrls((prev) => prev.filter((url) => url.id !== id));
      toast.success("URL deleted successfully");
    } catch (error) {
      toast.error("Failed to delete URL");
    }
  };

  console.log("hello");
  console.log(urls);

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
          <LoginModel />
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
                type="url"
                placeholder="Paste your long URL here"
                className="h-12 w-full"
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
        {urls.length > 0 && (
          <div
            key={urls[0].id}
            className="group relative mx-auto mt-7 w-full max-w-2xl overflow-hidden rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex w-full items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/${urls[0].shorturl}`}
                    target="_blank"
                    className="text-sm font-medium text-emerald-500 transition-colors hover:text-emerald-600"
                  >
                    {process.env.NEXT_PUBLIC_HOST_URL}/{urls[0].shorturl}
                  </Link>
                  <button
                    onClick={() =>
                      handleCopy(
                        `${process.env.NEXT_PUBLIC_HOST_URL}/${urls[0].shorturl}`,
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
                    href={urls[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <ExternalLink size={12} />
                    <span className="max-w-[200px] truncate">
                      {urls[0].url}
                    </span>
                  </Link>
                  <span>•</span>
                  <span>{urls[0].clicks} clicks</span>
                  <span>•</span>
                  <span>
                    {new Date(urls[0].createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(urls[0].id)}
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
