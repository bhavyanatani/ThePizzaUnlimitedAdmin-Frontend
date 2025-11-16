import { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  UtensilsCrossed,
  ShoppingCart,
  Calendar,
  Star,
  LogOut,
  User,
} from 'lucide-react';
import { clearAuthToken } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DarkModeToggle } from '@/components/DarkModeToggle';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: FolderTree, label: 'Menu Categories', path: '/admin/categories' },
  { icon: UtensilsCrossed, label: 'Menu Items', path: '/admin/items' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Calendar, label: 'Reservations', path: '/admin/reservations' },
  { icon: Star, label: 'Reviews', path: '/admin/reviews' },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const item = navItems.find((item) => currentPath.startsWith(item.path));
    return item?.label || 'Admin Dashboard';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar backdrop-blur-xl">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary shadow-lg shadow-primary/20'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-border p-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-xl font-bold text-foreground">{getPageTitle()}</h1>
              <p className="text-sm text-muted-foreground">{getCurrentDate()}</p>
            </div>
            <div className="flex items-center gap-4">
              <DarkModeToggle />
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};
