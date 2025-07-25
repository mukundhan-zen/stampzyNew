'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface FilterValues {
  country: string | null;
  year: string | null; // Use string to handle input value
  valueRange: [number, number];
}

interface FilterComponentProps {
  initialFilters?: Partial<FilterValues>;
  onFilterChange: (filters: FilterValues) => void;
  className?: string;
}

const mockCountries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France'];

const defaultValueRange: [number, number] = [0, 5000];

export function FilterComponent({
  initialFilters,
  onFilterChange,
  className,
}: FilterComponentProps) {
  const [filters, setFilters] = useState<FilterValues>({
    country: initialFilters?.country || null,
    year: initialFilters?.year || null,
    valueRange: initialFilters?.valueRange || defaultValueRange,
  });

  const handleCountryChange = (country: string) => {
    const newFilters = { ...filters, country };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, year: event.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleValueRangeChange = (value: [number, number]) => {
    const newFilters = { ...filters, valueRange: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterValues = {
      country: null,
      year: null,
      valueRange: defaultValueRange,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className={cn('p-4 border rounded-lg space-y-4', className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Country Filter */}
        <div className="space-y-2">
          <Label htmlFor="country-filter">Country</Label>
          <Select
            value={filters.country || ''}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger id="country-filter">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {mockCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <Label htmlFor="year-filter">Year</Label>
          <Input
            id="year-filter"
            type="number"
            placeholder="e.g., 1990"
            value={filters.year || ''}
            onChange={handleYearChange}
          />
        </div>

        {/* Value Range Filter */}
        <div className="space-y-2">
          <Label htmlFor="value-range-filter">
            Value Range: ${filters.valueRange[0]} - ${filters.valueRange[1]}
          </Label>
          <Slider
            id="value-range-filter"
            min={0}
            max={10000} // Assuming a max value
            step={100}
            value={filters.valueRange}
            onValueChange={handleValueRangeChange}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
