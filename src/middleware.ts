import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import routes, { getAllRoutes } from "./helpers/routes";

const allRoute = getAllRoutes();

export function middleware(request: NextRequest) {
  if (allRoute?.[request.nextUrl.pathname]?.protected && !request.cookies.has("jwt")) {
    return NextResponse.redirect(new URL(routes.auth.signIn.url, request.nextUrl.origin));
  }
  if (request.nextUrl.pathname.includes("auth") && request.cookies.has("jwt")) {
    return NextResponse.redirect(new URL(routes.home.url, request.nextUrl.origin));
  }
  if (request.cookies.has("jwt") && !request.cookies.has("user")) {
    try {
      const user = jwtDecode(request.cookies.get("jwt")?.value!);
      const requestHeaders = new Headers(request.headers);
      requestHeaders.append("user", JSON.stringify(user));
      return NextResponse.next({ headers: requestHeaders });
    } catch (error) {}
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
