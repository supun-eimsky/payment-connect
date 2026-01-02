'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/components/DashboardStats';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/services/api';
import { DashboardStats as StatsType } from '@/types';


import { SiteHeader } from "@/components/site-header"
import { useNavbar } from "@/context/navbar-context"
import UnderConstructionDashboard from "@/components/section-cards"
import data from "./data.json"
export default function DashboardPage() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
 const { setNavbarData } = useNavbar()

  useEffect(() => {
 setNavbarData("Dashboard", "Dashboard ")
    const fetchStats = async () => {
      if (!token) return;
      
      try {
        const data = await apiService.getDashboardStats(token);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token,setNavbarData]);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div>
      {/* <SiteHeader /> */}
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <UnderConstructionDashboard />
            <div className="px-4 lg:px-6">
             
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}