'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2, Plus, Package, Target, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { deleteCollection } from '@/actions/collections';
import { toast } from 'sonner';
import { StampGrid } from '@/components/dashboard/StampGrid';
import type { Collection, Stamp } from '@/types';

interface CollectionDetailProps {
  collection: Collection & { stamps_count: number };
  stamps: Stamp[];
}

export function CollectionDetail({ collection, stamps }: CollectionDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/collections/${collection.id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCollection(collection.id);
      
      if (result.success) {
        toast.success('Collection deleted successfully');
        router.push('/collections');
      } else {
        toast.error(result.error || 'Failed to delete collection');
      }
    } catch (error) {
      toast.error('Failed to delete collection. Please try again.');
      console.error(error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return 'Invalid date';
    }
  };

  const progressPercentage = collection.target_count 
    ? Math.min(100, (collection.stamps_count / collection.target_count) * 100)
    : 0;

  const totalValue = stamps.reduce((sum, stamp) => sum + (stamp.current_valuation || 0), 0);
  const totalSpent = stamps.reduce((sum, stamp) => 
    sum + (stamp.purchase_price || 0) + (stamp.taxes || 0) + (stamp.shipping || 0), 0
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{collection.name}</h1>
            {collection.theme && (
              <Badge variant="secondary">{collection.theme}</Badge>
            )}
          </div>
          {collection.description && (
            <p className="text-muted-foreground">{collection.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Collection Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Collection Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Stamps</span>
                </div>
                <span className="font-semibold">{collection.stamps_count}</span>
              </div>

              {collection.target_count && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Target</span>
                    </div>
                    <span className="text-sm font-medium">{collection.target_count}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="font-semibold">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Spent</span>
                <span className="font-semibold">
                  ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {collection.budget_limit && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Budget</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${collection.budget_limit.toLocaleString()}
                    </p>
                    <p className={`text-xs ${
                      totalSpent > collection.budget_limit ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${(collection.budget_limit - totalSpent).toLocaleString()} remaining
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Collection Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Collection Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm text-foreground">{formatDate(collection.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm text-foreground">{formatDate(collection.updated_at)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href={`/add-stamp?collection=${collection.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stamp to Collection
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stamps Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Stamps in Collection ({collection.stamps_count})
            </h2>
            {stamps.length > 0 && (
              <Button variant="outline" size="sm" asChild>
                <a href={`/stamps?collection=${collection.id}`}>
                  View All
                </a>
              </Button>
            )}
          </div>

          {stamps.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Stamps Yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  This collection doesn't have any stamps yet. Start adding stamps to build your collection.
                </p>
                <Button asChild>
                  <a href={`/add-stamp?collection=${collection.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Stamp
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <StampGrid stamps={stamps} />
          )}
        </div>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Collection"
        description="Are you sure you want to delete this collection? This action cannot be undone. Stamps in this collection will not be deleted, but they will no longer be organized in this collection."
        itemName={collection.name}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}