import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import moment from "moment";
import { decode, JwtPayload } from "jsonwebtoken";
import routes, { getAllRoutes } from "./helpers/routes";
import { generateAccessToken } from "./server-actions/user/actions";

const allRoute = getAllRoutes();

const getTokens = async (request: NextRequest) => {
  // refresh token
  const refreshToken = request.cookies.get("jwt-refresh")?.value || null;
  const refreshTokenExpireDate = refreshToken && Number((decode(refreshToken) as JwtPayload).exp);
  const isRefreshTokenValid = refreshTokenExpireDate ? moment(new Date()).isBefore(moment.unix(refreshTokenExpireDate)) : false;

  if (!refreshToken) {
    return {
      access_token: null,
      refresh_token: null,
      removeTokens: false,
    };
  }

  if (refreshToken && !isRefreshTokenValid) {
    return {
      access_token: null,
      refresh_token: null,
      removeTokens: true,
    };
  }

  // access token
  const accessToken = request.cookies.get("jwt")?.value || null;
  const accessTokenExpireDate = accessToken && Number((decode(accessToken) as JwtPayload).exp);
  const isAccessTokenValid = accessTokenExpireDate ? moment(new Date()).isBefore(moment.unix(accessTokenExpireDate)) : false;

  if (isAccessTokenValid) {
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      removeTokens: false,
    };
  }

  if (!isAccessTokenValid) {
    const { data: newAccessToken, errorMessage } = await generateAccessToken();
    if (newAccessToken) {
      return {
        access_token: newAccessToken,
        refresh_token: refreshToken,
        removeTokens: false,
      };
    }
    return {
      access_token: null,
      refresh_token: null,
      removeTokens: true,
    };
  }

  return {
    access_token: null,
    refresh_token: null,
    removeTokens: false,
  };
};

export async function middleware(request: NextRequest) {
  const { access_token, refresh_token, removeTokens } = await getTokens(request);

  const isAuthenticated = !!(access_token && refresh_token);

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

  if (routeDetails?.protected && !isAuthenticated) {
    response = NextResponse.redirect(new URL(`${routes.auth.url}/${routes.auth.signIn.url}`, request.nextUrl.origin));
  }

  if (request.nextUrl.pathname.includes("auth") && isAuthenticated) {
    response = NextResponse.redirect(new URL(routes.home.url, request.nextUrl.origin));
  }

  if (access_token) {
    response.cookies.set({
      name: "jwt",
      value: access_token,
      httpOnly: true,
      secure: true,
    });
  }
  if (refresh_token) {
    response.cookies.set({
      name: "jwt-refresh",
      value: refresh_token,
      httpOnly: true,
      secure: true,
    });
  }

  const x = await fetch(`${process.env.API_URL}user/token/refresh`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      cookie: request.cookies.toString(),
    },
  });
  const s = await x.json();

  response.cookies.set(moment().format("HH:mm:ss"), JSON.stringify({ reason: "shemovida", s }));

  if (removeTokens) {
    // response.cookies.delete("jwt");
    // response.cookies.delete("jwt-refresh");
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
