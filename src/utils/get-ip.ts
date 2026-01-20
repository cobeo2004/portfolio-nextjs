import "server-only";
import type { NextRequest } from "next/server";

export const getIp = (req: NextRequest) => {
  return (
    req.headers.get("ip") ||
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip")
  );
};
