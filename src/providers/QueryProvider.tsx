"use client";

import { getQueryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import type React from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const qc = getQueryClient();
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
