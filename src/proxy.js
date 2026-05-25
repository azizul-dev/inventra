import { NextResponse } from "next/server";

import { auth } from "./lib/auth";

import { headers } from "next/headers";

const adminRoutes = ["/add-inventory"];

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/add-inventory", "/inventory"],
};