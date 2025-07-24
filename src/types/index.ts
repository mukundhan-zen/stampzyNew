/**
 * Represents a user in the application.
 */
export type User = {
  id: string; // UUID
  full_name: string;
  username: string;
  email: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
};

/**
 * Represents a single stamp in a user's collection.
 */
export type Stamp = {
  id: string; // UUID
  name: string;
  description?: string;
  country: string;
  year: number;
  condition: string;
  value?: number;
  images: Image[];
  collection_id?: string; // UUID of the collection it belongs to
  user_id: string; // UUID of the owner
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
};

/**
 * Represents a collection of stamps.
 */
export type Collection = {
  id: string; // UUID
  name: string;
  description?: string;
  user_id: string; // UUID of the owner
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
};

/**
 * Represents a financial transaction (purchase or sale).
 */
export type Transaction = {
  id: string; // UUID
  type: 'purchase' | 'sale';
  amount: number;
  date: string; // ISO 8601 date string
  description?: string;
  stamp_id?: string; // UUID of the related stamp
  collection_id?: string; // UUID of the related collection
  user_id: string; // UUID of the user
  created_at: string; // ISO 8601 date string
};

/**
 * Represents a user's budget.
 */
export type Budget = {
  id: string; // UUID
  limit: number;
  spent: number;
  start_date: string; // ISO 8601 date string
  end_date: string; // ISO 8601 date string
  user_id: string; // UUID of the user
  created_at: string; // ISO 8601 date string
};

/**
 * Represents an image associated with a stamp.
 */
export type Image = {
  id: string; // UUID
  url: string;
  alt_text?: string;
  stamp_id: string; // UUID of the stamp it belongs to
  created_at: string; // ISO 8601 date string
};
