
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { StampSchema, StampSearchSchema } from '@/lib/schemas';
import type { 
  Stamp, 
  StampFormData, 
  StampWithDetails, 
  StampSearchParams, 
  ApiResponse,
  PaginatedResponse 
} from '@/types';

/**
 * Create a new stamp
 */
export async function createStamp(data: StampFormData): Promise<ApiResponse<Stamp>> {
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
    const validatedData = StampSchema.parse(data);

    // Insert stamp into database
    const { data: stamp, error } = await supabase
      .from('stamps')
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
    revalidatePath('/stamps');

    return {
      success: true,
      message: 'Stamp created successfully',
      data: stamp,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create stamp',
      data: null as any,
    };
  }
}

/**
 * Update an existing stamp
 */
export async function updateStamp(id: string, data: Partial<StampFormData>): Promise<ApiResponse<Stamp>> {
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
    const validatedData = StampSchema.partial().parse(data);

    // Update stamp in database
    const { data: stamp, error } = await supabase
      .from('stamps')
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
    revalidatePath('/stamps');
    revalidatePath(`/stamps/${id}`);

    return {
      success: true,
      message: 'Stamp updated successfully',
      data: stamp,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update stamp',
      data: null as any,
    };
  }
}

/**
 * Delete a stamp
 */
export async function deleteStamp(id: string): Promise<ApiResponse<void>> {
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

    // Delete stamp from database (cascade will handle images and transactions)
    const { error } = await supabase
      .from('stamps')
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
    revalidatePath('/stamps');

    return {
      success: true,
      message: 'Stamp deleted successfully',
      data: undefined as any,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete stamp',
      data: null as any,
    };
  }
}

/**
 * Get a single stamp with details
 */
export async function getStamp(id: string): Promise<ApiResponse<StampWithDetails>> {
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

    // Get stamp with collection and images
    const { data: stamp, error } = await supabase
      .from('stamps')
      .select(`
        *,
        collection:collections(*),
        images:stamp_images(*),
        transactions(*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
        data: null as any,
      };
    }

    return {
      success: true,
      data: stamp as StampWithDetails,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get stamp',
      data: null as any,
    };
  }
}

/**
 * Search and filter stamps
 */
export async function searchStamps(params: StampSearchParams): Promise<PaginatedResponse<Stamp>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Authentication required');
    }

    // Validate search parameters
    const validatedParams = StampSearchSchema.parse(params);
    const { query, country, year, condition, collection_id, min_value, max_value, is_sold, sort_by, sort_order, page, per_page } = validatedParams;

    // Build query
    let supabaseQuery = supabase
      .from('stamps')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    // Apply filters
    if (query) {
      supabaseQuery = supabaseQuery.textSearch('title', query);
    }

    if (country) {
      supabaseQuery = supabaseQuery.eq('country', country);
    }

    if (year) {
      supabaseQuery = supabaseQuery.eq('year', year);
    }

    if (condition) {
      supabaseQuery = supabaseQuery.eq('condition', condition);
    }

    if (collection_id) {
      supabaseQuery = supabaseQuery.eq('collection_id', collection_id);
    }

    if (min_value !== undefined) {
      supabaseQuery = supabaseQuery.gte('current_valuation', min_value);
    }

    if (max_value !== undefined) {
      supabaseQuery = supabaseQuery.lte('current_valuation', max_value);
    }

    if (is_sold !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_sold', is_sold);
    }

    // Apply sorting
    const ascending = sort_order === 'asc';
    supabaseQuery = supabaseQuery.order(sort_by, { ascending });

    // Apply pagination
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;
    supabaseQuery = supabaseQuery.range(from, to);

    const { data: stamps, error, count } = await supabaseQuery;

    if (error) {
      throw new Error(error.message);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / per_page);

    return {
      data: stamps || [],
      pagination: {
        page,
        per_page,
        total,
        total_pages: totalPages,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to search stamps');
  }
}

/**
 * Get user's stamps count by status
 */
export async function getStampsStats(): Promise<ApiResponse<{
  total: number;
  sold: number;
  available: number;
  total_value: number;
  total_spent: number;
}>> {
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

    // Get stamps statistics
    const { data: stats, error } = await supabase
      .from('stamps')
      .select('is_sold, current_valuation, purchase_price')
      .eq('user_id', user.id);

    if (error) {
      return {
        success: false,
        error: error.message,
        data: null as any,
      };
    }

    const total = stats.length;
    const sold = stats.filter(s => s.is_sold).length;
    const available = total - sold;
    const total_value = stats.reduce((sum, s) => sum + (s.current_valuation || 0), 0);
    const total_spent = stats.reduce((sum, s) => sum + (s.purchase_price || 0), 0);

    return {
      success: true,
      data: {
        total,
        sold,
        available,
        total_value,
        total_spent,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get stamps statistics',
      data: null as any,
    };
  }
}

/**
 * Get all collections for the current user
 */
export async function getCollections(): Promise<any[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: collections, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', user.id)
      .order('name');

    if (error) {
      console.error('Error fetching collections:', error);
      return [];
    }

    return collections || [];
  } catch (error) {
    console.error('Failed to get collections:', error);
    return [];
  }
}
