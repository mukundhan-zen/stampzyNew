// ============================================================================
// CORE DATABASE TYPES
// ============================================================================

/**
 * User profile information linked to Supabase auth
 */
export type User = {
  id: string; // UUID
  full_name: string | null;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
};

/**
 * Collection to organize and group stamps
 */
export type Collection = {
  id: string; // UUID
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Stamp condition enum
 */
export type StampCondition = 'mint' | 'near_mint' | 'fine' | 'very_fine' | 'good' | 'poor';

/**
 * Individual stamp with comprehensive metadata
 */
export type Stamp = {
  id: string; // UUID
  user_id: string;
  collection_id: string | null;
  
  // Basic Information
  title: string;
  country: string | null;
  year: number | null;
  condition: StampCondition | null;
  
  // Catalog Information
  scott_catalog_number: string | null;
  michel_catalog_number: string | null;
  stanley_gibbons_catalog_number: string | null;
  denomination: string | null;
  theme_subject: string | null;
  
  // Purchase Information
  acquisition_date: string | null; // Date string
  purchase_price: number | null;
  purchase_currency: string;
  seller: string | null;
  taxes: number;
  shipping: number;
  
  // Valuation
  current_valuation: number | null;
  valuation_currency: string;
  valuation_date: string | null; // Date string
  
  // Additional Information
  notes: string | null;
  is_sold: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
};

/**
 * Image angle/view enum
 */
export type ImageAngle = 'front' | 'back' | 'detail' | 'watermark' | 'other';

/**
 * Images associated with stamps
 */
export type StampImage = {
  id: string; // UUID
  stamp_id: string;
  user_id: string;
  
  // Image Information
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  
  // Image Metadata
  angle: ImageAngle;
  description: string | null;
  is_primary: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
};

/**
 * Transaction type enum
 */
export type TransactionType = 'purchase' | 'sale';

/**
 * Purchase and sale transactions for stamps and collections
 */
export type Transaction = {
  id: string; // UUID
  user_id: string;
  stamp_id: string | null;
  collection_id: string | null;
  
  // Transaction Details
  type: TransactionType;
  transaction_date: string; // Date string
  amount: number;
  currency: string;
  
  // Additional Costs
  taxes: number;
  shipping: number;
  fees: number;
  
  // Party Information
  party_name: string | null;
  party_contact: string | null;
  
  // Transaction Details
  payment_method: string | null;
  reference_number: string | null;
  notes: string | null;
  
  // For sales: residual value calculation
  residual_value: number | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
};

// ============================================================================
// FORM TYPES
// ============================================================================

/**
 * Form data for creating/editing stamps
 */
export type StampFormData = {
  title: string;
  country?: string;
  year?: number;
  condition?: StampCondition;
  scott_catalog_number?: string;
  michel_catalog_number?: string;
  stanley_gibbons_catalog_number?: string;
  denomination?: string;
  theme_subject?: string;
  acquisition_date?: string;
  purchase_price?: number;
  purchase_currency?: string;
  seller?: string;
  taxes?: number;
  shipping?: number;
  current_valuation?: number;
  valuation_currency?: string;
  valuation_date?: string;
  notes?: string;
  collection_id?: string;
};

/**
 * Form data for creating/editing collections
 */
export type CollectionFormData = {
  title: string;
  description?: string;
};

/**
 * Form data for creating/editing transactions
 */
export type TransactionFormData = {
  type: TransactionType;
  transaction_date: string;
  amount: number;
  currency?: string;
  taxes?: number;
  shipping?: number;
  fees?: number;
  party_name?: string;
  party_contact?: string;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
  stamp_id?: string;
  collection_id?: string;
};

// ============================================================================
// VIEW TYPES (WITH RELATIONSHIPS)
// ============================================================================

/**
 * Stamp with its collection and images
 */
export type StampWithDetails = Stamp & {
  collection?: Collection;
  images: StampImage[];
  transactions: Transaction[];
};

/**
 * Collection with its stamps
 */
export type CollectionWithStamps = Collection & {
  stamps: Stamp[];
  stamp_count: number;
  total_value: number;
};

/**
 * Transaction with related stamp/collection data
 */
export type TransactionWithDetails = Transaction & {
  stamp?: Stamp;
  collection?: Collection;
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Search and filter parameters for stamps
 */
export type StampSearchParams = {
  query?: string;
  country?: string;
  year?: number;
  condition?: StampCondition;
  collection_id?: string;
  min_value?: number;
  max_value?: number;
  is_sold?: boolean;
  sort_by?: 'title' | 'country' | 'year' | 'created_at' | 'purchase_price' | 'current_valuation';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
};

/**
 * Dashboard metrics and statistics
 */
export type DashboardMetrics = {
  total_stamps: number;
  total_collections: number;
  total_spent: number;
  total_earned: number;
  current_value: number;
  profit_loss: number;
  recent_stamps: Stamp[];
  recent_transactions: Transaction[];
  value_by_country: { country: string; value: number; count: number }[];
  value_by_year: { year: number; value: number; count: number }[];
};

/**
 * API response wrapper
 */
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
};

/**
 * Paginated response
 */
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

// ============================================================================
// LEGACY COMPATIBILITY (for backward compatibility with existing code)
// ============================================================================

/**
 * @deprecated Use StampImage instead
 */
export type Image = StampImage;
