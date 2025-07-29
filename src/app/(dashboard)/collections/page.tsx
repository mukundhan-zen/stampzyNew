import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Target, DollarSign, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getCollectionsWithStats } from '@/actions/collections';

export default async function CollectionsPage() {
  const collections = await getCollectionsWithStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Collections</h1>
          <p className="mt-2 text-muted-foreground">
            Organize your stamps into themed collections.
          </p>
        </div>
        <Button asChild>
          <Link href="/collections/new">
            <Plus className="mr-2 h-4 w-4" />
            New Collection
          </Link>
        </Button>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Collections Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start organizing your stamps by creating your first collection. Group stamps by country, theme, or any criteria you prefer.
            </p>
            <Button asChild>
              <Link href="/collections/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Collection
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      <Link 
                        href={`/collections/${collection.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {collection.name}
                      </Link>
                    </CardTitle>
                    {collection.theme && (
                      <Badge variant="secondary" className="mt-2">
                        {collection.theme}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link href={`/collections/${collection.id}/edit`}>
                        <Edit className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
                {collection.description && (
                  <CardDescription className="mt-2">
                    {collection.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Stamps Count */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Stamps</span>
                    </div>
                    <span className="font-medium">{collection.stamps_count}</span>
                  </div>

                  {/* Target Progress */}
                  {collection.target_count && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {collection.stamps_count}/{collection.target_count}
                        </span>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ 
                              width: `${Math.min(100, (collection.stamps_count / collection.target_count) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Budget */}
                  {collection.budget_limit && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Budget</span>
                      </div>
                      <span className="text-sm font-medium">
                        ${collection.budget_limit.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/collections/${collection.id}`}>
                        View Collection
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}