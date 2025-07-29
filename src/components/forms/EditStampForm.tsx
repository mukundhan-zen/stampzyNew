'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save } from 'lucide-react';
import { StampSchema } from '@/lib/schemas';
import { updateStamp } from '@/actions/stamps';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { Collection, StampCondition, StampWithDetails } from '@/types';

interface EditStampFormProps {
  stamp: StampWithDetails;
  collections: Collection[];
}

const conditions: { value: StampCondition; label: string }[] = [
  { value: 'mint', label: 'Mint' },
  { value: 'very_fine', label: 'Very Fine' },
  { value: 'fine', label: 'Fine' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

export function EditStampForm({ stamp, collections }: EditStampFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(StampSchema),
    defaultValues: {
      title: stamp.title || '',
      country: stamp.country || '',
      year: stamp.year || new Date().getFullYear(),
      condition: stamp.condition || 'very_fine' as StampCondition,
      scott_catalog_number: stamp.scott_catalog_number || '',
      michel_catalog_number: stamp.michel_catalog_number || '',
      stanley_gibbons_catalog_number: stamp.stanley_gibbons_catalog_number || '',
      denomination: stamp.denomination || '',
      theme_subject: stamp.theme_subject || '',
      acquisition_date: stamp.acquisition_date || '',
      purchase_price: stamp.purchase_price || 0,
      purchase_currency: stamp.purchase_currency || 'USD',
      seller: stamp.seller || '',
      taxes: stamp.taxes || 0,
      shipping: stamp.shipping || 0,
      current_valuation: stamp.current_valuation || 0,
      valuation_currency: stamp.valuation_currency || 'USD',
      valuation_date: stamp.valuation_date || '',
      notes: stamp.notes || '',
      collection_id: stamp.collection_id || '',
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await updateStamp(stamp.id, data);
      
      if (result.success) {
        toast.success('Stamp updated successfully!');
        router.push(`/stamps/${stamp.id}`);
      } else {
        toast.error(result.error || 'Failed to update stamp');
      }
    } catch (error) {
      toast.error('Failed to update stamp. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/stamps/${stamp.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Stamp</h1>
          <p className="mt-2 text-muted-foreground">
            Update the details for "{stamp.title}"
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Details
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details about the stamp</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Stamp Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Penny Black"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  placeholder="e.g., United Kingdom"
                  {...register('country')}
                />
                {errors.country && (
                  <p className="text-sm text-destructive">{errors.country.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="1840"
                  {...register('year', { valueAsNumber: true })}
                />
                {errors.year && (
                  <p className="text-sm text-destructive">{errors.year.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select 
                  value={watch('condition')}
                  onValueChange={(value) => setValue('condition', value as StampCondition)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && (
                  <p className="text-sm text-destructive">{errors.condition.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="denomination">Denomination</Label>
                <Input
                  id="denomination"
                  placeholder="e.g., 1d, $0.50, 25¢"
                  {...register('denomination')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme_subject">Theme/Subject</Label>
                <Input
                  id="theme_subject"
                  placeholder="e.g., Queen Victoria, Birds, Space"
                  {...register('theme_subject')}
                />
              </div>
            </div>

            {collections.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="collection">Collection (Optional)</Label>
                <Select 
                  value={watch('collection_id') || ''}
                  onValueChange={(value) => setValue('collection_id', value || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Collection</SelectItem>
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Catalog Information */}
        <Card>
          <CardHeader>
            <CardTitle>Catalog Information</CardTitle>
            <CardDescription>Catalog numbers and references</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scott_catalog_number">Scott Number</Label>
                <Input
                  id="scott_catalog_number"
                  placeholder="e.g., 1, C3a"
                  {...register('scott_catalog_number')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="michel_catalog_number">Michel Number</Label>
                <Input
                  id="michel_catalog_number"
                  placeholder="e.g., 1"
                  {...register('michel_catalog_number')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stanley_gibbons_catalog_number">Stanley Gibbons</Label>
                <Input
                  id="stanley_gibbons_catalog_number"
                  placeholder="e.g., 1"
                  {...register('stanley_gibbons_catalog_number')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase & Valuation */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase & Valuation</CardTitle>
            <CardDescription>Financial information and current valuation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Purchase Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchase_price">Purchase Price</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('purchase_price', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase_currency">Currency</Label>
                  <Select 
                    value={watch('purchase_currency')}
                    onValueChange={(value) => setValue('purchase_currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquisition_date">Purchase Date</Label>
                  <Input
                    id="acquisition_date"
                    type="date"
                    {...register('acquisition_date')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seller">Seller/Source</Label>
                  <Input
                    id="seller"
                    placeholder="e.g., Heritage Auctions, eBay"
                    {...register('seller')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxes">Taxes</Label>
                  <Input
                    id="taxes"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('taxes', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping">Shipping</Label>
                  <Input
                    id="shipping"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('shipping', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Valuation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current_valuation">Current Value</Label>
                  <Input
                    id="current_valuation"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register('current_valuation', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valuation_currency">Currency</Label>
                  <Select 
                    value={watch('valuation_currency')}
                    onValueChange={(value) => setValue('valuation_currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valuation_date">Valuation Date</Label>
                  <Input
                    id="valuation_date"
                    type="date"
                    {...register('valuation_date')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Additional information about this stamp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this stamp..."
                rows={4}
                {...register('notes')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}