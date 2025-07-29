import { StampGrid } from '@/components/dashboard/StampGrid';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Stamp } from '@/types';

// Sample data for development - this will be replaced with real data from the database
const sampleStamps: Stamp[] = [
  {
    id: '1',
    user_id: '1',
    collection_id: null,
    title: 'Penny Black',
    country: 'United Kingdom',
    year: 1840,
    condition: 'mint',
    scott_catalog_number: '1',
    michel_catalog_number: null,
    stanley_gibbons_catalog_number: null,
    denomination: '1d',
    theme_subject: 'Queen Victoria',
    acquisition_date: '2024-01-15',
    purchase_price: 340,
    purchase_currency: 'USD',
    seller: 'Heritage Auctions',
    taxes: 0,
    shipping: 15,
    current_valuation: 400,
    valuation_currency: 'USD',
    valuation_date: '2024-01-01',
    notes: 'First adhesive postage stamp in the world',
    is_sold: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: '1',
    collection_id: null,
    title: 'Inverted Jenny',
    country: 'United States',
    year: 1918,
    condition: 'very_fine',
    scott_catalog_number: 'C3a',
    michel_catalog_number: null,
    stanley_gibbons_catalog_number: null,
    denomination: '24¢',
    theme_subject: 'Aviation',
    acquisition_date: null,
    purchase_price: 1350000,
    purchase_currency: 'USD',
    seller: null,
    taxes: 0,
    shipping: 0,
    current_valuation: 1350000,
    valuation_currency: 'USD',
    valuation_date: '2024-01-01',
    notes: 'Famous error stamp with upside-down airplane',
    is_sold: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back! Here's an overview of your stamp collection.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button asChild>
            <Link href="/add-stamp">
              <Plus className="mr-2 h-4 w-4" />
              Add Stamp
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <DashboardMetrics />

      {/* Recent Stamps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recent Stamps</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/stamps">View All</Link>
          </Button>
        </div>
        <StampGrid stamps={sampleStamps} />
      </div>
    </div>
  );
}
