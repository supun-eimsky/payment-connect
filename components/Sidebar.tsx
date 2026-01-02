'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, Users ,Camera} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'User Management', path: '/users' },
    { icon: Camera, label: 'Trip Management', path: '/trips' },
   
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)]">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};