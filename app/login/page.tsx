import { LoginForm } from "@/components/login-form"
import { cn } from "@/lib/utils"
export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-between bg-white px-8 py-12 sm:w-650/1452 sm:px-12 sm:py-12 object-contain sm:items-center sm:justify-center">
        <div style={{ width: "65%" }}>
          {/* Logo/Branding */}
          <div className="mb-6 grid-cols-2 sm:mb-4 sm:grid">
            <div className={cn("flex items-center space-x-2")}>
              {/* Blue Icon Box */}
             
                {/* Example PC icon using text — replace with your own SVG or logo */}
               <img src="/logo/main-logo.svg" alt="Payment Connect Logo" className="" />
              

              {/* Logo Text */}
              <div className="text-3xl font-Medium">
                <span className="text-black font-medium">Payment</span>
                <span className="text-black font-bold">Connect</span>
              </div>
            </div>
           



          </div>
          <div data-orientation="horizontal" role="none" data-slot="separator" className="bg-border mb-6 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"></div>

          {/* Form Section */}
          <div className="mb-8">
            <h2 className="text-sm text-gray-900">Login</h2>
            <p className="text-sm mt-2 text-gray-500">Enter your details below to login</p>
          </div>

          <LoginForm />

          <div className="text-sm text-gray-500">© 2025 
            <span className=" font-medium">Payment</span>
                <span className=" font-bold">Connect</span>
          </div>
        </div>

        {/* Footer */}


      </div>

      {/* Right side - Illustration */}
      <div className="hidden w-802/1452 bg-gradient-to-r from-[#0098FE] via-[#25BCDE] to-[#1583E9]  sm:flex sm:items-center sm:justify-center">
        <img
          src="/logo/login-page-logo1.png"
          alt="Bus driver with payment device"
          className=" object-contain"
            style={{width:"72%"}}
        />
      </div>
    </div>
  )
}
