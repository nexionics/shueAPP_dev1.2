export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          rating: number | null
          seller_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          rating?: number | null
          seller_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          rating?: number | null
          seller_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      seller_locations: {
        Row: {
          user_id: string
          zipcode: string | null
          lat: number | null
          lng: number | null
          location_enabled: boolean
          is_sponsored: boolean
          updated_at: string
        }
        Insert: {
          user_id: string
          zipcode?: string | null
          lat?: number | null
          lng?: number | null
          location_enabled?: boolean
          is_sponsored?: boolean
          updated_at?: string
        }
        Update: {
          user_id?: string
          zipcode?: string | null
          lat?: number | null
          lng?: number | null
          location_enabled?: boolean
          is_sponsored?: boolean
          updated_at?: string
        }
      }
      legacy_seller_map: {
        Row: {
          legacy_id: string
          profile_id: string
          created_at: string
        }
        Insert: {
          legacy_id: string
          profile_id: string
          created_at?: string
        }
        Update: {
          legacy_id?: string
          profile_id?: string
          created_at?: string
        }
      }
      product_listings: {
        Row: {
          id: string
          seller_id: string
          style_id: string | null
          name: string
          brand: string
          colorway: string | null
          images: string[]
          sizes: { size: string; price: number }[]
          retail_price: number | null
          release_date: string | null
          category: string | null
          condition: string
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          style_id?: string | null
          name: string
          brand: string
          colorway?: string | null
          images: string[]
          sizes: { size: string; price: number }[]
          retail_price?: number | null
          release_date?: string | null
          category?: string | null
          condition?: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          style_id?: string | null
          name?: string
          brand?: string
          colorway?: string | null
          images?: string[]
          sizes?: { size: string; price: number }[]
          retail_price?: number | null
          release_date?: string | null
          category?: string | null
          condition?: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      listing_views: {
        Row: {
          id: string
          listing_id: string
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          user_id?: string | null
          viewed_at?: string
        }
      }
      listing_favorites: {
        Row: {
          id: string
          listing_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          user_id?: string
          created_at?: string
        }
      }
      listing_bids: {
        Row: {
          id: string
          listing_id: string
          user_id: string
          bid_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          user_id: string
          bid_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          user_id?: string
          bid_amount?: number
          created_at?: string
        }
      }
      listing_raffle_entries: {
        Row: {
          id: string
          listing_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      popular_listings: {
        Row: {
          id: string
          seller_id: string
          style_id: string | null
          name: string
          brand: string
          colorway: string | null
          images: string[]
          sizes: { size: string; price: number }[]
          retail_price: number | null
          release_date: string | null
          category: string | null
          condition: string
          description: string | null
          status: string
          created_at: string
          updated_at: string
          seller_name: string | null
          seller_display_id: string | null
          seller_rating: number | null
          zipcode: string | null
          lat: number | null
          lng: number | null
          is_sponsored: boolean | null
          popularity_score: number | null
        }
      }
    }
    Functions: {
      calculate_popularity_score: {
        Args: {
          p_listing_id: string
          p_days_back?: number
        }
        Returns: number
      }
      get_top_listings_for_seller: {
        Args: {
          p_seller_id: string
          p_limit?: number
        }
        Returns: {
          id: string
          name: string
          brand: string
          colorway: string | null
          images: string[]
          sizes: { size: string; price: number }[]
          retail_price: number | null
          popularity_score: number
        }[]
      }
      get_seller_inventory_counts: {
        Args: Record<string, never>
        Returns: {
          seller_id: string
          inventory_count: number
        }[]
      }
    }
  }
}
