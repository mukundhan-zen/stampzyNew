'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { CollectionSchema } from '@/lib/schemas';
import type { Collection, CollectionFormData, ApiResponse } from '@/types';

/**
 * Create a new collection
 */
export async function createCollection(data: CollectionFormData): Promise<ApiResponse<Collection>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
        data: null as any,
      };
    }

    // Validate input
    const validatedData = CollectionSchema.parse(data);

    // Insert collection into database
    const { data: collection, error } = await supabase
      .from('collections')
      .insert({
        user_id: user.id,
        ...validatedData,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
        data: null as any,
      };
    }

    revalidatePath('/dashboard');
    revalidatePath('/collections');

    return {
      success: true,
      message: 'Collection created successfully',
      data: collection,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create collection',
      data: null as any,
    };
  }
}

/**
 * Update an existing collection
 */
export async function updateCollection(id: string, data: Partial<CollectionFormData>): Promise<ApiResponse<Collection>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
        data: null as any,
      };
    }

    // Validate input (partial validation for updates)
    const validatedData = CollectionSchema.partial().parse(data);

    // Update collection in database
    const { data: collection, error } = await supabase
      .from('collections')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
        data: null as any,
      };
    }

    revalidatePath('/dashboard');
    revalidatePath('/collections');
    revalidatePath(`/collections/${id}`);

    return {
      success: true,
      message: 'Collection updated successfully',
      data: collection,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update collection',
      data: null as any,
    };
  }
}

/**
 * Delete a collection
 */
export async function deleteCollection(id: string): Promise<ApiResponse<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
        data: null as any,
      };
    }

    // First, update all stamps in this collection to have no collection
    await supabase
      .from('stamps')
      .update({ collection_id: null })
      .eq('collection_id', id)
      .eq('user_id', user.id);

    // Delete collection from database
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return {
        success: false,
        error: error.message,
        data: null as any,
      };
    }

    revalidatePath('/dashboard');
    revalidatePath('/collections');

    return {
      success: true,
      message: 'Collection deleted successfully',
      data: undefined as any,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete collection',
      data: null as any,
    };
  }
}

/**
 * Get a single collection with stamps count
 */
export async function getCollection(id: string): Promise<ApiResponse<Collection & { stamps_count: number }>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
        data: null as any,
      };
    }

    // Get collection
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (collectionError) {
      return {
        success: false,
        error: collectionError.message,
        data: null as any,
      };
    }

    // Get stamps count for this collection
    const { count: stampsCount, error: countError } = await supabase
      .from('stamps')
      .select('*', { count: 'exact', head: true })
      .eq('collection_id', id)
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error getting stamps count:', countError);
    }

    return {
      success: true,
      data: {
        ...collection,
        stamps_count: stampsCount || 0,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get collection',
      data: null as any,
    };
  }
}

/**
 * Get all collections for the current user with stamps count
 */
export async function getCollectionsWithStats(): Promise<(Collection & { stamps_count: number })[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    // Get collections with stamps count
    const { data: collections, error } = await supabase
      .from('collections')
      .select(`
        *,
        stamps!collection_id(count)
      `)
      .eq('user_id', user.id)
      .order('name');

    if (error) {
      console.error('Error fetching collections:', error);
      return [];
    }

    // Transform the data to include stamps count
    return (collections || []).map(collection => ({
      ...collection,
      stamps_count: collection.stamps?.[0]?.count || 0,
    }));
  } catch (error) {
    console.error('Failed to get collections with stats:', error);
    return [];
  }
}

/**
 * Get stamps in a specific collection
 */
export async function getCollectionStamps(collectionId: string, page: number = 1, perPage: number = 20) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Authentication required');
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data: stamps, error, count } = await supabase
      .from('stamps')
      .select('*', { count: 'exact' })
      .eq('collection_id', collectionId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / perPage);

    return {
      data: stamps || [],
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: totalPages,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get collection stamps');
  }
}