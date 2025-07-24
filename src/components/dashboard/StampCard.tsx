'use client';

import { Stamp } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import Link from "next/link";

export function StampCard({ stamp }: { stamp: Stamp }) {
  return (
    <Link href={`/stamps/${stamp.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="p-0">
          <div className="aspect-square relative">
            <Image
              src={stamp.images[0]?.url || 'https://via.placeholder.com/300'}
              alt={stamp.name}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-semibold truncate">{stamp.name}</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">{stamp.country}, {stamp.year}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
