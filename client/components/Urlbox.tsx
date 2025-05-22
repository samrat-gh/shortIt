// "use client";

// import { useForm } from "react-hook-form";
// import { cn } from "@/lib/utils";
// import { useState, useEffect } from "react";
// import {
//   ArrowRight,
//   ClipboardCopy,
//   Trash2,
//   ExternalLink,
//   LogIn,
// } from "lucide-react";
// import Link from "next/link";
// import copy from "clipboard-copy";
// import { toast } from "sonner";
// import Spinner from "@/icons/Spinner";
// import { useSession, signIn } from "next-auth/react";

// interface UrlData {
//   id: string;
//   originalUrl: string;
//   shortUrl: string;
//   createdAt: string;
//   clicks: number;
// }

// const Urlbox = () => {
//   const { data: session, status } = useSession();
//   const [urls, setUrls] = useState<UrlData[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isLoadingUrls, setIsLoadingUrls] = useState<boolean>(true);

//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors },
//     reset,
//   } = useForm<{ url: string }>();

//   useEffect(() => {
//     if (session?.user) {
//       fetchUserUrls();
//     }
//   }, [session]);

//   const fetchUserUrls = async () => {
//     try {
//       const res = await fetch("/api/urls");
//       if (!res.ok) throw new Error("Failed to fetch URLs");
//       const data = await res.json();
//       setUrls(data.urls);
//     } catch (error) {
//       toast.error("Failed to load your URLs");
//     } finally {
//       setIsLoadingUrls(false);
//     }
//   };

//   const submitHandler = async (data: { url: string }) => {
//     let url = data.url;
//     if (!url.startsWith("http://") && !url.startsWith("https://")) {
//       setError("url", {
//         type: "manual",
//         message: "URL must start with http:// or https://",
//       });
//       toast.error("URL must start with http:// or https://");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const res = await fetch(`/api/seturl`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           url: data.url,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to create URL");

//       const info = await res.json();
//       if (info.success) {
//         setUrls((prev) => [info.url, ...prev]);
//         reset();
//         toast.success("URL shortened successfully!");
//       } else {
//         toast.error(info.message || "Failed to create URL");
//       }
//     } catch (error) {
//       toast.error("Failed to create URL");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCopy = async (text: string) => {
//     try {
//       await copy(text);
//       toast.success("URL copied to clipboard");
//     } catch (error) {
//       toast.error("Failed to copy URL");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       const res = await fetch(`/api/urls/${id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) throw new Error("Failed to delete URL");

//       setUrls((prev) => prev.filter((url) => url.id !== id));
//       toast.success("URL deleted successfully");
//     } catch (error) {
//       toast.error("Failed to delete URL");
//     }
//   };

//   return (
//     <div className="mx-auto max-w-4xl px-4 py-16">
//       <div className="mb-12 space-y-4 text-center">
//         <div className="flex items-center justify-between">
//           <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
//             Short
//             <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
//               It
//             </span>
//           </h1>
//           {session?.user && (
//             <Link
//               href="/dashboard"
//               className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
//             >
//               Dashboard
//             </Link>
//           )}
//         </div>
//         <p className="text-base text-slate-400 sm:text-lg">
//           Transform your long URLs into short, memorable links in seconds
//         </p>
//         <div className="mx-auto mt-4 flex max-w-fit items-center justify-center space-x-2 text-sm text-slate-500">
//           <div className="flex items-center space-x-1.5">
//             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
//             <span>Fast</span>
//           </div>
//           <div className="h-4 w-px bg-slate-700"></div>
//           <div className="flex items-center space-x-1.5">
//             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
//             <span>Secure</span>
//           </div>
//           <div className="h-4 w-px bg-slate-700"></div>
//           <div className="flex items-center space-x-1.5">
//             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
//             <span>Simple</span>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-8">
//         <form
//           onSubmit={handleSubmit(submitHandler)}
//           className={cn(
//             "relative mx-auto flex max-w-xl transform overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 shadow-lg transition-all focus-within:border-slate-500 hover:border-slate-600",
//           )}
//         >
//           <input
//             id="url"
//             className="h-12 w-full bg-transparent px-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
//             placeholder="https://your-long-url.com"
//             type="text"
//             {...register("url", {
//               required: {
//                 value: true,
//                 message: "URL cannot be empty!",
//               },
//             })}
//           />
//           <button
//             type="submit"
//             className="flex items-center justify-center border-l border-slate-700 px-6 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {isLoading ? <Spinner /> : <ArrowRight size={20} />}
//           </button>
//         </form>

//         {errors.url && (
//           <p className="text-center text-sm text-red-400">
//             {errors.url.message}
//           </p>
//         )}

