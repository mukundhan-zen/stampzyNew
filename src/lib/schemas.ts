
import { z } from 'zod';

export const SignUpSchema = z.object({
  fullName: z.string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(100, { message: "Full name must be less than 100 characters." })
    .regex(/^[a-zA-Z\s'-]+$/, { message: "Full name can only contain letters, spaces, hyphens, and apostrophes." }),
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(30, { message: "Username must be less than 30 characters." })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, underscores, and hyphens." })
    .toLowerCase(),
  email: z.string()
    .email({ message: "Please enter a valid email address." })
    .max(255, { message: "Email must be less than 255 characters." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(128, { message: "Password must be less than 128 characters." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const SignInSchema = z.object({
  email: z.string()
    .email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(1, { message: "Password is required" }),
});

// ============================================================================
// STAMP AND COLLECTION SCHEMAS
// ============================================================================

export const StampSchema = z.object({
  title: z.string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be less than 255 characters" }),
  country: z.string()
    .max(100, { message: "Country must be less than 100 characters" })
    .optional(),
  year: z.number()
    .int()
    .min(1840, { message: "Year must be 1840 or later" })
    .max(new Date().getFullYear(), { message: "Year cannot be in the future" })
    .optional(),
  condition: z.enum(['mint', 'near_mint', 'fine', 'very_fine', 'good', 'poor'])
    .optional(),
  scott_catalog_number: z.string()
    .max(50, { message: "Scott catalog number must be less than 50 characters" })
    .optional(),
  michel_catalog_number: z.string()
    .max(50, { message: "Michel catalog number must be less than 50 characters" })
    .optional(),
  stanley_gibbons_catalog_number: z.string()
    .max(50, { message: "Stanley Gibbons catalog number must be less than 50 characters" })
    .optional(),
  denomination: z.string()
    .max(50, { message: "Denomination must be less than 50 characters" })
    .optional(),
  theme_subject: z.string()
    .max(255, { message: "Theme/subject must be less than 255 characters" })
    .optional(),
  acquisition_date: z.string()
    .optional(),
  purchase_price: z.number()
    .min(0, { message: "Purchase price must be positive" })
    .optional(),
  purchase_currency: z.string()
    .length(3, { message: "Currency must be a 3-letter code" })
    .default("USD"),
  seller: z.string()
    .max(255, { message: "Seller name must be less than 255 characters" })
    .optional(),
  taxes: z.number()
    .min(0, { message: "Taxes must be positive" })
    .default(0),
  shipping: z.number()
    .min(0, { message: "Shipping must be positive" })
    .default(0),
  current_valuation: z.number()
    .min(0, { message: "Valuation must be positive" })
    .optional(),
  valuation_currency: z.string()
    .length(3, { message: "Currency must be a 3-letter code" })
    .default("USD"),
  valuation_date: z.string()
    .optional(),
  notes: z.string()
    .max(2000, { message: "Notes must be less than 2000 characters" })
    .optional(),
  collection_id: z.string().uuid().optional(),
});

export const CollectionSchema = z.object({
  title: z.string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title must be less than 255 characters" }),
  description: z.string()
    .max(1000, { message: "Description must be less than 1000 characters" })
    .optional(),
});

export const TransactionSchema = z.object({
  type: z.enum(['purchase', 'sale']),
  transaction_date: z.string()
    .min(1, { message: "Transaction date is required" }),
  amount: z.number()
    .min(0.01, { message: "Amount must be greater than 0" }),
  currency: z.string()
    .length(3, { message: "Currency must be a 3-letter code" })
    .default("USD"),
  taxes: z.number()
    .min(0, { message: "Taxes must be positive" })
    .default(0),
  shipping: z.number()
    .min(0, { message: "Shipping must be positive" })
    .default(0),
  fees: z.number()
    .min(0, { message: "Fees must be positive" })
    .default(0),
  party_name: z.string()
    .max(255, { message: "Party name must be less than 255 characters" })
    .optional(),
  party_contact: z.string()
    .max(255, { message: "Party contact must be less than 255 characters" })
    .optional(),
  payment_method: z.string()
    .max(100, { message: "Payment method must be less than 100 characters" })
    .optional(),
  reference_number: z.string()
    .max(100, { message: "Reference number must be less than 100 characters" })
    .optional(),
  notes: z.string()
    .max(1000, { message: "Notes must be less than 1000 characters" })
    .optional(),
  stamp_id: z.string().uuid().optional(),
  collection_id: z.string().uuid().optional(),
});

export const StampSearchSchema = z.object({
  query: z.string().optional(),
  country: z.string().optional(),
  year: z.number().int().optional(),
  condition: z.enum(['mint', 'near_mint', 'fine', 'very_fine', 'good', 'poor']).optional(),
  collection_id: z.string().uuid().optional(),
  min_value: z.number().min(0).optional(),
  max_value: z.number().min(0).optional(),
  is_sold: z.boolean().optional(),
  sort_by: z.enum(['title', 'country', 'year', 'created_at', 'purchase_price', 'current_valuation']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  per_page: z.number().int().min(1).max(100).default(20),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Authentication types
export type SignUpFormData = z.infer<typeof SignUpSchema>;
export type SignInFormData = z.infer<typeof SignInSchema>;

// Stamp and collection types
export type StampFormData = z.infer<typeof StampSchema>;
export type CollectionFormData = z.infer<typeof CollectionSchema>;
export type TransactionFormData = z.infer<typeof TransactionSchema>;
export type StampSearchParams = z.infer<typeof StampSearchSchema>;
