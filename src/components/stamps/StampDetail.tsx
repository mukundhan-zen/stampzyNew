'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2, Calendar, DollarSign, MapPin, Tag, Package, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { deleteStamp } from '@/actions/stamps';
import { toast } from 'sonner';
import type { StampWithDetails } from '@/types';

interface StampDetailProps {
  stamp: StampWithDetails;
}

export function StampDetail({ stamp }: StampDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/stamps/${stamp.id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteStamp(stamp.id);
      
      if (result.success) {
        toast.success('Stamp deleted successfully');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Failed to delete stamp');
      }
    } catch (error) {
      toast.error('Failed to delete stamp. Please try again.');
      console.error(error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return 'Invalid date';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'mint': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'very_fine': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'fine': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'good': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'fair': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'poor': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const profitLoss = (stamp.current_valuation || 0) - (stamp.purchase_price || 0) - (stamp.taxes || 0) - (stamp.shipping || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{stamp.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{stamp.country}</span>
            <span className="text-muted-foreground">•</span>
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{stamp.year}</span>
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Condition</label>
                  <div className="mt-1">
                    <Badge className={getConditionColor(stamp.condition)}>
                      {stamp.condition.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Denomination</label>
                  <p className="mt-1 text-foreground">{stamp.denomination || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Theme/Subject</label>
                  <p className="mt-1 text-foreground">{stamp.theme_subject || 'Not specified'}</p>
                </div>
                {stamp.collection && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Collection</label>
                    <p className="mt-1 text-foreground">{stamp.collection.name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Catalog Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Catalog Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scott Number</label>
                  <p className="mt-1 text-foreground">{stamp.scott_catalog_number || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Michel Number</label>
                  <p className="mt-1 text-foreground">{stamp.michel_catalog_number || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stanley Gibbons</label>
                  <p className="mt-1 text-foreground">{stamp.stanley_gibbons_catalog_number || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Purchase Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Purchase Price</label>
                  <p className="mt-1 text-foreground font-medium">
                    {stamp.purchase_price 
                      ? formatCurrency(stamp.purchase_price, stamp.purchase_currency)
                      : 'Not specified'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Purchase Date</label>
                  <p className="mt-1 text-foreground">{formatDate(stamp.acquisition_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Seller</label>
                  <p className="mt-1 text-foreground">{stamp.seller || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Additional Costs</label>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-foreground">
                      Taxes: {stamp.taxes ? formatCurrency(stamp.taxes, stamp.purchase_currency) : '$0.00'}
                    </p>
                    <p className="text-sm text-foreground">
                      Shipping: {stamp.shipping ? formatCurrency(stamp.shipping, stamp.purchase_currency) : '$0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {stamp.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{stamp.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Valuation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Valuation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Value</label>
                <p className="text-2xl font-bold text-foreground">
                  {stamp.current_valuation 
                    ? formatCurrency(stamp.current_valuation, stamp.valuation_currency)
                    : 'Not valued'
                  }
                </p>
                {stamp.valuation_date && (
                  <p className="text-xs text-muted-foreground">
                    As of {formatDate(stamp.valuation_date)}
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Investment</label>
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(
                    (stamp.purchase_price || 0) + (stamp.taxes || 0) + (stamp.shipping || 0),
                    stamp.purchase_currency
                  )}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Profit/Loss</label>
                <p className={`text-lg font-semibold ${
                  profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss, stamp.valuation_currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profitLoss >= 0 ? 'Gain' : 'Loss'} from investment
                </p>
              </div>

              {stamp.is_sold && (
                <div className="pt-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    SOLD
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Added</span>
                <span className="text-sm text-foreground">{formatDate(stamp.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm text-foreground">{formatDate(stamp.updated_at)}</span>
              </div>
              {stamp.images && stamp.images.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Images</span>
                  <span className="text-sm text-foreground">{stamp.images.length}</span>
                </div>
              )}
              {stamp.transactions && stamp.transactions.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transactions</span>
                  <span className="text-sm text-foreground">{stamp.transactions.length}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Stamp"
        description="Are you sure you want to delete this stamp? This action cannot be undone and will remove all associated data."
        itemName={stamp.title}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}