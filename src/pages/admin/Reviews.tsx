import { useEffect, useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadReviews();
  }, [page]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await api.getReviews(page, 20);
      // Backend returns { success: true, reviews: [...], currentPage, totalPages, etc. }
      const reviewsList = data.reviews || [];
      // Transform reviews - backend uses _id, frontend expects id
      const transformedReviews = reviewsList.map((review: any) => ({
        ...review,
        id: review._id || review.id,
      }));
      setReviews(transformedReviews);
    } catch (error: any) {
      toast({
        title: 'Error loading reviews',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.deleteReview(id);
      toast({ title: 'Review deleted successfully' });
      loadReviews();
    } catch (error: any) {
      toast({
        title: 'Error deleting review',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reviews Management</h2>
        <p className="text-muted-foreground">View and moderate customer reviews</p>
      </div>

      <Card className="border-border bg-card backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-card-foreground">All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No reviews found</div>
          ) : (
            <>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{review.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(review.id)}
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mb-3">{renderStars(review.rating)}</div>

                    <p className="text-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>

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
                  disabled={reviews.length < 20}
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
