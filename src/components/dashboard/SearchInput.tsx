'use client';

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (value: string) => void;
  onClear?: () => void;
}

export function SearchInput({ value, onValueChange, onClear, className, ...props }: SearchInputProps) {
  const handleClear = () => {
    onValueChange('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search stamps or collections..."
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="pl-10 pr-10 h-10"
        aria-label="Search stamps or collections"
        {...props}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
