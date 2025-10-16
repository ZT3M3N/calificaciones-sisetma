// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  console.log("Middleware ejecutado, token:", token);

  if (!token && req.nextUrl.pathname.startsWith("/admin-dashboard")) {
    return NextResponse.redirect(new URL("/login-admin", req.url));
  }

  return NextResponse.next();
}

// 🔹 Configuración correcta para App Router con carpetas de paréntesis
export const config = {
  matcher: ["/admin-dashboard/:path*", "/admin-dashboard"],
};
