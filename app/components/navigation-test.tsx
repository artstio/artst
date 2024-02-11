import type { User } from "@prisma/client";
import { Link, Form, useLocation } from "@remix-run/react";
import { MaxWidthWrapper } from "./page/max-width-wrapper";

type NavigationProps = {
  user: User | null;
};

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
          <span className="font-bold text-white">Artst</span>
          <div className="mx-1" />
          <small className="relative top-[2px] text-sm font-extrabold text-orange-200">
            beta
          </small>
        </Link>

        {/* Right Menu. */}
        <div className="flex flex-row items-center">
          <Link
            to="/plans"
            prefetch="intent"
            className="flex flex-row items-center text-sm font-semibold text-gray-400
					transition hover:text-gray-100 active:text-violet-200"
          >
            Subscription
          </Link>

          {!user && (
            <>
              <div className="mx-3" />
              <Link
                to="/login"
                className="flex h-10 flex-row items-center rounded-xl border border-gray-600 px-4 font-bold text-gray-200
					      transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80"
              >
                Login
              </Link>
            </>
          )}

          {/* Log Out Form Button. */}
          {user && (
            <>
              <div className="mx-3" />
              <Form action="/auth/logout" method="post">
                <button
                  className="flex h-10 flex-row items-center rounded-xl border border-gray-600 px-4 font-bold text-gray-200
					      transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80"
                >
                  Log Out
                </button>
              </Form>
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
