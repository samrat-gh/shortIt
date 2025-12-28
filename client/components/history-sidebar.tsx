"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  History,
  ExternalLink,
  ClipboardCopy,
  Trash2,
  Clock,
} from "lucide-react";
import copy from "clipboard-copy";
import { toast } from "sonner";
import Link from "next/link";
import { getUserId } from "@/lib/getUserId";
import { ClearAllAlert } from "./clearAllAlert";

interface UrlData {
  id: string;
  url: string;
  shorturl: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export default function HistorySidebar() {
  const [open, setOpen] = useState(false);
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string>();

  const fetchUrls = async () => {
    setIsLoading(true);
    try {
      if (userId) {
        // console.log("Fetching URLs for userId:", userId);
        const response = await fetch("/api/geturl/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
          cache: "no-cache",
        });
        if (response.ok) {
          const data = await response.json();
          const urlsData = data.url || data.data || data.urls || data || [];
          const urlsArray = Array.isArray(urlsData) ? urlsData : [];

          // Transform MongoDB objects to match expected structure
          const transformedUrls = urlsArray.map((url: any) => ({
            id: url._id || url.id,
            url: url.url,
            shorturl: url.shorturl,
            clicks: url.clicks || 0,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt,
          }));

          setUrls(transformedUrls);
        }
      } else {
        throw new Error("API not available");
      }
    } catch (error) {
      console.error("API Error, falling back to localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (window !== undefined) {
      const uid = getUserId();
      setUserId(uid);
    }

    if (open) {
      fetchUrls();
    }
  }, [open]);

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
      const res = await fetch(`/api/deleteurl?id=${id}`, {
        method: "GET",
      });

      if (!res.ok) {
        console.log("response not ok", res.ok, res.status);
      }

      const data = await res.json();

      if (!res.ok) {
        console.log("API delete failed");
      }

      if (data.success) {
        const updatedUrls = urls.filter((url) => url.id !== id);
        setUrls(updatedUrls);

        toast.success("URL deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Could not delete URL");
    }
  };

  const clearHistory = async () => {
    try {
      const res = await fetch(`/api/deleteallurl?userid=${userId}`, {
        method: "GET",
      });

      if (!res.ok) {
        console.log("response not ok", res.ok, res.status);
      }

      const data = await res.json();

      if (!res.ok) {
        console.log("API delete failed");
      }

      if (data.success) {
        setUrls([]);
        toast.success("URL cleared successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Could not delete URLs");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="border-gray-200 text-gray-700 hover:border-emerald-700 hover:bg-emerald-800 hover:text-gray-200"
        >
          History <History className="ml-2 h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-500" />
            URL History
          </SheetTitle>
          <SheetDescription>
            View and manage all your previously shortened URLs
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {urls.length} {urls.length === 1 ? "URL" : "URLs"} saved
            </p>
            {urls.length > 0 && (
              <ClearAllAlert onSubmit={clearHistory}>
                <Button
                  variant="outline"
                  size="sm"
                  // onClick={clearHistory}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear All
                </Button>
              </ClearAllAlert>
            )}
          </div>

          <Separator />

          {/* URL List */}
          <div className="max-h-[calc(100vh-200px)] space-y-3 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              </div>
            ) : urls.length === 0 ? (
              <div className="py-8 text-center">
                <History className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p className="text-gray-500">No URLs in history yet</p>
                <p className="mt-1 text-sm text-gray-400">
                  Start shortening URLs to see them here
                </p>
              </div>
            ) : (
              urls.map((urlData) => (
                <div
                  key={urlData.id}
                  className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        <Link
                          href={`/${urlData.shorturl}`}
                          target="_blank"
                          className="truncate text-sm font-medium text-emerald-500 transition-colors hover:text-emerald-600"
                        >
                          {process.env.NEXT_PUBLIC_HOST_URL || "localhost:3000"}
                          /{urlData.shorturl}
                        </Link>
                        <button
                          onClick={() =>
                            handleCopy(
                              `${process.env.NEXT_PUBLIC_HOST_URL || "localhost:3000"}/${urlData.shorturl}`,
                            )
                          }
                          className="rounded-md p-1 text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-emerald-500 group-hover:opacity-100"
                          aria-label="Copy to clipboard"
                        >
                          <ClipboardCopy size={14} />
                        </button>
                      </div>

                      <div className="space-y-1 text-xs text-gray-500">
                        <Link
                          href={urlData.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <ExternalLink size={10} />
                          <span className="max-w-[250px] truncate">
                            {urlData.url}
                          </span>
                        </Link>

                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            {urlData.clicks}{" "}
                            {urlData.clicks === 1 ? "click" : "clicks"}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(urlData.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(urlData.id)}
                      className="ml-2 rounded-md p-2 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                      aria-label="Delete URL"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
