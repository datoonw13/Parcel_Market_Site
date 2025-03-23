import { NextResponse, NextRequest } from "next/server";
import moment from "moment";
import { decode, JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";
import routes, { getAllRoutes } from "./helpers/routes";
import { generateAccessToken } from "./server-actions/user/actions";

const allRoute = getAllRoutes();

const checkAuth = async () => {
  const refreshToken = cookies().get("jwt-refresh")?.value || null;
  const refreshTokenExpireDate = refreshToken && Number((decode(refreshToken) as JwtPayload).exp);
  const isRefreshTokenValid = refreshTokenExpireDate ? moment(new Date()).isBefore(moment.unix(refreshTokenExpireDate)) : false;

  return !!isRefreshTokenValid;
};

const checkAccessToken = async () => {
  const accessToken = cookies().get("jwt")?.value || null;
  const accessTokenExpireDate = accessToken && Number((decode(accessToken) as JwtPayload).exp);
  const isAccessTokenValid = accessTokenExpireDate ? moment(new Date()).isBefore(moment.unix(accessTokenExpireDate)) : false;

  if (!isAccessTokenValid) {
    const { data, errorMessage } = await generateAccessToken();
    if (data) {
      return {
        data,
        error: false,
      };
    }
    if (errorMessage) {
      return {
        data: null,
        error: true,
      };
    }
  }

  return {
    error: false,
    data: null,
  };
};

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

  const isAuthed = await checkAuth();

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
  console.log(routeDetails, isAuthed);
  if (routeDetails?.protected && !isAuthed) {
    response = NextResponse.redirect(new URL(`${routes.auth.url}/${routes.auth.signIn.url}`, request.nextUrl.origin));
  }

  if (request.nextUrl.pathname.includes("auth") && isAuthed) {
    response = NextResponse.redirect(new URL(routes.home.url, request.nextUrl.origin));
  }

  // const checkAccessTokenResult = await checkAccessToken();

  // if ((!isAuthed && cookies().has("jwt-refresh")) || checkAccessTokenResult.error) {
  //   if (cookies().has("jwt")) {
  //     response.cookies.delete("jwt");
  //   }
  //   if (cookies().has("jwt-refresh")) {
  //     response.cookies.delete("jwt-refresh");
  //   }
  // }

  // if (checkAccessTokenResult.data) {
  //   response.cookies.set("jwt", checkAccessTokenResult.data);
  // }

  return response;
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
