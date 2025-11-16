import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
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
import { api } from '@/utils/api';
import { toast } from '@/hooks/use-toast';

interface Category {
  _id: string;
  name: string;
}

export default function Items() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.categories || []);
    } catch (error: any) {
      toast({
        title: 'Error loading categories',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate(`/admin/categories/${categoryId}/items`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Menu Items</h2>
          <p className="text-muted-foreground">Select a category to view and manage items</p>
        </div>
        <Button
          onClick={() => navigate('/admin/items/add')}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card className="border-border bg-card backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-card-foreground">Select Category</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-10 bg-muted rounded animate-pulse" />
          ) : (
            <Select value={selectedCategory} onValueChange={handleCategorySelect}>
              <SelectTrigger className="w-full bg-background border-input text-foreground">
                <SelectValue placeholder="Choose a category to view items" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {categories.map((category) => (
                  <SelectItem
                    key={category._id}
                    value={category._id}
                    className="text-popover-foreground hover:bg-accent"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {!selectedCategory && !isLoading && (
            <div className="mt-8 text-center text-muted-foreground">
              <p>Select a category above to view and manage its items</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
