'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This will be replaced with real data later
const metrics = {
  totalStamps: 1254,
  totalCollections: 12,
  collectionValue: 8450.75,
  budgetSpent: 450.50,
};

export function DashboardMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stamps</CardTitle>
          {/* You can add an icon here */}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalStamps}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalCollections}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collection Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.collectionValue.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.budgetSpent.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
