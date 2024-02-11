import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import clsx from "clsx";

// import { useTranslation } from "react-i18next";
// import NProgress from "nprogress";
import { ExposeAppConfig } from "~/components/expose-app-config";
import { Posthog } from "~/components/posthog";
import { createUserSession } from "~/services/auth/session.server";
import stylesheet from "~/tailwind.css";

import { useChangeLanguage } from "./hooks/use-change-language";
import {
  ClientHintCheck,
  getHints,
  useNonce,
  useTheme,
} from "./lib/client-hints";
import { getTheme } from "./lib/theme.server";
// import { remixI18Next } from "~/i18n";

// import { useTranslation } from "react-i18next";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [cookieData] = await Promise.all([
    // remixI18Next.getLocale(request),
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
      // locale,
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

export default function App() {
  const {
    appConfig,
    // locale,
    // consentData,
  } = useLoaderData<typeof loader>();
  const theme = useTheme();
  const nonce = useNonce();
  // const { i18n } = useTranslation();
  // console.log("locale", locale);
  // useChangeLanguage(locale);

  return (
    <html
      lang={'en'}
      className={clsx(theme)}
    >
      <Posthog
        apiKey={appConfig.posthogToken}
        apiUrl={appConfig.posthogApi}
        visitorId={appConfig.visitorId}
      >
        <head>
          <ClientHintCheck nonce={nonce} />
          <ExposeAppConfig appConfig={appConfig} nonce={nonce} />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <Outlet
            context={{
              appConfig: appConfig,
              // locale: locale,
            }}
          />
          <ScrollRestoration />
          <Scripts />
        </body>
      </Posthog>
    </html>
  );
}

// export function ErrorBoundary() {
//   const error = useRouteError();
//   console.error(error);
//   return (
//     <Document>
//       {/* add the UI you want your users to see */}
//       <Scripts />
//     </Document>
//   );
// }
