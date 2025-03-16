import { defaultSignInAction, setAuthTokens, signUpUserAction, thirdPartyAuthAction } from "@/server-actions/auth/auth";
import { IUserSignUp } from "@/types/auth";
import { UserSource } from "@/types/common";

interface IDefaultAuthProps {
  email: string;
  password: string;
  remember: boolean;
  onError: (errorMessage: string) => void;
  onSuccess: (data: Awaited<ReturnType<typeof defaultSignInAction>>) => void;
}

interface IThirdPartyAuthProps {
  token: string;
  userSource: UserSource;
  remember: boolean;
  onError: (errorMessage: string) => void;
  onSuccess: (data: Awaited<ReturnType<typeof thirdPartyAuthAction>>) => void;
}

class AuthClient {
  private storage: Storage;

  constructor(storage: Storage = sessionStorage) {
    this.storage = storage;
  }

  /**
   * Retrieves the authentication redirect URL from storage.
   * @returns The redirect URL or null if not found.
   */
  getAuthRedirectUrl(): string | null {
    return this.storage.getItem("auth-redirect-url");
  }

  /**
   * Sets the authentication redirect URL in storage.
   * @param url - The URL to set.
   */
  setAuthRedirectUrl(url: string): void {
    this.storage.setItem("auth-redirect-url", url);
  }

  /**
   * Sets the authentication redirect URL in storage.
   */
  deleteAuthRedirectUrl(): void {
    this.storage.removeItem("auth-redirect-url");
  }

  /**
   * Handles default authentication.
   * @param data - Authentication data and callbacks.
   */
  static async defaultAuth(data: IDefaultAuthProps): Promise<void> {
    const { onError, onSuccess, remember, ...values } = data;
    const request = await defaultSignInAction(values);
    if (request.data) {
      setAuthTokens(request.data.refresh_token, request.data.access_token, remember);
      data.onSuccess(request);
    } else {
      data.onError(request.errorMessage!);
    }
  }

  /**
   * Handles third-party authentication.
   * @param data - Authentication data and callbacks.
   */
  static async thirdPartyAuth(data: IThirdPartyAuthProps): Promise<void> {
    const { onError, onSuccess, remember, ...rest } = data;
    const request = await thirdPartyAuthAction(rest);
    if (request.data) {
      setAuthTokens(request.data.refresh_token, request.data.access_token, remember);
      data.onSuccess(request);
    } else {
      data.onError(request.errorMessage!);
    }
  }

  /**
   * Handles third-party authentication.
   * @param data - Registration data and callbacks.
   */
  static async signUp(
    data: IUserSignUp & {
      userSource: UserSource;
      onError: (errorMessage: string) => void;
      onSuccess: (data: Awaited<ReturnType<typeof signUpUserAction>>) => void;
    }
  ): Promise<void> {
    const { onError, onSuccess, ...rest } = data;
    console.log(rest, data.userSource);
    const request = await signUpUserAction({ ...rest, userSource: data.userSource });
    console.log(request, 22);

    if (request.data) {
      data.onSuccess(request);
      // if (request.data.decodedAccessToken) {
      //   setAuthTokens(request.data.refresh_token, request.data.access_token, false);
      // }
    } else {
      data.onError(request.errorMessage!);
    }
  }
}

export default AuthClient;
