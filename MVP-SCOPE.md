# MVP SCOPE
## Feature: User Registration & Login (Supabase Auth)

### Description 

 Enable users to register and log in securely using Supabase Auth (email/password). Supports standard authentication flows, session management, and email verification.

 ###Scope 

 All registration and login flows for web, tablet, and mobile using Supabase Auth. Includes email/password registration, login, secure session management, and email verification. No custom authentication or third-party social logins in MVP.

## Feature: Collection-First Layout & Visual Hierarchy

### Description 

 A mobile-first, visually engaging layout that prioritizes stamp images and key metadata, with clear visual hierarchy and navigation.

 ###Scope 

 Dashboard, item detail, and list views with stamp images as primary content, key metadata as secondary, and detailed cataloging info as tertiary. Adheres to brand color palette and design guidelines. Progressive disclosure for advanced fields.

## Feature: Responsive Navigation

### Description 

 Device-optimized navigation for desktop (sidebar), tablet (collapsible sidebar), and mobile (bottom navigation), with accessible icons and clear routes to all main sections.

 ###Scope 

 Navigation adapts to device size and input (touch, keyboard). Includes quick access to dashboard, collections, stamps, sales, and settings. Uses specified iconography and color palette.

## Feature: Add Stamp Workflow

### Description 

 Allow users to add new stamps with high-resolution images, full metadata, and purchase details.

 ###Scope 

 Add Stamp form with fields for title, country, year, condition, catalog numbers, denomination, theme, acquisition date, purchase price, seller, taxes, shipping, valuation, notes, and at least 3 high-res images. Supports validation, save-as-draft, and multi-currency.

## Feature: Dashboard: Stamp & Collection Lists, Metrics, and Search

### Description 

 Dashboard displaying searchable, filterable lists of stamps and collections, plus key collection and financial metrics.

 ###Scope 

 Dashboard with tabbed/labeled lists for stamps and collections, search bar, advanced filters, and metric widgets (total spent, earned, budget, profit/loss, collection size). Each stamp entry shows image, title, purchase/sale price, status, and transaction count.

## Feature: Data Models for Stamps, Collections, Transactions, and Images

### Description 

 Robust backend/database structure for stamps, collections, transactions, and images, supporting all required metadata and relationships.

 ###Scope 

 Database schemas for stamps, collections, images, and transactions. Support for multi-image stamps, metadata, purchase/sale transactions, collection grouping, and future extensibility. Enforces user ownership and access control.

## Feature: Image Upload, Storage, and Optimization

### Description 

 Support for high-res, multi-angle image uploads per stamp, with optimized storage and fast viewing.

 ###Scope 

 Image upload supports at least 3 images per stamp (front, back, optional angle), max 5MB each, WebP/JPEG only. Images optimized (conversion, resizing, thumbnails), stored securely, and linked to stamp records. Fast loading and zoom supported.
## USER PREFERENCES:
Use Supabase Auth for all authentication (no custom or third-party auth in MVP)
Mobile-first, visually engaging design
Adhere to provided brand color palette and UI guidelines
Progressive disclosure for advanced features/fields
Fast, responsive experience across all devices
Support for high-res stamp images and detailed metadata
User privacy and access control enforced
Multi-currency support for purchases