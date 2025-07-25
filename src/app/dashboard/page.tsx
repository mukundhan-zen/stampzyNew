'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchInput } from '@/components/dashboard/SearchInput';
import { FilterComponent, FilterValues } from '@/components/dashboard/FilterComponent';
import { CollectionList } from '@/components/dashboard/CollectionList';
import { StampList } from '@/components/dashboard/StampList';
import type { Collection, Stamp } from '@/lib/database.types';

// TODO: Protect this route for authenticated users only.

export const metadata = {
  title: 'Dashboard | Stamp Collection Tracker',
  description: 'An overview of your stamp collection.',
};

// Mock data - replace with actual data fetching
const mockCollections: Collection[] = Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 1}`,
    title: `Collection ${i + 1}`,
    description: `Description for collection ${i + 1}`,
    user_id: '123',
    stamp_ids: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}));

const mockStamps: Stamp[] = Array.from({ length: 50 }, (_, i) => ({
    id: `stamp-${i + 1}`,
    user_id: '123',
    collection_id: `${(i % 10) + 1}`,
    title: `Stamp ${i + 1}`,
    country: i % 2 === 0 ? 'USA' : 'UK',
    year: 1950 + i,
    condition: i % 3 === 0 ? 'Mint' : 'Used',
    valuation: 100 + i * 10,
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
}));

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues | null>(null);

  const filteredCollections = useMemo(() => {
    if (!searchQuery) return mockCollections;
    return mockCollections.filter((collection) =>
      collection.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredStamps = useMemo(() => {
    return mockStamps.filter((stamp) => {
      const searchMatch = !searchQuery || stamp.title.toLowerCase().includes(searchQuery.toLowerCase());
      const countryMatch = !filters?.country || stamp.country === filters.country;
      const yearMatch = !filters?.year || (stamp.year && stamp.year.toString() === filters.year);
      const valueMatch =
        !filters?.valueRange ||
        (stamp.valuation &&
          stamp.valuation >= filters.valueRange[0] &&
          stamp.valuation <= filters.valueRange[1]);

      return searchMatch && countryMatch && yearMatch && valueMatch;
    });
  }, [searchQuery, filters]);


  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="flex-grow"
        />
        <FilterComponent onFilterChange={setFilters} />
      </div>

      <Tabs defaultValue="collections" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="stamps">Stamps</TabsTrigger>
        </TabsList>

        <TabsContent value="collections">
            <CollectionList collections={filteredCollections} isLoading={false} />
        </TabsContent>

        <TabsContent value="stamps">
            <StampList stamps={filteredStamps} isLoading={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
