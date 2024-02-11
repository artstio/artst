import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "Artst" },
  {
    description: `A Stripe focused Remix Stack that integrates User Subscriptions, Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
  },
  {
    keywords:
      "remix, stripe, remix-stack, typescript, sqlite, postgresql, prisma, tailwindcss, fly.io",
  },
  { "og:title": "Artst" },
  { "og:type": "website" },
  { "og:url": "https://stripe-stack.fly.dev" },
  {
    "og:image":
      "https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Stripe-Thumbnail.png",
  },
  { "og:card": "summary_large_image" },
  { "og:creator": "@Artst" },
  { "og:site": "https://stripe-stack.fly.dev" },
  {
    "og:description": `A Stripe focused Remix Stack that integrates User Subscriptions, Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
  },
  {
    "twitter:image":
      "https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Stripe-Thumbnail.png",
  },
  { "twitter:card": "summary_large_image" },
  { "twitter:creator": "@Artst" },
  { "twitter:title": "Artst" },
  {
    "twitter:description": `A Stripe focused Remix Stack that integrates User Subscriptions, Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
  },
];

export default function Index() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      {/* Main. */}
    </main>
  );
}
