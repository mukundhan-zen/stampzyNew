/**
 * This file contains the TypeScript type definitions for the Supabase database schema.
 * These types are generated to match the SQL migrations and are used throughout the application
 * to ensure type safety when interacting with the database.
 */

/**
 * Represents the 'collections' table in the database.
 * A collection is a user-defined group of stamps.
 */
export type Collection = {
  /**
   * The unique identifier for the collection (UUID).
   * @type {string}
   */
  id: string;

  /**
   * The ID of the user who owns this collection.
   * @type {string}
   */
  user_id: string;

  /**
   * The title of the collection.
   * @type {string}
   */
  title: string;

  /**
   * An optional description of the collection.
   * @type {string | null}
   */
  description: string | null;

  /**
   * An optional array of stamp IDs belonging to this collection.
   * @type {string[] | null}
   */
  stamp_ids: string[] | null;

  /**
   * The timestamp when the collection was created.
   * @type {string}
   */
  created_at: string;

  /**
   * The timestamp when the collection was last updated.
   * @type {string}
   */
  updated_at: string;
};

/**
 * Represents the 'stamps' table in the database.
 * Each record is an individual postage stamp.
 */
export type Stamp = {
  /**
   * The unique identifier for the stamp (UUID).
   * @type {string}
   */
  id: string;

  /**
   * The ID of the user who owns this stamp.
   * @type {string}
   */
  user_id: string;

  /**
   * The optional ID of the collection this stamp belongs to.
   * @type {string | null}
   */
  collection_id: string | null;

  /**
   * The title or name of the stamp.
   * @type {string}
   */
  title: string;

  /**
   * The country of origin for the stamp.
   * @type {string | null}
   */
  country: string | null;

  /**
   * The year the stamp was issued.
   * @type {number | null}
   */
  year: number | null;

  /**
   * The condition of the stamp (e.g., "Mint", "Used").
   * @type {string | null}
   */
  condition: string | null;

  /**
   * Catalog numbers from various sources (e.g., Scott, Michel).
   * Stored as a JSON object.
   * @type {Record<string, string> | null}
   */
  catalog_numbers: Record<string, string> | null;

  /**
   * The face value of the stamp.
   * @type {string | null}
   */
  denomination: string | null;

  /**
   * The theme or topic of the stamp.
   * @type {string | null}
   */
  theme: string | null;

  /**
   * The date the stamp was acquired.
   * @type {string | null}
   */
  acquisition_date: string | null;

  /**
   * The price paid for the stamp.
   * @type {number | null}
   */
  purchase_price: number | null;

  /**
   * The person or entity from whom the stamp was purchased.
   * @type {string | null}
   */
  seller: string | null;

  /**
   * Any taxes paid on the purchase.
   * @type {number | null}
   */
  taxes: number | null;

  /**
   * Shipping costs for the acquisition.
   * @type {number | null}
   */
  shipping: number | null;

  /**
   * The current estimated value of the stamp.
   * @type {number | null}
   */
  valuation: number | null;

  /**
   * User-provided notes about the stamp.
   * @type {string | null}
   */
  notes: string | null;

  /**
   * An optional array of image IDs associated with this stamp.
   * @type {string[] | null}
   */
  images: string[] | null;

  /**
   * The currency for pricing fields (e.g., "USD", "EUR").
   * @type {string | null}
   */
  currency: string | null;

  /**
   * The timestamp when the stamp was created.
   * @type {string}
   */
  created_at: string;

  /**
   * The timestamp when the stamp was last updated.
   * @type {string}
   */
  updated_at: string;
};

/**
 * Represents the 'images' table in the database.
 * Stores metadata for images associated with stamps.
 */
export type Image = {
  /**
   * The unique identifier for the image (UUID).
   * @type {string}
   */
  id: string;

  /**
   * The ID of the user who owns this image.
   * @type {string}
   */
  user_id: string;

  /**
   * The optional ID of the stamp this image is associated with.
   * @type {string | null}
   */
  stamp_id: string | null;

  /**
   * The URL where the image is stored (e.g., in Supabase Storage).
   * @type {string}
   */
  url: string;

  /**
   * The viewing angle of the image (e.g., "front", "back").
   * @type {string | null}
   */
  angle: string | null;

  /**
   * The resolution of the image.
   * @type {{ width: number; height: number } | null}
   */
  resolution: { width: number; height: number } | null;

  /**
   * The timestamp when the image was uploaded.
   * @type {string}
   */
  upload_date: string;

  /**
   * The size of the image file in bytes.
   * @type {number | null}
   */
  file_size: number | null;

  /**
   * The file format of the image.
   * @type {('webp' | 'jpeg' | 'png') | null}
   */
  format: ('webp' | 'jpeg' | 'png') | null;

  /**
   * The timestamp when the image record was created.
   * @type {string}
   */
  created_at: string;

  /**
   * The timestamp when the image record was last updated.
   * @type {string}
   */
  updated_at: string;
};
