import { NextResponse, NextRequest } from "next/server";
import moment from "moment";
import { decode, JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";
import { jwtDecode } from "jwt-decode";
import routes, { getAllRoutes } from "./helpers/routes";
import { generateAccessToken } from "./server-actions/user/actions";
import { refreshTokenAction } from "./server-actions/new-auth/new-auth";

const allRoute = getAllRoutes();

const zohoSchema = z.object({
  utm_source: z.string().min(1),
  utm_medium: z.string().min(1),
  utm_campaign: z.string().min(1),
  utm_term: z.string().min(1),
  utm_content: z.string().min(1),
});

export async function middleware(request: NextRequest) {
  /// zoho
  const newSearchParams = new URLSearchParams(request.nextUrl.searchParams);

  const data = zohoSchema.safeParse(Object.fromEntries(newSearchParams));

  if (data.success) {
    Object.keys(data.data).forEach((key) => {
      request.nextUrl.searchParams.delete(key);
    });

    const cookieObj = {
      utmSource: data.data.utm_source,
      utmMedium: data.data.utm_medium,
      utmCampaign: data.data.utm_campaign,
      utmTerm: data.data.utm_term,
      utmContent: data.data.utm_content,
    };
    const response = NextResponse.redirect(`${request.nextUrl.href}`);
    response.cookies.set("zoho", JSON.stringify(cookieObj));
    return response;
  }

  // Auth check

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

  // End Auth Check

  ///
  let refreshToken = request.cookies.get("jwt-refresh")?.value;
  if (refreshToken) {
    const decodedRefreshToken = jwtDecode(refreshToken);
    if (moment(decodedRefreshToken.exp! * 1000).isSameOrBefore(moment())) {
      refreshToken = undefined;
      response.cookies.delete("jwt");
      response.cookies.delete("jwt-refresh");
      response.cookies.delete("user");
    }
  }

  let isAuthed = !!refreshToken;

  let accessToken = request.cookies.get("jwt")?.value;
  if (accessToken) {
    const decodedAccessToken = jwtDecode(accessToken);
    if (moment(decodedAccessToken.exp! * 1000).isSameOrBefore(moment())) {
      accessToken = undefined;
      response.cookies.delete("jwt");
    }
  }

  let newAccessToken: string | null = null;

  if (refreshToken && !accessToken) {
    const req = await refreshTokenAction();
    if (req.data) {
      newAccessToken = req.data;
    } else {
      const emergencyResponse = NextResponse.redirect(new URL(`${routes.auth.url}/${routes.auth.signIn.url}`, request.nextUrl.origin));
      emergencyResponse.cookies.delete("jwt");
      emergencyResponse.cookies.delete("jwt-refresh");
      emergencyResponse.cookies.delete("user");
      return emergencyResponse;
    }
  }

  if (newAccessToken) {
    response.cookies.set("jwt", newAccessToken, { secure: true });
    response.headers.set("cookie", `${response.cookies.toString()} jwt=${newAccessToken}`);
    newAccessToken = null;
    isAuthed = true;
  }

  console.log(request.nextUrl.pathname);

  if (routeDetails?.protected && !isAuthed) {
    response = NextResponse.redirect(new URL(`${routes.auth.url}/${routes.auth.signIn.url}`, request.nextUrl.origin));
  }

  if (request.nextUrl.pathname.includes("auth") && isAuthed) {
    response = NextResponse.redirect(new URL(routes.home.url, request.nextUrl.origin));
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
