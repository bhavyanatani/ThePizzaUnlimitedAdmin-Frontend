import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import { toast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DailyOrderData {
  date: string;
  day: string;
  orders: number;
  revenue: number;
}

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  totalReservations: number;
  activeReservations: number;
  ordersByStatus: { status: string; count: number }[];
  dailyOrders?: DailyOrderData[];
}

// Status colors mapping
const STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b',      // Amber
  Preparing: '#3b82f6',    // Blue
  Ready: '#8b5cf6',         // Purple
  Completed: '#10b981',     // Green
  Cancelled: '#ef4444',     // Red
};

// Helper to get color for status
const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status] || '#6b7280';
};

// Helper to format status name for display
const formatStatusName = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await api.getOverview();
      // API returns the data object directly (already extracted from response.data)
      // Transform ordersByStatus to have consistent structure
      if (data.ordersByStatus && Array.isArray(data.ordersByStatus)) {
        data.ordersByStatus = data.ordersByStatus.map((item: any) => ({
          status: item._id || item.status || 'Unknown',
          count: item.count || 0,
        }));
      }
      setAnalytics(data);
    } catch (error: any) {
      toast({
        title: 'Error loading analytics',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-border bg-card backdrop-blur-xl animate-pulse">
              <CardHeader className="h-32" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All time orders</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl hover:shadow-lg hover:shadow-green-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">₹{analytics?.totalRevenue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reservations</CardTitle>
            <Calendar className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics?.totalReservations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All bookings</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Reservations</CardTitle>
            <Activity className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{analytics?.activeReservations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Current bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders by Status */}
        <Card className="border-border bg-card backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-card-foreground">Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.ordersByStatus || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry: any) => `${formatStatusName(entry.status)}: ${entry.count}`}
                  labelLine={false}
                >
                  {(analytics?.ordersByStatus || []).map((entry) => (
                    <Cell 
                      key={`cell-${entry.status}`} 
                      fill={getStatusColor(entry.status)} 
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    color: 'white',
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} orders`,
                    formatStatusName(name)
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => formatStatusName(value)}
                  wrapperStyle={{
                    color: '#9ca3af',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="border-border bg-card backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-card-foreground">Revenue Breakdown (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={analytics?.dailyOrders || []}
              >
                <XAxis 
                  dataKey="day" 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    color: 'white',
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'revenue') {
                      return [`₹${Number(value).toFixed(2)}`, 'Revenue'];
                    }
                    return [`${value}`, 'Orders'];
                  }}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Legend 
                  wrapperStyle={{
                    color: '#9ca3af',
                    fontSize: '12px',
                  }}
                  formatter={(value: string) => {
                    if (value === 'revenue') return 'Revenue';
                    if (value === 'orders') return 'Orders';
                    return value;
                  }}
                />
                <Bar 
                  dataKey="orders" 
                  fill="#f59e0b" 
                  radius={[8, 8, 0, 0]}
                  name="orders"
                  label={{ position: 'top', fill: '#9ca3af', fontSize: 11 }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#10b981" 
                  radius={[8, 8, 0, 0]}
                  name="revenue"
                  label={{ 
                    position: 'top', 
                    fill: '#9ca3af', 
                    fontSize: 11,
                    formatter: (value: number) => `₹${value.toFixed(0)}`
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
