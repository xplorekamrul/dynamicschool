// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import { User } from "@prisma/client";

// export async function middleware(request: NextRequest) {
//   const cookieKey =
//     process.env.NODE_ENV === "production"
//       ? "__Secure-authjs.session-token"
//       : "authjs.session-token";
//   const { pathname } = request.nextUrl;

//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET!,
//     salt: cookieKey,
//     cookieName: cookieKey,
//   });

//   const role: User["role"] | undefined = token?.role as User["role"] | undefined;
//   const requestUrl = String(request.url);

//   if (pathname.startsWith("/admin/login")) {
//     if (token) return NextResponse.redirect(new URL("/admin", requestUrl));
//     return NextResponse.next();
//   }

//   if (pathname.startsWith("/admin")) {
//     if (!token) return NextResponse.redirect(new URL("/admin/login", requestUrl));
//     if (role !== "ADMIN" && role !== "SUPER_ADMIN") return NextResponse.redirect(new URL("/admin/login", requestUrl));
//   }

//   if (pathname.startsWith("/sadmin")) {
//     if (!token) return NextResponse.redirect(new URL("/sadmin/login", requestUrl));
//     if (role !== "SUPER_ADMIN") return NextResponse.redirect(new URL("/sadmin", requestUrl));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/sadmin/:path*"],
// };



// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { User } from "@prisma/client";

export async function proxy(request: NextRequest) {
  const cookieKey =
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

  const { pathname, origin } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET!,
    salt: cookieKey,
    cookieName: cookieKey,
  });

  const role: User["role"] | undefined = token?.role as User["role"] | undefined;

  const isAdminArea = pathname.startsWith("/admin");
  const isSadminArea = pathname.startsWith("/sadmin");

  const isAdminLogin = pathname === "/admin/login";
  const isSadminLogin = pathname === "/sadmin/login";

  // Helpers
  const redirect = (to: string) => NextResponse.redirect(new URL(to, origin));

  // ---------- /admin ----------
  if (isAdminArea) {
    if (isAdminLogin) {
      if (!token) return NextResponse.next();
      return redirect("/admin");
    }

    // Protected admin pages
    if (!token) return redirect("/admin/login");

    // Only ADMIN or SUPER_ADMIN may proceed
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return redirect("/admin/login");
    }

    return NextResponse.next();
  }

  // ---------- /sadmin ----------
  if (isSadminArea) {
    if (isSadminLogin) {
      if (!token) return NextResponse.next();
      if (role === "SUPER_ADMIN") return redirect("/sadmin");
      if (role === "ADMIN") return redirect("/admin");
      return redirect("/sadmin/login");
    }

    if (!token) return redirect("/sadmin/login");

    // Only SUPER_ADMIN may access /sadmin/*
    if (role !== "SUPER_ADMIN") {
      if (role === "ADMIN") return redirect("/admin?error=forbidden");
      return redirect("/sadmin/login");
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/sadmin/:path*"],
};
