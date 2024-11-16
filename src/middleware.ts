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

  console.log(isAccessTokenValid, 11);

  if (decodedRefreshToken && isRefreshTokenValid && !isAccessTokenValid) {
    const { data, errorMessage } = await getAccessToken();

    if (data) {
      request.cookies.set("jwt", data);
    }
    if (errorMessage) {
      request.cookies.delete("jwt");
      request.cookies.delete("jwt-refresh");
      return NextResponse.redirect(
        new URL(`${routes.auth.url}/${routes.auth.signIn.url}?error=${JSON.stringify(errorMessage)}-api-error`, request.nextUrl.origin),
        { ...request }
      );
    }
  }

  if (decodedRefreshToken && !isRefreshTokenValid) {
    request.cookies.delete("jwt");
    request.cookies.delete("jwt-refresh");
    return NextResponse.redirect(
      new URL(
        `${routes.auth.url}/${routes.auth.signIn.url}?error=${JSON.stringify(decodedRefreshToken)}-refresh-error`,
        request.nextUrl.origin
      ),
      { ...request }
    );
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

  if (routeDetails?.protected && !request.cookies.get("jwt")) {
    const response = NextResponse.redirect(new URL(`${routes.auth.url}/${routes.auth.signIn.url}`, request.nextUrl.origin), { ...request });
    if (!isAuthed) {
      response.cookies.delete("jwt");
      response.cookies.delete("jwt-refresh");
    } else {
      response.cookies.set("jwt-refresh", request.cookies.get("jwt-refresh")?.value!);
      response.cookies.set("jwt", request.cookies.get("jwt")?.value!);
    }
    return response;
  }

  // update token after subscription change
  // if (request.nextUrl.pathname === routes.user.subscription.fullUrl && request.nextUrl.searchParams.get("success")) {
  //   const { data } = await refreshToken();
  //   if (data) {
  //     const decodedToken = jwtDecode(data) as { exp: number };
  //     const maxAgeInSeconds = moment.duration(moment.unix(decodedToken.exp).diff(moment(new Date()))).asSeconds();
  //     const response = NextResponse.redirect(new URL(routes.user.subscription.fullUrl, request.nextUrl.origin));
  //     response.cookies.set({
  //       name: "jwt",
  //       value: data,
  //       httpOnly: true,
  //       secure: true,
  //       maxAge: maxAgeInSeconds,
  //     });
  //     return response;
  //   }
  // }

  if (request.nextUrl.pathname.includes("auth") && request.cookies.get("jwt")) {
    const response = NextResponse.redirect(new URL(routes.home.url, request.nextUrl.origin), { ...request });
    if (!isAuthed) {
      response.cookies.delete("jwt");
      response.cookies.delete("jwt-refresh");
    } else {
      response.cookies.set("jwt-refresh", request.cookies.get("jwt-refresh")?.value!);
      response.cookies.set("jwt", request.cookies.get("jwt")?.value!);
      return NextResponse.redirect(new URL(`${routes.auth.url}/${routes.auth.signIn.url}?error=unaresh-error`, request.nextUrl.origin), {
        ...request,
      });
    }
    return response;
  }

  const response = NextResponse.next();
  if (!isAuthed) {
    response.cookies.delete("jwt");
    response.cookies.delete("jwt-refresh");
    return NextResponse.redirect(new URL(`${routes.auth.url}/${routes.auth.signIn.url}?error=boloresh-error`, request.nextUrl.origin), {
      ...request,
    });
  }
  response.cookies.set("jwt-refresh", request.cookies.get("jwt-refresh")?.value!);
  response.cookies.set("jwt", request.cookies.get("jwt")?.value!);

  return response;
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
