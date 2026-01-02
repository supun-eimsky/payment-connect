import type React from "react"
import { BarChart3, CreditCard, Wallet, Ticket } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: string
    chart?: React.ReactNode
    subCards?: Array<{
        icon: React.ReactNode
        label: string
        value: string
    }>
}

function StatCard({ icon, label, value, chart, subCards }: StatCardProps) {
    return (
        <div className="rounded-2xl bg-gradient-to-r from-[#0F90EE] to-[#276CCC] p-6 text-white">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white/20 p-2">{icon}</div>
                        <span className="text-sm font-medium opacity-90">{label}</span>
                    </div>
                    <p className="text-3xl font-bold">{value}</p>
                </div>

            </div>

            {/* Sub Cards */}
            {subCards && (
                <div className="mt-4 flex gap-3">
                    {subCards.map((card, idx) => (
                        <div
                            key={idx}
                            className="flex flex-1 flex-col items-center gap-2 rounded-xl bg-white px-4 py-3 text-center"
                        >
                            <div className="text-blue-600">{card.icon}</div>
                            <p className="text-xs font-medium text-gray-600">{card.label}</p>
                            <p className="text-sm font-bold text-gray-900">{card.value}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
function StatCard2({ icon, label, value, chart, subCards }: StatCardProps) {
    return (
        <div className="rounded-2xl  text-white">


            {/* Sub Cards */}
            <div className="">
                <div
                    key={1}
                    className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-white px-2 py-2 pl-8 pr-8 text-center"
                >
                    <div className="text-blue-600">{icon}</div>
                    <p className="text-lg font-normal text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>

            </div>

        </div>
    )
}
export function TicketsCountCard() {
    return (
        <Card className="@container/card">
            <div className="flex bg-white pl-5.5 pr-5.5 rounded-2xl shadow-sm @xl/main:flex-row flex-col gap-8">
                <div className="rounded-2xl bg-gradient-to-r from-[#0F90EE] to-[#276CCC] p-4 text-white  sm:w-1/3">
                    <div className="flex items-center  justify-between pr-4 @xl/main:flex-row flex-col gap-6">
                        <div className="flex flex-col gap-2 ">
                            <div className="flex items-center gap-2 ">
                                <div className=""><img src="/icons/icon-ticket.svg" alt="Ticket Icon" className="h-7 w-7" /></div>
                                <span className="text-2xl font-normal text-[#EBEBEB] ">Total Tickets</span>
                            </div>
                            <p className="text-[40px] font-bold">10,000</p>
                        </div>
                        <div className="flex flex-col ">
                           <img src="/icons/total-ticket-chart.svg" alt="" />

                        </div>
                    </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-r from-[#0F90EE] to-[#276CCC] p-4 text-white  sm:w-2/3">
                    <div className="flex items-center  justify-between pr-4 @xl/main:flex-row flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className=""><img src="/icons/icon-usd-currency.svg" alt="Ticket Icon" className="h-7 w-7" /></div>
                                <span className="text-2xl font-normal text-[#EBEBEB]">Total Revenue</span>
                            </div>
                            <p className="text-[40px] font-bold">Rs.12,500</p>
                        </div>
                        <div className="flex flex-col pl-14">
                            <StatCard2
                                icon={<img src="/icons/icon-cash-payment.svg" alt="Ticket Icon" className="h-7 w-10" />}
                                label="Cash"
                                value="Rs.70,000"
                            />

                        </div>
                        <div className="flex flex-col">
                            <StatCard2
                                icon={<img src="/icons/icon-card-payment.svg" alt="Ticket Icon" className="h-7 w-10" />}
                                label="Card"
                                value="Rs.72,250"
                            />

                        </div>

                    </div>
                </div>
            </div>

        </Card>

    )
}
