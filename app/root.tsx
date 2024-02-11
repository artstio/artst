import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import NProgress from "nprogress";
import { useChangeLanguage } from "./hooks/use-change-language";
import { getTheme } from "./lib/theme.server";
import {
  ClientHintCheck,
  getHints,
  useNonce,
  useTheme,
} from "./lib/client-hints";
import { i18nCookie, remixI18Next } from "~/i18n";
import { createUserSession } from "~/services/auth/session.server";
import styles from "./tailwind.css";
import { Posthog } from "~/components/posthog";
import { ExposeAppConfig } from "~/components/expose-app-config";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [locale, cookieData] = await Promise.all([
    remixI18Next.getLocale(request),
    createUserSession(request),
  ]);
  return json(
    {
      appConfig: {
        googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
        // hotjarId: process.env.HOTJAR_ID,
        // cookieYesToken: process.env.COOKIEYES_TOKEN,
        isProduction: process.env.NODE_ENV === "production",
        visitorId: cookieData.visitorId,
        // version: packageJson.default.version,
        sentryDsn: process.env.SENTRY_DSN,
        posthogToken: process.env.POSTHOG_TOKEN,
        posthogApi: process.env.POSTHOG_API,
      },
      locale,
      requestInfo: {
        hints: getHints(request),
        userPrefs: {
          theme: getTheme(request),
        },
      },
    },
    {
      headers: {
        "Set-Cookie": cookieData.cookie,
      },
    }
  );
};

export const handle = {
  i18n: "common",
};

function Document({
  children,
  lang = "en",
  dir = "ltr",
  appConfig,
}: {
  children: React.ReactNode;
  lang?: string;
  dir?: any;
  appConfig?: {
    googleAnalyticsId?: string;
    hotjarId?: string;
    isProduction: boolean;
    sentryDsn?: string;
    visitorId: string;
    posthogToken: string;
    posthogApi: string;
  };
}) {
  const navigation = useNavigation();

  const theme = useTheme();
  const nonce = useNonce();

  useEffect(() => {
    if (navigation.state === "idle") NProgress.done();
    else NProgress.start();
  }, [navigation.state]);

  return (
    <html lang={lang} className={clsx(theme)} dir={dir}>
      {appConfig ? (
        <Posthog
          apiKey={appConfig.posthogToken}
          apiUrl={appConfig.posthogApi}
          visitorId={appConfig.visitorId}
        >
          <head>
            <ClientHintCheck nonce={nonce} />
            <ExposeAppConfig appConfig={appConfig} nonce={nonce} />
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <Meta />
            <Links />
          </head>
          <body>
            {children}
            <ScrollRestoration />
            <Scripts />
            {process.env.NODE_ENV === "development" && <LiveReload />}
          </body>
        </Posthog>
      ) : (
        <>
          <head>
            <ClientHintCheck nonce={nonce} />
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <Meta />
            <Links />
          </head>
          <body>
            {children}
            <ScrollRestoration />
            <Scripts />
            {process.env.NODE_ENV === "development" && <LiveReload />}
          </body>
        </>
      )}
    </html>
  );
}

export default function App() {
  const {
    appConfig,
    locale,
    // consentData,
  } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  useChangeLanguage(locale);

  return (
    <Document lang={locale} appConfig={appConfig}>
      <Outlet
        context={{
          appConfig: appConfig,
          locale: locale,
        }}
      />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <Document>
      {/* add the UI you want your users to see */}
      <Scripts />
    </Document>
  );
}
