import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import routes, { getAllRoutes } from "./helpers/routes";
import { getUserAction } from "./server-actions/user-actions";

const allRoute = getAllRoutes();

export async function middleware(request: NextRequest) {
  const user = request.nextUrl.searchParams.get("logout") ? null : await getUserAction();

  if (allRoute?.[request.nextUrl.pathname]?.protected && !user) {
    return NextResponse.redirect(new URL(`${routes.auth.url}/${routes.auth.signIn.url}`, request.nextUrl.origin));
  }
  if (request.nextUrl.pathname.includes("auth") && user) {
    return NextResponse.redirect(new URL(routes.home.url, request.nextUrl.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
