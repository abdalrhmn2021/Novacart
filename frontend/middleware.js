import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const protectedRoutes = [
    "/profile",
    "/order",
    "/dashboard",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/order/:path*",
    "/dashboard/:path*",
  ],
};