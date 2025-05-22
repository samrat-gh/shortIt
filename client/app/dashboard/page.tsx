"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ClipboardCopy, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Spinner from "@/icons/Spinner";
import { useRouter } from "next/navigation";

interface UrlData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    if (session?.user) {
      fetchUrls();
    }
  }, [session, status, router]);

  const fetchUrls = async () => {
    try {
      const res = await fetch("/api/urls");
      if (!res.ok) throw new Error("Failed to fetch URLs");
      const data = await res.json();
      setUrls(data.urls);
    } catch (error) {
      toast.error("Failed to load your URLs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
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

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Your URLs</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-400">{session.user.email}</span>
          <Link
            href="/"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
          >
            Create New URL
          </Link>
        </div>
      </div>

      {urls.length > 0 ? (
        <div className="space-y-4">
          {urls.map((url) => (
            <div
              key={url.id}
              className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition-all hover:border-slate-600"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/${url.shortUrl}`}
                      target="_blank"
                      className="text-sm font-medium text-emerald-500 transition-colors hover:text-emerald-400"
                    >
                      {process.env.NEXT_PUBLIC_HOST_URL}/{url.shortUrl}
                    </Link>
                    <button
                      onClick={() =>
                        handleCopy(
                          `${process.env.NEXT_PUBLIC_HOST_URL}/${url.shortUrl}`,
                        )
                      }
                      className="rounded-md p-1 text-slate-400 opacity-0 transition-all hover:bg-slate-700 hover:text-white group-hover:opacity-100"
                    >
                      <ClipboardCopy size={16} />
                    </button>
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-xs text-slate-400">
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 hover:text-slate-300"
                    >
                      <ExternalLink size={12} />
                      <span className="max-w-[200px] truncate">
                        {url.originalUrl}
                      </span>
                    </a>
                    <span>•</span>
                    <span>{url.clicks} clicks</span>
                    <span>•</span>
                    <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(url.id)}
                  className="ml-4 rounded-md p-2 text-slate-400 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center">
          <p className="mb-4 text-slate-400">No URLs created yet</p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
          >
            Create Your First URL
          </Link>
        </div>
      )}
    </div>
  );
}
