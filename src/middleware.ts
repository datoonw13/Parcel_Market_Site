import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import routes from "./helpers/routes";

const protectedRoutes = ["/user/profile"];

export function middleware(request: NextRequest) {
  if (protectedRoutes.includes(request.nextUrl.pathname) && !request.cookies.has("jwt")) {
    return NextResponse.redirect(new URL(routes.auth.signIn, request.nextUrl.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
