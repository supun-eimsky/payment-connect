'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from '@/components/Navbar';
import { NavbarProvider } from "@/context/navbar-context"

import { useAuth } from '@/hooks/useAuth';
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log('🔒 Dashboard layout check:', { isAuthenticated, loading, hasUser: !!user });

        if (!loading && !isAuthenticated) {
            console.log('❌ Not authenticated in dashboard layout, redirecting...');
            router.replace('/login');
        }
    }, [isAuthenticated, loading, router, user]);

    // Show loading while checking auth
    if (loading) {
        console.log('⏳ Dashboard layout - still loading auth...');
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if not authenticated
    if (!isAuthenticated) {
        console.log('❌ Not authenticated, returning null');
        return null;
    }

    console.log('✅ Authenticated, rendering dashboard layout');

    return (

        <div className="min-h-screen bg-gray-50" >
            <NavbarProvider>
              <Navbar />
            
            <div className="flex">
                <SidebarProvider 
                    style={
                        {
                            "--sidebar-width": "calc(var(--spacing) * 68)",
                            "--header-height": "calc(var(--spacing) * 12)",
                            backgroundColor: "rgb(236 239 251)",
                        } as React.CSSProperties
                            
                    }
                >
                    <AppSidebar variant="inset" style={{paddingLeft:"0px", paddingBottom:"0px"}} />

                    <SidebarInset >

                        {children}

                    </SidebarInset>

                </SidebarProvider>

            </div>
            </NavbarProvider>
        </div>
    );
}