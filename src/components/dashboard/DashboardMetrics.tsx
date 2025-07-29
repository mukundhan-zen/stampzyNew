'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, Images, DollarSign, CreditCard, TrendingUp } from "lucide-react";

// This will be replaced with real data from server actions later
const metrics = {
  totalStamps: 1254,
  totalCollections: 12,
  collectionValue: 8450.75,
  budgetSpent: 450.50,
  totalSpent: 6220.30,
  profitLoss: 2230.45,
};

export function DashboardMetrics() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Stamps
          </CardTitle>
          <Badge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {metrics.totalStamps.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Across all collections
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Collections
          </CardTitle>
          <Images className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {metrics.totalCollections}
          </div>
          <p className="text-xs text-muted-foreground">
            Organized collections
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Value
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(metrics.collectionValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total collection valuation
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Profit/Loss
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            metrics.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.profitLoss >= 0 ? '+' : ''}{formatCurrency(metrics.profitLoss)}
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics.profitLoss >= 0 ? 'Gain' : 'Loss'} from purchases
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
