import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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

export default function ItemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get('categoryId');

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: categoryIdFromUrl || '',
    name: '',
    price: '',
    description: '',
    imageFile: null as File | null,
    available: true,
  });

  useEffect(() => {
    loadCategories();
    if (id) loadItem();
  }, [id]);

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
    }
  };

  const loadItem = async () => {
    // If you want, I can help structure this later.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("price", formData.price);
      fd.append("description", formData.description);
      fd.append("available", formData.available.toString());

      if (!id) {
        fd.append("categoryId", formData.categoryId);
      }

      if (formData.imageFile instanceof File) {
        fd.append("image", formData.imageFile);
      }

      if (id) {
        await api.updateItem(id, fd);
        toast({ title: 'Item updated successfully' });
      } else {
        await api.createItem(formData.categoryId, fd);
        toast({ title: 'Item created successfully' });
      }

      navigate('/admin/items');
    } catch (error: any) {
      toast({
        title: 'Error saving item',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/items')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {id ? 'Edit Item' : 'Add New Item'}
          </h2>
          <p className="text-muted-foreground">
            {id ? 'Update item details' : 'Create a new menu item'}
          </p>
        </div>
      </div>

      <Card className="border-border bg-card backdrop-blur-xl max-w-2xl">
        <CardHeader>
          <CardTitle className="text-card-foreground">Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                required
              >
                <SelectTrigger className="bg-background border-input text-foreground">
                  <SelectValue placeholder="Select a category" />
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
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Name</Label>
              <Input
                id="name"
                placeholder='Name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background border-input text-foreground"
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder='Price'
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-background border-input text-foreground"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                placeholder='Description'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-background border-input text-foreground"
                rows={4}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-foreground">Upload Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, imageFile: e.target.files?.[0] || null })
                }
                className="bg-background border-input text-foreground"
                required={!id}
              />
            </div>

            {/* Available */}
            <div className="flex items-center justify-between">
              <Label htmlFor="available" className="text-foreground">Available</Label>
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, available: checked })
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/admin/items')}
                className="flex-1 bg-white hover:bg-red-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                {isLoading ? 'Saving...' : id ? 'Update Item' : 'Create Item'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
