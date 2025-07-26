
'use server';

import { z } from 'zod';
import { createSupabaseServerClient } from '@/utils/supabase/server';

const stampSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  country: z.string().min(2, { message: "Country is required." }),
  year: z.coerce.number().min(1840, { message: "Year must be after 1840." }),
  condition: z.string(),
  denomination: z.string().min(1, { message: "Denomination is required." }),
  images: z.array(z.instanceof(File)).min(1, { message: "At least one image is required." }).max(3),
  // Optional fields
  catalogNumber: z.string().optional(),
  theme: z.string().optional(),
  acquisitionDate: z.date().optional(),
  purchasePrice: z.coerce.number().optional(),
  seller: z.string().optional(),
  taxes: z.coerce.number().optional(),
  shipping: z.coerce.number().optional(),
  currentValuation: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export async function addStamp(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: 'Authentication failed. Please log in again.',
    };
  }

  const rawFormData = Object.fromEntries(formData.entries());
  const images = formData.getAll('images').filter(f => f instanceof File && f.size > 0) as File[];
  
  const parsed = stampSchema.safeParse({
    ...rawFormData,
    images: images,
    year: rawFormData.year ? Number(rawFormData.year) : undefined,
    purchasePrice: rawFormData.purchasePrice ? Number(rawFormData.purchasePrice) : undefined,
    currentValuation: rawFormData.currentValuation ? Number(rawFormData.currentValuation) : undefined,
    taxes: rawFormData.taxes ? Number(rawFormData.taxes) : undefined,
    shipping: rawFormData.shipping ? Number(rawFormData.shipping) : undefined,
    acquisitionDate: rawFormData.acquisitionDate ? new Date(rawFormData.acquisitionDate as string) : undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Stubbed save logic
  console.log('--- Server Action: Add Stamp ---');
  console.log('User:', user.id);
  console.log('Validated Stamp Data:', parsed.data);
  console.log('Number of Images to upload:', parsed.data.images.length);
  // In a real implementation, you would now upload images to Supabase Storage
  // and then save the stamp metadata with image URLs to the database.

  return {
    success: true,
    message: 'Stamp successfully added!',
  };
}
