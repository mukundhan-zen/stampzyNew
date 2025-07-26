
export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      collections: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      stamps: {
        Row: {
          id: string;
          user_id: string;
          collection_id: string | null;
          title: string;
          country: string;
          year: number;
          condition: string;
          denomination: string;
          theme: string | null;
          catalog_numbers: Json | null;
          acquisition_date: string | null;
          purchase_price: number | null;
          seller: string | null;
          taxes: number | null;
          shipping: number | null;
          currency: string;
          valuation: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          collection_id?: string | null;
          title: string;
          country: string;
          year: number;
          condition: string;
          denomination: string;
          theme?: string | null;
          catalog_numbers?: Json | null;
          acquisition_date?: string | null;
          purchase_price?: number | null;
          seller?: string | null;
          taxes?: number | null;
          shipping?: number | null;
          currency?: string;
          valuation?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          collection_id?: string | null;
          title?: string;
          country?: string;
          year?: number;
          condition?: string;
          denomination?: string;
          theme?: string | null;
          catalog_numbers?: Json | null;
          acquisition_date?: string | null;
          purchase_price?: number | null;
          seller?: string | null;
          taxes?: number | null;
          shipping?: number | null;
          currency?: string;
          valuation?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stamps_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stamps_collection_id_fkey";
            columns: ["collection_id"];
            referencedRelation: "collections";
            referencedColumns: ["id"];
          }
        ];
      };
      images: {
        Row: {
          id: string;
          user_id: string;
          stamp_id: string;
          url: string;
          storage_key: string;
          angle: string | null;
          resolution: string | null;
          format: string | null;
          metadata: Json | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stamp_id: string;
          url: string;
          storage_key: string;
          angle?: string | null;
          resolution?: string | null;
          format?: string | null;
          metadata?: Json | null;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stamp_id?: string;
          url?: string;
          storage_key?: string;
          angle?: string | null;
          resolution?: string | null;
          format?: string | null;
          metadata?: Json | null;
          uploaded_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "images_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "images_stamp_id_fkey";
            columns: ["stamp_id"];
            referencedRelation: "stamps";
            referencedColumns: ["id"];
          }
        ];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          stamp_id: string | null;
          collection_id: string | null;
          type: "purchase" | "sale";
          date: string;
          amount: number;
          buyer: string | null;
          seller: string | null;
          taxes: number | null;
          shipping: number | null;
          residual_value: number | null;
          currency: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stamp_id?: string | null;
          collection_id?: string | null;
          type: "purchase" | "sale";
          date?: string;
          amount: number;
          buyer?: string | null;
          seller?: string | null;
          taxes?: number | null;
          shipping?: number | null;
          residual_value?: number | null;
          currency?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stamp_id?: string | null;
          collection_id?: string | null;
          type?: "purchase" | "sale";
          date?: string;
          amount?: number;
          buyer?: string | null;
          seller?: string | null;
          taxes?: number | null;
          shipping?: number | null;
          residual_value?: number | null;
          currency?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_stamp_id_fkey";
            columns: ["stamp_id"];
            referencedRelation: "stamps";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_collection_id_fkey";
            columns: ["collection_id"];
            referencedRelation: "collections";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
        user_owns_collection: {
            Args: { collection_id_to_check: string };
            Returns: boolean;
        };
        user_owns_stamp: {
            Args: { stamp_id_to_check: string };
            Returns: boolean;
        };
    };
    Enums: {
      transaction_type: "purchase" | "sale";
    };
    CompositeTypes: { [_ in never]: never };
  };
};
