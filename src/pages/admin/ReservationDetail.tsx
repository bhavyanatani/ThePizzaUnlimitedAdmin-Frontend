import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Calendar, Clock, Users, User } from 'lucide-react';
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

interface ReservationDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  peopleCount: number;
  date: string;
  time: string;
  status: string;
  specialRequest?: string;
  createdAt: string;
}

const statusFlow = ['pending', 'confirmed', 'completed'];
const allowedTransitions: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export default function ReservationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) loadReservation();
  }, [id]);

  const loadReservation = async () => {
    try {
      const data = await api.getReservation(id!);
      // Backend returns { success: true, reservation: { ... } }
      const reservationData = data.reservation || data;
      // Transform reservation - backend uses _id, frontend expects id
      const transformedReservation = {
        ...reservationData,
        id: reservationData._id || reservationData.id,
        status: reservationData.status?.toLowerCase() || 'pending', // Convert to lowercase for UI
      };
      setReservation(transformedReservation);
    } catch (error: any) {
      toast({
        title: 'Error loading reservation',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await api.updateReservationStatus(id!, newStatus);
      toast({ title: 'Reservation status updated successfully' });
      loadReservation();
    } catch (error: any) {
      toast({
        title: 'Error updating reservation status',
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

  if (!reservation) {
    return <div className="text-center py-12 text-muted-foreground">Reservation not found</div>;
  }

  const currentStatusIndex = statusFlow.indexOf(reservation.status);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/reservations')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reservation Details</h2>
          <p className="text-muted-foreground">Booking #{reservation.id.slice(0, 8)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reservation Details */}
        <Card className="border-border bg-card backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Guest Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-amber-400 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Guest Name</p>
                  <p className="font-medium text-foreground">{reservation.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-amber-400 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Party Size</p>
                  <p className="font-medium text-foreground">{reservation.peopleCount} people</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-amber-400 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(reservation.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-400 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">{reservation.time}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{reservation.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{reservation.phone}</p>
              </div>
              {reservation.specialRequest && (
                <div>
                  <p className="text-sm text-muted-foreground">Special Requests:</p>
                  <p className="font-medium text-foreground">{reservation.specialRequest}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Management */}
        <div className="space-y-6">
          <Card className="border-border bg-card backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-card-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={reservation.status}
                onValueChange={handleStatusChange}
                disabled={isUpdating || allowedTransitions[reservation.status]?.length === 0}
              >
                <SelectTrigger className="bg-background border-input text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {allowedTransitions[reservation.status]?.map((status) => (
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
