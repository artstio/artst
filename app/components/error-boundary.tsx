import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

import { Card } from "./ui/card";

export function ErrorBoundary() {
  const error = useRouteError();
  // When NODE_ENV=production:
  // error.message = "Unexpected Server Error"
  // error.stack = undefined

  console.log("error", error);
  if (isRouteErrorResponse(error)) {
    // error.status = 500
    // error.data = "Oh no! Something went wrong!"

    return (
      <Card>
        <h1>Oh no!</h1>
        <p>{error.data}</p>
      </Card>
    );
  }

  return null;
}
