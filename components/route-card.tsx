import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  route?: string
  date?: string
  badgeCount?: number
  badgeValue?: number
}

export function RouteCard({
  route = "Route 138 Colombo – Galle",
  date = "2025 -10-22 Monday",
  badgeCount = 1452,
  badgeValue = 80,
}: DashboardHeaderProps) {
  return (
    <div className="relative mb-6 rounded-2xl bg-gradient-to-r from-[#0F90EE] to-[#276CCC] px-6 py-4 text-white h-17 flex flex-col justify-center gap-4">
    

      {/* Content */}
      <div className="flex items-center justify-between  ">
        <h2 className="text-xl font-semibold">{route}</h2>
        <p className="text-xl font-medium">{date}</p>
      </div>
    </div>
  )
}
