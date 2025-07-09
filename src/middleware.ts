import { NextResponse } from "next/server";
import { auth } from "@/services/auth";
import store from "./redux/store";

export default auth(async (req) => {
  const session = req.auth?.user;
  const state = store.getState();

  const user = state.user.info;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (user?.type_user === "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const expiresIn = new Date(session.expires_in);
  const currentTime = new Date();

  if (currentTime > expiresIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
