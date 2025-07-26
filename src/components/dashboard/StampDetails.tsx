
'use client';

import { Stamp } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from 'next/image';
import { Button } from "../ui/button";

export function StampDetails({ stamp, children }: { stamp: Stamp, children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 overflow-y-auto">
        <SheetHeader>
          <div className="aspect-square relative mb-4">
            {/* <Image
              src={stamp.images[0]?.url || 'https://via.placeholder.com/300'}
              alt={stamp.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            /> */}
          </div>
          <SheetTitle className="text-2xl font-bold">{stamp.name}</SheetTitle>
          <div className="text-md text-gray-500 dark:text-gray-400">{stamp.country}, {stamp.year}</div>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Details</h3>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div className="font-medium text-gray-600 dark:text-gray-300">Condition:</div>
              <div>{stamp.condition}</div>
              <div className="font-medium text-gray-600 dark:text-gray-300">Value:</div>
              <div>{stamp.value ? `$${stamp.value.toFixed(2)}` : 'N/A'}</div>
            </div>
          </div>
          {stamp.description && (
            <div>
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{stamp.description}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">Notes</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {/* Add notes field here when available in the data model */}
              No notes available for this stamp.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
