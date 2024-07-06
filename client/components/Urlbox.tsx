"use client";

import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const Urlbox = () => {
  const [urlRes, setUrlRes] = useState<any>();
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

    const res = await fetch("/api/seturl", {
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
      // Handle error here, e.g., setting an error message with setError
      return;
    }

    const info = await res.json();
    console.log(info);
    // Reset form after successful submission

    setUrlRes(info);
    // reset();
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
          <ArrowRight size={18} className="mx-2 inline" />
        </button>
      </form>
      {errors.url && (
        <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>
      )}

      {urlRes?.success === true && (
        <div className="mt-3 text-xs text-green-600">
          {" "}
          The ShortKey is {urlRes?.url}{" "}
        </div>
      )}
      {urlRes?.success === false && (
        <div className="mt-3 text-xs text-red-500">
          {" "}
          The ShortKey is {urlRes?.message}{" "}
        </div>
      )}
    </div>
  );
};

export default Urlbox;
