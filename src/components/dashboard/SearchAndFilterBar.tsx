
'use client';

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    country: string;
    year: string;
    valueRange: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  onClearFilters: () => void;
}

export function SearchAndFilterBar({ 
    searchTerm, 
    onSearchChange, 
    filters, 
    onFilterChange, 
    onClearFilters 
}: SearchAndFilterBarProps) {

  const handleClear = () => {
    onClearFilters();
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
                 <label htmlFor="search" className="sr-only">Search</label>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                        id="search"
                        placeholder="Search by title, country, year..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <Select value={filters.country} onValueChange={(value) => onFilterChange('country', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by Country" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Mauritius">Mauritius</SelectItem>
                    <SelectItem value="Sweden">Sweden</SelectItem>
                    <SelectItem value="British Guiana">British Guiana</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filters.year} onValueChange={(value) => onFilterChange('year', value)}>
                 <SelectTrigger>
                    <SelectValue placeholder="Filter by Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1840-1899">1840-1899</SelectItem>
                    <SelectItem value="1900-1949">1900-1949</SelectItem>
                    <SelectItem value="1950-present">1950-Present</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="mt-4 flex justify-end">
            <Button variant="ghost" onClick={handleClear} className="text-sm">
                <X className="h-4 w-4 mr-2"/>
                Clear Filters
            </Button>
        </div>
    </div>
  );
}
