export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type UUID = string
type Timestamp = string

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          id: UUID
          user_id: UUID
          url: string
          title: string
          favicon: string | null
          summary: string | null
          created_at: Timestamp
          updated_at: Timestamp
        }
        Insert: {
          id?: UUID
          user_id: UUID
          url: string
          title: string
          favicon?: string | null
          summary?: string | null
          created_at?: Timestamp
          updated_at?: Timestamp
        }
        Update: {
          id?: UUID
          user_id?: UUID
          url?: string
          title?: string
          favicon?: string | null
          summary?: string | null
          created_at?: Timestamp
          updated_at?: Timestamp
        }
      }
      tags: {
        Row: {
          id: UUID
          name: string
          user_id: UUID
          created_at: Timestamp
        }
        Insert: {
          id?: UUID
          name: string
          user_id: UUID
          created_at?: Timestamp
        }
        Update: {
          id?: UUID
          name?: string
          user_id?: UUID
          created_at?: Timestamp
        }
      }
      bookmark_tags: {
        Row: {
          bookmark_id: UUID
          tag_id: UUID
        }
        Insert: {
          bookmark_id: UUID
          tag_id: UUID
        }
        Update: {
          bookmark_id?: UUID
          tag_id?: UUID
        }
      }
    }
  }
}
