'use client';

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
}

export function SearchInput({ 
  placeholder = "Search...", 
  value = "", 
  onChange, 
  onSearch,
  className 
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(value);

  const handleChange = (newValue: string) => {
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setSearchValue("");
    onChange?.("");
    onSearch?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch?.(searchValue);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pl-10 pr-10"
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}