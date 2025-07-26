import { LogoutButton } from '@/components/auth/LogoutButton';
import { StampGrid } from '@/components/dashboard/StampGrid';
import { Stamp } from '@/types';

const sampleStamps: Stamp[] = [
  {
    id: '1',
    name: 'Penny Black',
    country: 'United Kingdom',
    year: 1840,
    value: 340,
    images: [{ id: 'img1', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Penny_black.jpg/800px-Penny_black.jpg', stamp_id: '1', created_at: '' }],
    condition: 'Mint',
    user_id: '1',
    created_at: '',
    updated_at: ''
  },
  {
    id: '2',
    name: 'Inverted Jenny',
    country: 'United States',
    year: 1918,
    value: 1350000,
    images: [{ id: 'img2', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Inverted_Jenny.jpg/800px-Inverted_Jenny.jpg', stamp_id: '2', created_at: '' }],
    condition: 'Used',
    user_id: '1',
    created_at: '',
    updated_at: ''
  },
  {
    id: '3',
    name: 'Mauritius "Post Office"',
    country: 'Mauritius',
    year: 1847,
    value: 4000000,
    images: [],
    condition: 'Mint',
    user_id: '1',
    created_at: '',
    updated_at: ''
  },
  {
    id: '4',
    name: 'British Guiana 1c Magenta',
    country: 'British Guiana',
    year: 1856,
    value: 9480000,
    images: [],
    condition: 'Used',
    user_id: '1',
    created_at: '',
    updated_at: ''
  },
    {
    id: '5',
    name: 'Treskilling Yellow',
    country: 'Sweden',
    year: 1855,
    value: 2300000,
    images: [{ id: 'img5', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Treskilling_Yellow.jpg/800px-Treskilling_Yellow.jpg', stamp_id: '5', created_at: '' }],
    condition: 'Mint',
    user_id: '1',
    created_at: '',
    updated_at: ''
  },
];


export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Collection</h1>
          <LogoutButton />
        </div>
        <StampGrid stamps={sampleStamps} />
      </div>
    </div>
  );
}
