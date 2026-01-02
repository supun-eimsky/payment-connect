'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Users, Ticket, BarChart3 } from 'lucide-react';
import { DashboardStats as StatsType } from '@/types';

interface DashboardStatsProps {
  stats: StatsType;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Ticket className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings}</div>
          <p className="text-xs text-gray-500">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
          <Bus className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeBuses}</div>
          <p className="text-xs text-gray-500">3 new this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <BarChart3 className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-gray-500">+8% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
          <Users className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayBookings}</div>
          <p className="text-xs text-gray-500">Updated 5 min ago</p>
        </CardContent>
      </Card>
    </div>
  );
};