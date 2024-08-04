import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import routes, { getAllRoutes } from "./helpers/routes";
import { getUserAction, refreshToken } from "./server-actions/user/actions";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

const allRoute = getAllRoutes();

export async function middleware(request: NextRequest) {
  const user = request.nextUrl.searchParams.get("logout") ? null : await getUserAction();

  let routeDetails: any = null;

  if (allRoute?.[request.nextUrl.pathname]) {
    routeDetails = allRoute?.[request.nextUrl.pathname];
  } else {
    const url = request.nextUrl.pathname.split("/");
    url[url.length - 1] = ":id";
    if (allRoute?.[url.join("/")]) {
      routeDetails = allRoute?.[url.join("/")];
    }
  }

  if (routeDetails?.protected && !user) {
    return NextResponse.redirect(new URL(`${routes.auth.url}/${routes.auth.signIn.url}`, request.nextUrl.origin));
  }

  // update token after subscription change
  if (request.nextUrl.pathname === routes.user.subscription.fullUrl && request.nextUrl.searchParams.get("success")) {
    const { data } = await refreshToken();
    if(data) {
      const decodedToken = jwtDecode(data) as { exp: number };
      const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
      let response = NextResponse.redirect(new URL(routes.user.subscription.fullUrl, request.nextUrl.origin))
      response.cookies.set({
        name: "jwt",
        value: data,
        httpOnly: true,
        secure: true,
        maxAge: maxAgeInSeconds,
      })
      return response
    }
  }

  if (request.nextUrl.pathname.includes("auth") && user) {
    return NextResponse.redirect(new URL(routes.home.url, request.nextUrl.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
