import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Reservation {
  id: string;
  name: string;
  peopleCount: number;
  date: string;
  time: string;
  status: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-green-500/10 text-green-400',
  completed: 'bg-blue-500/10 text-blue-400',
  cancelled: 'bg-red-500/10 text-red-400',
};

export default function Reservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadReservations();
  }, [page]);

  const loadReservations = async () => {
    setIsLoading(true);
    try {
      const data = await api.getReservations(page, 20);
      // Backend returns { success: true, reservations: [...], currentPage, totalPages, etc. }
      const reservationsList = data.reservations || [];
      // Transform reservations - backend uses _id, frontend expects id
      const transformedReservations = reservationsList.map((reservation: any) => ({
        ...reservation,
        id: reservation._id || reservation.id,
        status: reservation.status?.toLowerCase() || 'pending', // Convert to lowercase for UI
      }));
      setReservations(transformedReservations);
    } catch (error: any) {
      toast({
        title: 'Error loading reservations',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reservations Management</h2>
        <p className="text-muted-foreground">View and manage table reservations</p>
      </div>

      <Card className="border-border bg-card backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-card-foreground">All Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No reservations found</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">People</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground">Time</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id} className="border-border hover:bg-accent">
                      <TableCell className="font-medium text-foreground">{reservation.name}</TableCell>
                      <TableCell className="text-muted-foreground">{reservation.peopleCount} people</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(reservation.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{reservation.time}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${
                            statusColors[reservation.status] || statusColors.pending
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/admin/reservations/${reservation.id}`)}
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
                  disabled={reservations.length < 20}
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
