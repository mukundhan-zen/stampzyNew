import { notFound } from 'next/navigation';
import { CollectionDetail } from '@/components/collections/CollectionDetail';
import { getCollection, getCollectionStamps } from '@/actions/collections';

interface CollectionDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const [collectionResult, stampsResult] = await Promise.all([
    getCollection(params.id),
    getCollectionStamps(params.id, 1, 20)
  ]);

  if (!collectionResult.success || !collectionResult.data) {
    notFound();
  }

  return (
    <CollectionDetail 
      collection={collectionResult.data} 
      stamps={stampsResult.data}
    />
  );
}