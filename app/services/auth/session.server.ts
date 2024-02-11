import { createCookieSessionStorage } from "@remix-run/node";
import type { Session } from "@remix-run/node";
import { v4 as uuid } from "uuid";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || "STRONG_SECRET"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export const getVisitorId = (session: Session, hostname: string) => {
  const existingId = session.get("visitorId");
  if (existingId) {
    return existingId as string;
  }
  const newId = hostname === "localhost" ? "localdev" : uuid();
  session.set("visitorId", newId);
  return newId;
};

export const getSessionFromRequest = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
};

export const getVisitorIdFromRequest = async (request: Request) => {
  // const user = await authenticatorX.isAuthenticated(request);
  const session = await getSessionFromRequest(request);
  // if (user) {
  //   session.set('visitorId', user.id);
  //   return user.id;
  // }
  const hostname = new URL(request.url).hostname;
  return getVisitorId(session, hostname);
};

export const createUserSession = async (request: Request) => {
  const session = await getSessionFromRequest(request);
  const id = getVisitorId(session, new URL(request.url).hostname);
  const cookie = await sessionStorage.commitSession(session);
  return { cookie: cookie, visitorId: id, session: session };
};
