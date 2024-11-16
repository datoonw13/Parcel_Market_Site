import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import moment from "moment";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import routes, { getAllRoutes } from "./helpers/routes";
import { getAccessToken } from "./server-actions/user/actions";
import { revalidateAllPath } from "./server-actions/subscription/actions";

const allRoute = getAllRoutes();

const checkRefreshToken = () => {
  const decodedRefreshToken = decode(cookies().get("jwt-refresh")?.value || "");
  const isRefreshTokenValid =
    typeof decodedRefreshToken === "object" ? moment(new Date()).isBefore(moment.unix(Number(decodedRefreshToken?.exp))) : false;

  return {
    decodedRefreshToken,
    isValid: isRefreshTokenValid,
  };
};

const checkAccessToken = (token?: string) => {
  if (!token) {
    return {
      isValid: false,
    };
  }
  const decodedAccessToken = decode(token);
  const isAccessTokenValid =
    typeof decodedAccessToken === "object" ? moment(new Date()).isBefore(moment.unix(Number(decodedAccessToken?.exp))) : false;
  return {
    isValid: isAccessTokenValid,
  };
};

export async function middleware(request: NextRequest) {
  const { isValid: isAuthed } = checkRefreshToken();

  if (isAuthed) {
    const { isValid: isAccessTokenValid } = checkAccessToken(request.cookies.get("jwt")?.value);

    if (!isAccessTokenValid) {
      const { data } = await getAccessToken();
      if (data) {
        request.cookies.set("jwt", data);
      } else {
        request.cookies.delete("jwt");
        request.cookies.delete("jwt-refresh");
      }
    }
  }

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

  let response = NextResponse.next();

  if (routeDetails?.protected && !isAuthed) {
    response = NextResponse.redirect(new URL(`${routes.auth.url}/${routes.auth.signIn.url}`, request.nextUrl.origin));
  }

  if (request.nextUrl.pathname.includes("auth") && isAuthed) {
    response = NextResponse.redirect(new URL(routes.home.url, request.nextUrl.origin));
  }

  if (request.cookies.get("jwt")?.value) {
    response.cookies.set({
      name: "jwt",
      value: request.cookies.get("jwt")!.value,
      httpOnly: true,
      secure: true,
    });
  }

  response.cookies.set({
    name: "test",
    value: request.cookies.get("jwt")?.value || "vermodzebna",
    httpOnly: true,
    secure: true,
  });

  return response;
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
