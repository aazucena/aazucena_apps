import type { AuthClient } from "../authentication";
import type { AuthenticationMode, LoginOptions } from "@directus/sdk"
import {
  registerUser,
  registerUserVerify,
  inviteUser,
  acceptUserInvite,
  authenticateShare,
  inviteShare,
  readShareInfo,
  login,
  logout,
  refresh,
  passwordRequest,
  passwordReset,
  readProviders,
  generateTwoFactorSecret,
  enableTwoFactor,
  disableTwoFactor,
} from "@directus/sdk"
import { createRestHandler, runClientHandler } from "../utils";

export default function handleAuth<Schema>(client: AuthClient<Schema>) {
  const handler = createRestHandler(client);
  const loginFn = (email: string, password: string, options?: LoginOptions) => {
    if (client?.login) {
      return runClientHandler(() => client.login(email, password, options))
    }
    return handler(login(email, password, options))
  }
  const logoutFn = () => {
    if (client?.logout) {
      return runClientHandler(() => client.logout())
    }
    return handler(logout())
  }
  const refreshFn = (mode?: AuthenticationMode, refresh_token?: string) => {
    if (client?.refresh && (!mode || !refresh_token)) {
      return runClientHandler(() => client.refresh())
    }
    return handler(refresh(mode, refresh_token))
  }
  return {
    login: loginFn,
    logout: logoutFn,
    refresh: refreshFn,
    register: {
      user: (email: string, password: string, options?: { verification_url?: string; first_name?: string; last_name?: string; }) => handler(registerUser(email, password, options)),
      verify: (token: string) => handler(registerUserVerify(token)),
    },
    password: {
      request: (email: string, reset_url?: string) => handler(passwordRequest(email, reset_url)),
      reset: (token: string, password: string) => handler(passwordReset(token, password)),
    },
    invite: {
      user: (email: string, role: string, invite_url?: string) => handler(inviteUser(email, role, invite_url)),
      accept: (token: string, password: string) => handler(acceptUserInvite(token, password)),
    },
    share: {
      authenticate: (share: string, password?: string, mode?: AuthenticationMode) => handler(authenticateShare(share, password, mode)),
      invite: (share: string, emails: string[]) => handler(inviteShare(share, emails)),
      info: (id: string) => handler(readShareInfo(id)),
    },
    providers: {
      read: (sessionOnly?: boolean) => handler(readProviders(sessionOnly))
    },
    two_factor: {
      generate: (secret: string) => handler(generateTwoFactorSecret(secret)),
      enable: (secret: string, otp: string) => handler(enableTwoFactor(secret, otp)),
      disable: (otp: string) => handler(disableTwoFactor(otp)),
    }
  };
}