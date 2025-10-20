import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    {
      path: "/admin-dashboard",
      loginUrl: "/login-admin",
      role: "administrador",
    },
    { path: "/docente-dashboard", loginUrl: "/login-docente", role: "docente" },
    {
      path: "/estudiante-dashboard",
      loginUrl: "/login-estudiante",
      role: "estudiante",
    },
  ];

  for (const route of protectedRoutes) {
    if (pathname.startsWith(route.path)) {
      if (!token) {

        const loginUrl = new URL(route.loginUrl, request.url);
        loginUrl.searchParams.set("alert", "auth-required");
        loginUrl.searchParams.set("role", route.role);

        return NextResponse.redirect(loginUrl);
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/docente-dashboard/:path*",
    "/estudiante-dashboard/:path*",
  ],
};
