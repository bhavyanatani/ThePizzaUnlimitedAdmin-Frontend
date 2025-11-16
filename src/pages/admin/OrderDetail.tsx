import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface OrderDetail {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

const statusFlow = ['pending', 'preparing', 'ready', 'completed'];
const allowedTransitions: Record<string, string[]> = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await api.getOrder(id!);
      // Backend returns { success: true, order: { ... } }
      const orderData = data.order;
      
      // Transform order items - backend populates items.item, so we need to map it
      if (orderData.items && Array.isArray(orderData.items)) {
        orderData.items = orderData.items.map((orderItem: any, index: number) => {

          let item = orderItem.item;
          
          // Check if item is a string (ObjectId) - population might have failed
          if (typeof item === 'string') {
            console.warn(`Item at index ${index} is a string (ObjectId), population may have failed:`, item);
            return {
              _id: item || orderItem._id || `item-${index}`,
              name: 'Item Not Found',
              price: 0,
              quantity: orderItem.quantity || 1,
              imageUrl: '/placeholder.png',
              isDeleted: true,
            };
          }
          
          // If item is null or undefined, it means the item was deleted
          if (!item || typeof item !== 'object') {
            console.warn(`Item at index ${index} is null/undefined or not an object - item may have been deleted`);
            return {
              _id: orderItem._id || `deleted-${index}`,
              name: 'Deleted Item',
              price: 0,
              quantity: orderItem.quantity || 1,
              imageUrl: '/placeholder.png',
              isDeleted: true,
            };
          }
          
          // Item exists and is an object, extract all fields
          // Make sure we're accessing the correct fields from the populated item
          const itemId = item._id || item.id || orderItem._id;
          const itemName = item.name;
          const itemPrice = typeof item.price === 'number' ? item.price : 0;
          const itemImage = item.image || item.imageUrl;

          
          return {
            _id: itemId || `item-${index}`,
            name: itemName || 'Unknown Item',
            price: itemPrice,
            quantity: orderItem.quantity || 1,
            imageUrl: itemImage || '/placeholder.png',
            isDeleted: false,
          };
        });
      }
      
      // Convert status to lowercase for UI
      orderData.status = orderData.status?.toLowerCase() || 'pending';

      setOrder(orderData);
    } catch (error: any) {
      console.error('Error loading order:', error);
      toast({
        title: "Error loading order",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      // API will handle capitalization, but we pass lowercase for consistency
      await api.updateOrderStatus(id!, newStatus);
      toast({ title: 'Order status updated successfully' });
      loadOrder();
    } catch (error: any) {
      toast({
        title: 'Error updating order status',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-12 text-muted-foreground">Order not found</div>;
  }

  const currentStatusIndex = statusFlow.indexOf(order.status);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/orders')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Order #{order._id?.slice(0, 8)}</h2>
          <p className="text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <Card className="border-border bg-card backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items?.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                <img
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.name || "Unknown item"}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{item.name || "Unnamed Item"}</h4>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-400">
                    ₹{(item.price ?? 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ₹{((item.price ?? 0) * item.quantity).toFixed(2)} total
                  </p>
                </div>
              </div>
            ))}


            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="text-lg font-semibold text-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-amber-400">
                ₹{order.totalAmount?.toFixed(2) || '0.00'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Status Management */}
        <div className="space-y-6">
          <Card className="border-border bg-card backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-card-foreground">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
                disabled={isUpdating || allowedTransitions[order.status]?.length === 0}
              >
                <SelectTrigger className="bg-background border-input text-foreground">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {allowedTransitions[order.status]?.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="text-popover-foreground hover:bg-accent capitalize"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Timeline */}
              <div className="space-y-3 pt-4">
                {statusFlow.map((status, index) => (
                  <div key={status} className="flex items-center gap-3">
                    {index <= currentStatusIndex ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span
                      className={`capitalize ${
                        index <= currentStatusIndex ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
