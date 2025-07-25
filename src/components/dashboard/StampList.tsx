'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Stamp } from '@/lib/database.types';
import Image from 'next/image';

interface StampListProps {
  stamps: Stamp[];
  isLoading: boolean;
}

// Mock data for demonstration purposes
const mockStamps: Stamp[] = [
  {
    id: 'a',
    user_id: '123',
    collection_id: '1',
    title: 'Penny Black',
    country: 'United Kingdom',
    year: 1840,
    condition: 'Mint',
    valuation: 2500,
    currency: 'USD',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    catalog_numbers: null,
    denomination: null,
    theme: null,
    acquisition_date: null,
    purchase_price: null,
    seller: null,
    taxes: null,
    shipping: null,
    notes: null,
    images: null,
  },
  {
    id: 'b',
    user_id: '123',
    collection_id: '1',
    title: 'Inverted Jenny',
    country: 'United States',
    year: 1918,
    condition: 'Used',
    valuation: 1500000,
    currency: 'USD',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    catalog_numbers: null,
    denomination: null,
    theme: null,
    acquisition_date: null,
    purchase_price: null,
    seller: null,
    taxes: null,
    shipping: null,
    notes: null,
    images: null,
  },
  {
    id: 'c',
    user_id: '123',
    collection_id: '2',
    title: 'Apollo 11 Moon Landing',
    country: 'United States',
    year: 1969,
    condition: 'Mint',
    valuation: 5,
    currency: 'USD',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    catalog_numbers: null,
    denomination: null,
    theme: null,
    acquisition_date: null,
    purchase_price: null,
    seller: null,
    taxes: null,
    shipping: null,
    notes: null,
    images: null,
  },
];

export function StampList({ stamps = mockStamps, isLoading = false }: StampListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (stamps.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>You haven't added any stamps yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {stamps.map((stamp) => (
        <Card key={stamp.id} className="overflow-hidden">
          <div className="relative h-32 w-full">
            <Image
              // TODO: Replace with actual stamp image
              src={`https://picsum.photos/seed/${stamp.id}/200/200`}
              alt={`Image for ${stamp.title}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <CardContent className="p-2">
            <h3 className="font-semibold text-sm truncate">{stamp.title}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {stamp.country}, {stamp.year}
            </p>
            {stamp.valuation && (
              <p className="text-xs font-medium">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: stamp.currency || 'USD' }).format(stamp.valuation)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