//         {status === "loading" ? (
//           <div className="flex justify-center">
//             <Spinner />
//           </div>
//         ) : !session?.user ? (
//           <div className="mt-8 text-center">
//             <p className="mb-4 text-slate-400">
//               Sign in to view and manage your URLs
//             </p>
//             <button
//               onClick={() => signIn()}
//               className="inline-flex items-center space-x-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
//             >
//               <LogIn size={16} />
//               <span>Sign In</span>
//             </button>
//           </div>
//         ) : (
//           <div className="mt-12">
//             <div className="mb-6 flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-white">Your URLs</h2>
//               <button
//                 onClick={() => signIn()}
//                 className="text-sm text-slate-400 hover:text-white"
//               >
//                 {session.user.email}
//               </button>
//             </div>
//             {isLoadingUrls ? (
//               <div className="flex justify-center">
//                 <Spinner />
//               </div>
//             ) : urls.length > 0 ? (
//               <div className="space-y-4">
//                 {urls.map((url) => (
//                   <div
//                     key={url.id}
//                     className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition-all hover:border-slate-600"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="min-w-0 flex-1">
//                         <div className="flex items-center space-x-2">
//                           <Link
//                             href={`/${url.shortUrl}`}
//                             target="_blank"
//                             className="text-sm font-medium text-emerald-500 transition-colors hover:text-emerald-400"
//                           >
//                             {process.env.NEXT_PUBLIC_HOST_URL}/{url.shortUrl}
//                           </Link>
//                           <button
//                             onClick={() =>
//                               handleCopy(
//                                 `${process.env.NEXT_PUBLIC_HOST_URL}/${url.shortUrl}`,
//                               )
//                             }
//                             className="rounded-md p-1 text-slate-400 opacity-0 transition-all hover:bg-slate-700 hover:text-white group-hover:opacity-100"
//                           >
//                             <ClipboardCopy size={16} />
//                           </button>
//                         </div>
//                         <div className="mt-1 flex items-center space-x-4 text-xs text-slate-400">
//                           <a
//                             href={url.originalUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center space-x-1 hover:text-slate-300"
//                           >
//                             <ExternalLink size={12} />
//                             <span className="max-w-[200px] truncate">
//                               {url.originalUrl}
//                             </span>
//                           </a>
//                           <span>•</span>
//                           <span>{url.clicks} clicks</span>
//                           <span>•</span>
//                           <span>
//                             {new Date(url.createdAt).toLocaleDateString()}
//                           </span>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => handleDelete(url.id)}
//                         className="ml-4 rounded-md p-2 text-slate-400 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center">
//                 <p className="text-slate-400">
//                   No URLs created yet. Create your first one above!
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Urlbox;

// import { LinkIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export default function UrlBox() {
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-between bg-white text-gray-900">
//       <header className="flex w-full items-center justify-between p-4">
//         <div className="flex items-center gap-2">
//           <LinkIcon className="h-5 w-5 text-emerald-500" />
//           <span className="text-xl font-bold">shortIt</span>
//         </div>
//         <nav className="hidden items-center gap-6 sm:flex">
//           <a
//             href="#"
//             className="text-sm transition-colors hover:text-emerald-500"
//           >
//             Features
//           </a>
//           {/* <a
//             href="#"
//             className="text-sm transition-colors hover:text-emerald-500"
//           >
//             Pricing
//           </a> */}
//           {/* <a
//             href="#"
//             className="text-sm transition-colors hover:text-emerald-500"
//           >
//             API
//           </a> */}
//           <Button variant="outline" size="sm" className="text-sm">
//             Sign In
//           </Button>
//         </nav>
//       </header>

//       <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-8">
//         <div className="mb-8 text-center">
//           <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
//             Shorten your links, <span className="text-emerald-500">expand</span>{" "}
//             your reach
//           </h1>
//           <p className="mx-auto max-w-2xl text-gray-500">
//             Create short, memorable links in seconds that redirect to your
//             original URL. Track clicks and manage all your links in one place.
//           </p>
//         </div>

//         <div className="mx-auto w-full max-w-2xl rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
//           <form className="flex flex-col gap-3 sm:flex-row">
//             <div className="flex-1">
//               <Input
//                 type="url"
//                 placeholder="Paste your long URL here"
//                 className="h-12 w-full"
//               />
//             </div>
//             <Button
//               type="submit"
//               className="h-12 bg-emerald-500 px-6 hover:bg-emerald-600"
//             >
//               Shorten
//             </Button>
//           </form>
//         </div>

