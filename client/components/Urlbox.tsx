"use client";

import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ArrowRight, ClipboardCopy } from "lucide-react";
import Link from "next/link";

import copy from "clipboard-copy";
import { toast } from "sonner";
import Spinner from "@/icons/Spinner";

const Urlbox = () => {
  const [urlRes, setUrlRes] = useState<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<{ url: string }>();

  const submitHandler = async (data: { url: string }) => {
    console.log("hello");
    console.log(data.url);

    let url = data.url;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      url = data.url;
    } else {
      setError("url", {
        type: "manual",
        message: "URL must start with http:// or https://",
      });
      toast.error("URL must start with http:// or https://");
      return null;
    }
    if (url.endsWith("/")) {
      url = url;
    }
    setIsLoading(true);
    const res = await fetch(`/api/seturl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: data.url,
      }),
    });

    if (!res.ok) {
      console.log(res.status);
    }

    const info = await res.json();
    console.log(info);
    setIsLoading(false);
    // Reset form after successful submission

    setUrlRes(info);
    // reset();
  };

  const handleCopy = async (text: string) => {
    try {
      await copy(text);
      toast("Url Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy text to clipboard", error);
    }
  };

  return (
    <div className="m-auto mt-[15%] h-fit w-fit text-black">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className={cn(
          "border-highlights left-0 flex h-10 w-fit !transform rounded-md border",
        )}
      >
        <input
          id="url"
          className="placeholder:text-muted-foreground flex h-9 w-[30vw] bg-transparent px-3 py-1 text-sm text-slate-200 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter url..."
          type="text"
          {...register("url", {
            required: {
              value: true,
              message: "URL cannot be empty!",
            },
          })}
        />
        <button
          type="submit"
          className="my-auto border-l-[0.25px] px-3 text-slate-400"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <ArrowRight size={18} className="mx-2 inline" />
          )}
        </button>
      </form>
      {errors.url && (
        <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>
      )}

      {urlRes?.success === true && (
        <div className="mt-5 ">
          <p className="mb-[2px] text-xs italic text-slate-300">
            {" "}
            Your shorturl is:{" "}
          </p>
          <div className="flex justify-between rounded-md bg-neutral-800 p-3 text-xs text-green-600 shadow-[inset_0px_20px_20px_10px_#00000024]">
            <div>
              <Link href={`/${urlRes?.url}`} target="_blank">
                {process.env.NEXT_PUBLIC_HOST_URL}/{urlRes?.url}
              </Link>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy(`${process.env.NEXT_PUBLIC_HOST_URL}/${urlRes?.url}`)
              }
            >
              <ClipboardCopy
                size={16}
                className="ml-3 inline text-slate-300 opacity-60 hover:opacity-100"
              />
            </button>
          </div>
        </div>
      )}

      {errors.url && (
        <div className="mt-7 rounded-md border border-neutral-800 bg-gray-800 px-5 py-3 text-base text-slate-300 shadow-inner">
          URL should like https://www.example.com
        </div>
      )}

      {urlRes?.success === false && (
        <div className="mt-3 text-xs text-red-500"> {urlRes?.message} </div>
      )}
    </div>
  );
};

export default Urlbox;
