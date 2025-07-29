import { notFound } from 'next/navigation';
import { StampDetail } from '@/components/stamps/StampDetail';
import { getStamp } from '@/actions/stamps';

interface StampDetailPageProps {
  params: {
    id: string;
  };
}

export default async function StampDetailPage({ params }: StampDetailPageProps) {
  const result = await getStamp(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <StampDetail stamp={result.data} />;
}