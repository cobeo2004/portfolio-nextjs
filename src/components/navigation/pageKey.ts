// Maps a pathname to the key used by the menu, the header links and the menu previews.
export const pageKey = (pathname: string) => {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/work/syncnapse")) return "case";
  return pathname.split("/")[1] || "home";
};
