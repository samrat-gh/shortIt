"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Chrome } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginModel() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email/password login logic here
    console.log("Email login:", { email, password });

    try {
      const result = await signIn("credentials", {
        email,
        password,
      });

      console.log(result);
    } catch (err) {
      console.log(err);
    }
    setOpen(false);
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log("Google login initiated");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="border-0 shadow-2xl sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center text-2xl font-semibold text-gray-900">
            Welcome back
          </DialogTitle>
          <DialogDescription className="text-center text-base text-gray-500">
            Sign in to your account to continue
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Google Login Button */}
          <Button
            variant="outline"
            className="h-12 w-full border-gray-200 font-medium text-gray-700 hover:bg-gray-50"
            onClick={handleGoogleLogin}
          >
            <Chrome className="mr-3 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-200 pl-10 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-gray-200 pl-10 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-green-500 hover:text-green-600"
              >
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-lg bg-green-500 font-medium text-white hover:bg-green-600"
            >
              Sign in
            </Button>
          </form>

          <div className="text-center text-sm text-gray-500">
            {"Don't have an account? "}
            <Button
              variant="link"
              className="h-auto p-0 text-sm font-medium text-green-500 hover:text-green-600"
            >
              Sign up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
