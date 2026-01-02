"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface NavbarContextType {
  title: string
  breadcrumb: string
  setNavbarData: (title: string, breadcrumb: string) => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("Issued Tickets")
  const [breadcrumb, setBreadcrumb] = useState("Issued Tickets / Issued Tickets")

  const setNavbarData = (newTitle: string, newBreadcrumb: string) => {
    setTitle(newTitle)
    setBreadcrumb(newBreadcrumb)
  }

  return <NavbarContext.Provider value={{ title, breadcrumb, setNavbarData }}>{children}</NavbarContext.Provider>
}

export function useNavbar() {
  const context = useContext(NavbarContext)
  if (!context) {
    throw new Error("useNavbar must be used within NavbarProvider")
  }
  return context
}
