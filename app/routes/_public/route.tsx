import { Outlet } from "@remix-run/react";
import { Footer } from "~/components/footer";

export default function Layout() {
  return (
    <>
      {/* Outlet. */}
      <Outlet />

      {/* Footer. */}
      <Footer />
    </>
  );
}
