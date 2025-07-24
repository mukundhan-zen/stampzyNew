'use client';

import { Stamp } from "@/types";
import { StampCard } from "./StampCard";

export function StampGrid({ stamps }: { stamps: Stamp[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {stamps.map((stamp) => (
        <StampCard key={stamp.id} stamp={stamp} />
      ))}
    </div>
  );
}
