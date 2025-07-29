import { notFound } from 'next/navigation';
import { EditStampForm } from '@/components/forms/EditStampForm';
import { getStamp, getCollections } from '@/actions/stamps';

interface EditStampPageProps {
  params: {
    id: string;
  };
}

export default async function EditStampPage({ params }: EditStampPageProps) {
  const [stampResult, collections] = await Promise.all([
    getStamp(params.id),
    getCollections()
  ]);

  if (!stampResult.success || !stampResult.data) {
    notFound();
  }

  return (
    <EditStampForm 
      stamp={stampResult.data} 
      collections={collections}
    />
  );
}