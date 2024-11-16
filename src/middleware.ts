import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import moment from "moment";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import routes, { getAllRoutes } from "./helpers/routes";
import { getAccessToken } from "./server-actions/user/actions";

const allRoute = getAllRoutes();

const checkAuth = async (request: NextRequest) => {
  const decodedAccessToken = decode(request.cookies.get("jwt")?.value || "");
  const isAccessTokenValid =
    typeof decodedAccessToken === "object" ? moment(new Date()).isBefore(moment.unix(Number(decodedAccessToken?.exp))) : false;

  const decodedRefreshToken = decode(cookies().get("jwt-refresh")?.value || "");
  const isRefreshTokenValid =
    typeof decodedRefreshToken === "object" ? moment(new Date()).isBefore(moment.unix(Number(decodedRefreshToken?.exp))) : false;

  if (decodedRefreshToken && isRefreshTokenValid && !isAccessTokenValid) {
    const { data, errorMessage } = await getAccessToken();

    if (data) {
      request.cookies.set("jwt", data);
    }
    if (errorMessage) {
      request.cookies.delete("jwt");
      request.cookies.delete("jwt-refresh");
    }
  }

  if (decodedRefreshToken && !isRefreshTokenValid) {
    request.cookies.delete("jwt");
    request.cookies.delete("jwt-refresh");
  }

  return isRefreshTokenValid;
};

export async function middleware(request: NextRequest) {
  const isAuthed = await checkAuth(request);

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

  if (routeDetails?.protected && !isAuthed) {
    return NextResponse.redirect(new URL(`${routes.auth.url}/${routes.auth.signIn.url}`, request.nextUrl.origin), { ...request });
  }

  if (request.nextUrl.pathname.includes("auth") && isAuthed) {
    return NextResponse.redirect(new URL(routes.home.url, request.nextUrl.origin), { ...request });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
