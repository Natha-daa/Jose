"use client"

import { usePathname } from "next/navigation"

export function usePathnameClient() {
  return usePathname()
}
