import type { MetadataRoute } from "next";
import { navItems, siteConfig } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  return navItems.map((item) => ({
    url: new URL(item.href, siteConfig.url).toString(),
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
