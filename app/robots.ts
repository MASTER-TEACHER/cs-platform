import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Signed-in areas and APIs have nothing useful for search engines.
        disallow: [
          "/api/",
          "/admin",
          "/teacher$",
          "/teacher/",
          "/dashboard",
          "/onboarding",
          "/profile",
          "/notifications",
          "/assignments",
          "/teacher-verification",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
