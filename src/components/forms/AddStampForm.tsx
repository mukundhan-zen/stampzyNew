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
import { Badge, CalendarIcon, DollarSign, Package, ArrowRight, ArrowLeft } from 'lucide-react';
import { StampSchema } from '@/lib/schemas';
import { createStamp } from '@/actions/stamps';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { Collection, StampCondition } from '@/types';

interface AddStampFormProps {
  collections: Collection[];
}

const steps = [
  { id: 1, title: 'Basic Info', icon: Badge },
  { id: 2, title: 'Details', icon: Package },
  { id: 3, title: 'Purchase', icon: DollarSign },
  { id: 4, title: 'Review', icon: CalendarIcon },
];

const conditions: { value: StampCondition; label: string }[] = [
  { value: 'mint', label: 'Mint' },
  { value: 'very_fine', label: 'Very Fine' },
  { value: 'fine', label: 'Fine' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

export function AddStampForm({ collections }: AddStampFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(StampSchema),
    defaultValues: {
      title: '',
      country: '',
      year: new Date().getFullYear(),
      condition: 'very_fine' as StampCondition,
      scott_catalog_number: '',
      michel_catalog_number: '',
      stanley_gibbons_catalog_number: '',
      denomination: '',
      theme_subject: '',
      acquisition_date: '',
      purchase_price: 0,
      purchase_currency: 'USD',
      seller: '',
      taxes: 0,
      shipping: 0,
      current_valuation: 0,
      valuation_currency: 'USD',
      valuation_date: '',
      notes: '',
      collection_id: '',
    },
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = form;

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ['title', 'country', 'year', 'condition'];
      case 2:
        return ['denomination', 'theme_subject', 'scott_catalog_number'];
      case 3:
        return ['purchase_price', 'purchase_currency', 'acquisition_date'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createStamp(data);
      toast.success('Stamp added successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to add stamp. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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
                <Select onValueChange={(value) => setValue('condition', value as StampCondition)}>
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

            {collections.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="collection">Collection (Optional)</Label>
                <Select onValueChange={(value) => setValue('collection_id', value || '')}>
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
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

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Catalog Numbers</h3>
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
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
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
                <Select onValueChange={(value) => setValue('purchase_currency', value)}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="seller">Seller/Source</Label>
              <Input
                id="seller"
                placeholder="e.g., Heritage Auctions, eBay, Local dealer"
                {...register('seller')}
              />
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
                  <Select onValueChange={(value) => setValue('valuation_currency', value)}>
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
          </div>
        );

      case 4:
        const watchedValues = watch();
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this stamp..."
                rows={4}
                {...register('notes')}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Review Your Stamp</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{watchedValues.title || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="font-medium">{watchedValues.country || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-medium">{watchedValues.year || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="font-medium">{conditions.find(c => c.value === watchedValues.condition)?.label || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-px w-16 ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Stamp - Step {currentStep}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Start by entering the basic information about your stamp."}
            {currentStep === 2 && "Add detailed information and catalog numbers."}
            {currentStep === 3 && "Enter purchase and valuation details."}
            {currentStep === 4 && "Review and add any final notes."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent()}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Adding Stamp...
                    </>
                  ) : (
                    'Add Stamp'
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
