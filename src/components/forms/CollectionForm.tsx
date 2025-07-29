'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { CollectionSchema } from '@/lib/schemas';
import { createCollection, updateCollection } from '@/actions/collections';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { Collection } from '@/types';

interface CollectionFormProps {
  collection?: Collection;
  onSuccess?: () => void;
}

export function CollectionForm({ collection, onSuccess }: CollectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const isEditing = !!collection;

  const form = useForm({
    resolver: zodResolver(CollectionSchema),
    defaultValues: {
      name: collection?.name || '',
      description: collection?.description || '',
      theme: collection?.theme || '',
      target_count: collection?.target_count || undefined,
      budget_limit: collection?.budget_limit || undefined,
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      let result;
      
      if (isEditing) {
        result = await updateCollection(collection.id, data);
      } else {
        result = await createCollection(data);
      }
      
      if (result.success) {
        toast.success(result.message);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/collections');
        }
      } else {
        toast.error(result.error || 'Failed to save collection');
      }
    } catch (error) {
      toast.error('Failed to save collection. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      router.push(`/collections/${collection.id}`);
    } else {
      router.push('/collections');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Collection' : 'Create Collection'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isEditing 
              ? `Update details for "${collection.name}"`
              : 'Create a new collection to organize your stamps'
            }
          </p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Details</CardTitle>
          <CardDescription>
            Provide information about your collection to help organize your stamps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., British Empire, Birds of the World"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this collection focuses on..."
                  rows={3}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme/Category</Label>
                <Input
                  id="theme"
                  placeholder="e.g., Country, Topic, Era, Condition"
                  {...register('theme')}
                />
                {errors.theme && (
                  <p className="text-sm text-destructive">{errors.theme.message}</p>
                )}
              </div>
            </div>

            {/* Goals & Limits */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Collection Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target_count">Target Number of Stamps</Label>
                  <Input
                    id="target_count"
                    type="number"
                    min="1"
                    placeholder="e.g., 100"
                    {...register('target_count', { valueAsNumber: true })}
                  />
                  {errors.target_count && (
                    <p className="text-sm text-destructive">{errors.target_count.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget_limit">Budget Limit ($)</Label>
                  <Input
                    id="budget_limit"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 500.00"
                    {...register('budget_limit', { valueAsNumber: true })}
                  />
                  {errors.budget_limit && (
                    <p className="text-sm text-destructive">{errors.budget_limit.message}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                These goals are optional and help you track your collection progress.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isEditing ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <Save className="h-4 w-4 mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {isEditing ? 'Save Changes' : 'Create Collection'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}