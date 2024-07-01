import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import routes, { getAllRoutes } from "./helpers/routes";

const allRoute = getAllRoutes();

export function middleware(request: NextRequest) {
  if (allRoute?.[request.nextUrl.pathname]?.protected && !request.cookies.has("jwt")) {
    return NextResponse.redirect(new URL(routes.auth.signIn.url, request.nextUrl.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
