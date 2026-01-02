import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px- @xl/main:grid-cols-2 @5xl/main:grid-cols-1">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Tickets</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
            1,250
          </CardTitle>
          <CardAction>
            <img src="/icons/total-ticket.svg" alt="Total Tickets" />
          </CardAction>
        </CardHeader>
        
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
            Rs.75,000
          </CardTitle>
          <CardAction>
            <img src="/icons/total-ticket.svg" alt="Total Tickets" />
          </CardAction>
        </CardHeader>
       
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Cash</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
            Rs.50,000
          </CardTitle>
          <CardAction>
            <img src="/icons/total-ticket.svg" alt="Total Tickets" />
          </CardAction>
        </CardHeader>
       
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Card</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
             Rs.75,000
          </CardTitle>
          <CardAction>
           <img src="/icons/total-ticket.svg" alt="Total Tickets" />
          </CardAction>
        </CardHeader>
        
      </Card>
    </div>
  )
}
