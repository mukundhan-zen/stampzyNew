
import { AddStampForm } from '@/components/forms/AddStampForm';
import { getCollections } from '@/actions/stamps';

export default async function AddStampPage() {
  const collections = await getCollections();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add New Stamp</h1>
        <p className="mt-2 text-muted-foreground">
          Add a new stamp to your collection with detailed information and valuation.
        </p>
      </div>
      
      <AddStampForm collections={collections} />
    </div>
  );
}
