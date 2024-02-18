import type { User } from "@prisma/client";
import { Form, Link, useLocation } from "@remix-run/react";

import type { MaybeJsonified } from "~/utils/types";
import { MaxWidthWrapper } from "./page/max-width-wrapper";
import { Button, buttonVariants } from "./ui/button";

interface NavigationProps {
  user: MaybeJsonified<User> | null;
}

export function Navigation({ user }: NavigationProps) {
  const location = useLocation();

  return (
    <header>
      <MaxWidthWrapper className="z-10 m-auto my-0 flex max-h-[64px] min-h-[64px] w-full flex-row items-center justify-between bg-transparent">
        {/* Left Menu. */}
        <Link
          to={!user ? "/" : "/account"}
          prefetch="intent"
          className="flex flex-row items-center text-xl font-light text-gray-400 transition hover:text-gray-100 active:opacity-80"
        >
          <span className="font-bold text-primary">Artst</span>
          <div className="mx-1" />
          <small
            className="relative top-[2px] text-sm font-extrabold text-blue-700 dark:text-orange-200"
            aria-hidden
          >
            beta
          </small>
        </Link>

        {/* Right Menu. */}
        <div className="flex flex-row items-center">
          <Link
            to="/plans"
            prefetch="intent"
            className="flex flex-row items-center text-sm font-semibold text-secondary-foreground
					transition hover:text-primary active:text-violet-200"
          >
            Subscription
          </Link>

          {!user ? (
            <>
              <div className="mx-3" />
              <Link
                to="/login"
                className={buttonVariants({
                  variant: "outline",
                })}
              >
                Login
              </Link>
            </>
          ) : null}

          {/* Log Out Form Button. */}
          {user ? (
            <>
              <div className="mx-3" />
              <Form action="/auth/logout" method="post">
                <Button variant="outline">Log Out</Button>
              </Form>
            </>
          ) : null}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
