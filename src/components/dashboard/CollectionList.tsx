'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Collection } from '@/lib/database.types'; // Assuming you have this type
import Image from 'next/image';

interface CollectionListProps {
  collections: Collection[];
  isLoading: boolean;
}

// Mock data for demonstration purposes
const mockCollections: Collection[] = [
  {
    id: '1',
    title: 'British Classics',
    description: 'A collection of classic stamps from Great Britain.',
    user_id: '123',
    stamp_ids: ['a', 'b', 'c'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Space Exploration',
    description: 'Stamps celebrating the wonders of space.',
    user_id: '123',
    stamp_ids: ['d', 'e'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Birds of the World',
    description: 'A colorful collection of avian stamps.',
    user_id: '123',
    stamp_ids: ['f', 'g', 'h', 'i'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function CollectionList({ collections = mockCollections, isLoading = false }: CollectionListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>You haven't created any collections yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {collections.map((collection) => (
        <Card key={collection.id}>
          <CardHeader className="p-0">
            <div className="relative h-40 w-full">
              <Image
                // TODO: Replace with actual collection image
                src={`https://picsum.photos/seed/${collection.id}/400/300`}
                alt={`Image for ${collection.title}`}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{collection.title}</h3>
            <p className="text-sm text-muted-foreground">
              {collection.stamp_ids?.length || 0} stamps
            </p>
            {/* TODO: Add total value if available */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
