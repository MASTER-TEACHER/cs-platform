import type { Metadata } from "next";
import LandingPage from "./landing/page";

/*
 * The home page shows the public landing page, rendered on the server so
 * search engines and link previews can read it. Signed-in users are sent
 * to their portal by RequireCourse once their account has loaded.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default LandingPage;
