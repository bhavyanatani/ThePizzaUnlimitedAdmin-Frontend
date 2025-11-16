import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  itemsCount: number;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  preparing: 'bg-blue-500/10 text-blue-400',
  ready: 'bg-purple-500/10 text-purple-400',
  completed: 'bg-green-500/10 text-green-400',
  cancelled: 'bg-red-500/10 text-red-400',
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getOrders(page, 20, statusFilter === 'all' ? undefined : statusFilter);
      // Backend returns { success: true, orders: [...], currentPage, totalPages, totalOrders }
      const ordersList = data.orders || [];
      // Transform orders to include itemsCount
      const transformedOrders = ordersList.map((order: any) => ({
        ...order,
        itemsCount: order.items?.length || 0,
        status: order.status?.toLowerCase() || 'pending', // Convert to lowercase for UI
      }));
      setOrders(transformedOrders);
    } catch (error: any) {
      toast({
        title: 'Error loading orders',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Orders Management</h2>
          <p className="text-muted-foreground">View and manage all customer orders</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-background border-input text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all" className="text-popover-foreground hover:bg-accent">All Orders</SelectItem>
            <SelectItem value="pending" className="text-popover-foreground hover:bg-accent">Pending</SelectItem>
            <SelectItem value="preparing" className="text-popover-foreground hover:bg-accent">Preparing</SelectItem>
            <SelectItem value="ready" className="text-popover-foreground hover:bg-accent">Ready</SelectItem>
            <SelectItem value="completed" className="text-popover-foreground hover:bg-accent">Completed</SelectItem>
            <SelectItem value="cancelled" className="text-popover-foreground hover:bg-accent">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border bg-card backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-card-foreground">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No orders found</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Order ID</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Total Amount</TableHead>
                    <TableHead className="text-muted-foreground">Items</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} className="border-border hover:bg-accent">
                      <TableCell className="font-medium text-foreground">#{order._id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${
                            statusColors[order.status] || statusColors.pending
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-amber-400 font-semibold">
                        ₹{order.totalAmount?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{order.itemsCount || 0} items</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-muted-foreground"
                >
                  Previous
                </Button>
                <span className="text-muted-foreground">Page {page}</span>
                <Button
                  variant="ghost"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={orders.length < 20}
                  className="text-muted-foreground"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
