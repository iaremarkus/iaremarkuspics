import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation
} from "@remix-run/react";
import { useEffect } from "react";
import * as gtag from "~/utils/gtags.client";

import styles from "./styles/app.css";

export let meta: MetaFunction = () => {
  return {
    title: `Photos by iaremarkus | cc IG: iaremarkuspics`,
    description: `Photography by iaremarkus. All photos are licensed under CC BY-NC-ND 4.0.`,
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1"
  };
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const loader = async () => {
  return json({ gaTrackingId: process.env.GA_TRACKING_ID });
};

export default function App() {
  const location = useLocation();
  const { gaTrackingId } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>

      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
