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
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          rating?: number | null
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
          updated_at: string
        }
        Insert: {
          user_id: string
          zipcode?: string | null
          lat?: number | null
          lng?: number | null
          location_enabled?: boolean
          updated_at?: string
        }
        Update: {
          user_id?: string
          zipcode?: string | null
          lat?: number | null
          lng?: number | null
          location_enabled?: boolean
          updated_at?: string
        }
      }
    }
  }
}
