/* eslint-disable @typescript-eslint/no-namespace */
// import type { LoaderFunctionArgs } from "@remix-run/server-runtime";

// declare module "@remix-run/node" {
// export interface LoaderArgs extends LoaderFunctionArgs {
//   context: { visitorId: string };
// }
// }

declare global {
  var ENV: ENV;

  interface AppConfig {
    googleAnalyticsId?: string;
    hotjarId?: string;
    // cookieYesToken: string;
    isProduction: boolean;
    visitorId: string;
    // version: string;
    sentryDsn?: string;
    posthogToken: string;
    posthogApi: string;
  }

  interface Window {
    ENV: {
      NODE_ENV: "development" | "production" | "test";
      BASE_URL: string;
      DEV_HOST_URL: string;
      PROD_HOST_URL: string;
    };
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      SESSION_SECRET: string;
      ENCRYPTION_SECRET: string;
      DATABASE_URL: string;

      BASE_URL: string;
      DEV_HOST_URL: string;
      PROD_HOST_URL: string;

      I18N_DEBUG: string;

      RESEND_API_KEY: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_ANALYTICS_ID: string;
      POSTHOG_TOKEN: string;
      POSTHOG_API: string;
      SENTRY_DSN: string;

      STRIPE_PUBLIC_KEY: string;
      STRIPE_SECRET_KEY: string;
      DEV_STRIPE_WEBHOOK_ENDPOINT: string;
      PROD_STRIPE_WEBHOOK_ENDPOINT: string;
      SPOTIFY_CLIENT_ID: string;
      SPOTIFY_CLIENT_SECRET: string;
    }
  }
}

/**
 * Exports shared environment variables.
 *
 * Shared envs are used in both `entry.server.ts` and `root.tsx`.
 * Do not share sensible variables that you do not wish to be included in the client.
 */
export function getSharedEnvs() {
  return {
    BASE_URL: process.env.BASE_URL,
    DEV_HOST_URL: process.env.DEV_HOST_URL,
    PROD_HOST_URL: process.env.PROD_HOST_URL,
  };
}

type ENV = ReturnType<typeof getSharedEnvs>;