//         <div className="mt-12 grid w-full grid-cols-1 gap-8 sm:grid-cols-3">
//           <div className="text-center">
//             <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
//               <LinkIcon className="h-6 w-6 text-emerald-500" />
//             </div>
//             <h3 className="mb-2 font-medium">Simple & Fast</h3>
//             <p className="text-sm text-gray-500">
//               Create short links with just one click, no registration required.
//             </p>
//           </div>
//           <div className="text-center">
//             <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
//               <svg
//                 className="h-6 w-6 text-emerald-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                 />
//               </svg>
//             </div>
//             <h3 className="mb-2 font-medium">Detailed Analytics</h3>
//             <p className="text-sm text-gray-500">
//               Track clicks, referrers, and geographic data for all your links.
//             </p>
//           </div>
//           <div className="text-center">
//             <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
//               <svg
//                 className="h-6 w-6 text-emerald-500"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//                 />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                 />
//               </svg>
//             </div>
//             <h3 className="mb-2 font-medium">Customizable</h3>
//             <p className="text-sm text-gray-500">
//               Create custom branded links with your own domain.
//             </p>
//           </div>
//         </div>
//       </main>

//       <footer className="w-full p-4 text-center text-sm text-gray-500">
//         <p>© {new Date().getFullYear()} shortIt. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

"use client";

import { LinkIcon, ClipboardCopy, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import copy from "clipboard-copy";
import { toast } from "sonner";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

interface UrlData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

export default function UrlBox() {
  const { data: session, status } = useSession();
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

  useEffect(() => {
    if (session?.user) {
      fetchUserUrls();
    } else {
      setIsLoadingUrls(false);
    }
  }, [session]);

  const fetchUserUrls = async () => {
    try {
      const res = await fetch("/api/urls");
      if (!res.ok) throw new Error("Failed to fetch URLs");
      const data = await res.json();
      setUrls(data.urls);
    } catch (error) {
      toast.error("Failed to load your URLs");
    } finally {
      setIsLoadingUrls(false);
    }
  };

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
      console.log(info);
      if (info.success) {
        setUrls((prev) => [info.url, ...prev]);
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
    <div className="flex min-h-screen flex-col items-center justify-between bg-white text-gray-900">
      <header className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-emerald-500" />
          <span className="text-xl font-bold">shortIt</span>
        </div>
        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="hidden text-sm transition-colors hover:text-emerald-500 sm:inline-block"
          >
            Features
          </a>
          {status === "authenticated" ? (
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          )}
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

        {status === "loading" ? (
          <div className="mt-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : !session?.user ? (
          <div className="mt-12 grid w-full grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <LinkIcon className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="mb-2 font-medium">Simple & Fast</h3>
              <p className="text-sm text-gray-500">
                Create short links with just one click, no registration
                required.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <svg
                  className="h-6 w-6 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-medium">Detailed Analytics</h3>
              <p className="text-sm text-gray-500">
                Track clicks, referrers, and geographic data for all your links.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <svg
                  className="h-6 w-6 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-medium">Customizable</h3>
              <p className="text-sm text-gray-500">
                Create custom branded links with your own domain.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-12 w-full">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your URLs</h2>
              <span className="text-sm text-gray-500">
                {session.user.email}
              </span>
            </div>
            {isLoadingUrls ? (
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              </div>
            ) : urls.length > 0 ? (
              <div className="space-y-4">
                {urls.map((url) => (
                  <div
                    key={url.id}
                    className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/${url.shortUrl}`}
                            target="_blank"
                            className="text-sm font-medium text-emerald-500 transition-colors hover:text-emerald-600"
                          >
                            {process.env.NEXT_PUBLIC_HOST_URL}/{url.shortUrl}
                          </Link>
                          <button
                            onClick={() =>
                              handleCopy(
                                `${process.env.NEXT_PUBLIC_HOST_URL}/${url.shortUrl}`,
                              )
                            }
                            className="rounded-md p-1 text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-emerald-500 group-hover:opacity-100"
                            aria-label="Copy to clipboard"
                          >
                            <ClipboardCopy size={16} />
                          </button>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 hover:text-gray-700"
                          >
                            <ExternalLink size={12} />
                            <span className="max-w-[200px] truncate">
                              {url.originalUrl}
                            </span>
                          </a>
                          <span>•</span>
                          <span>{url.clicks} clicks</span>
                          <span>•</span>
                          <span>
                            {new Date(url.createdAt).toLocaleDateString()}
                          </span>
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
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-100 bg-white p-8 text-center shadow-sm">
                <p className="text-gray-500">
                  No URLs created yet. Create your first one above!
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="w-full p-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} shortIt. All rights reserved.</p>
      </footer>
    </div>
  );
}
