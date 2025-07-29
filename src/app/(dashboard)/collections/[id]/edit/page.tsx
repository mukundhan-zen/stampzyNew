import { notFound } from 'next/navigation';
import { CollectionForm } from '@/components/forms/CollectionForm';
import { getCollection } from '@/actions/collections';

interface EditCollectionPageProps {
  params: {
    id: string;
  };
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const result = await getCollection(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <CollectionForm collection={result.data} />;
}