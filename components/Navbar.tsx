import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search,Menu } from "lucide-react"
import { useNavbar } from "@/context/navbar-context"
import Link from "next/link"

export function Navbar() {
  const { title, breadcrumb } = useNavbar()

  return (
    <nav className="sticky top-0 z-50 w-full  [background:linear-gradient(90deg,#0F90EE_-10.85%,#276CCC_100%)]">
      <div className="flex h-20 items-center justify-between px-6 gap-1">
        {/* Logo */}
         <div className="flex items-center px-2 gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/logo/dashborad-main-logo.svg" alt="Logo" className="h-10 w-10" />
            <div className="text-lg font-Medium">
              <span className="text-white font-medium">Payment</span>
              <span className="text-white font-bold">Connect</span>
            </div>
          </Link>
        </div>
        {/* Notification Bell */}
        <div className="pl-10  hidden md:block ">
           <div className="h-9 w-9 text-white hover:bg-blue-700 flex items-center justify-center text-center">
            <Menu  className="h-5 w-5" />
          </div>
        </div>
         
        {/* Title and Breadcrumb */}
        <div className="flex-2 hidden md:block px-1">
          
          <h1 className="text-white font-bold text-xl">{title}</h1>
          <p className="text-blue-100 text-base text-base">{breadcrumb}</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 flex-1 md:flex-none ">
          <div className="relative hidden sm:block  w-[363px]" >
            <Input
              type="text"
              placeholder="Search"
              className="w-full h-10 pl-3 pr-9 rounded-full bg-white text-gray-900 placeholder:text-gray-500 border-0"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Notification Bell */}
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-blue-700">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
