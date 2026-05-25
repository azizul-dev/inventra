"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Better Auth-এর session hook
  const { data: session, isPending } = authClient.useSession();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signIn.email({
      email: user.email,
      password: user.password,
    });

    if (data) {
      toast.success("Login successfully");
      router.push("/");
    }
    if (error) {
      toast.error("Login Failed");
    }
  };

  const handleGoogleSignin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error("Google Error:", err);
      toast.error("Google Login Failed");
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.refresh();
  };

  // Loading state
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-sky-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  // Logged in state — নাম + logout বাটন
  if (session?.user) {
    const name = session.user.name || session.user.email;
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-sky-50 p-4">
        <Card className="w-full max-w-md overflow-hidden rounded-3xl border-0 shadow-2xl">
          <div className="h-2 bg-[linear-gradient(90deg,#8b5cf6,#06b6d4,#ec4899,#f59e0b,#8b5cf6)] bg-[length:300%_100%] animate-gradient" />

          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-black tracking-tight text-gray-900">
                Inventra
              </h1>
            </div>

            <div className="flex flex-col items-center gap-5">
              {/* Avatar */}
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-violet-100 text-violet-700 text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* নাম ও ইমেইল */}
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{session.user.name}</p>
                <p className="text-sm text-gray-500 mt-1">{session.user.email}</p>
              </div>

              {/* Dashboard বাটন */}
              <Button
                onClick={() => router.push("/")}
                className="h-12 w-full rounded-2xl text-base font-semibold"
              >
                Dashboard-এ যান
              </Button>

              {/* Logout বাটন */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="h-12 w-full rounded-2xl border text-red-500 hover:text-red-600 hover:border-red-300"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logged out state — login form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-sky-50 p-4">
      <Card className="w-full max-w-md overflow-hidden rounded-3xl border-0 shadow-2xl">
        <div className="h-2 bg-[linear-gradient(90deg,#8b5cf6,#06b6d4,#ec4899,#f59e0b,#8b5cf6)] bg-[length:300%_100%] animate-gradient" />

        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black tracking-tight text-gray-900">
              Inventra
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              আপনার ইনভেন্টরি ম্যানেজমেন্ট ড্যাশবোর্ডে লগইন করুন
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-12 rounded-2xl pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-12 rounded-2xl pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link href="#" className="font-medium text-violet-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-2xl text-base font-semibold cursor-pointer"
            >
              Login
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">অথবা</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignin}
              type="button"
              variant="outline"
              className="h-12 w-full rounded-2xl border cursor-pointer"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Google দিয়ে লগইন করুন
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;