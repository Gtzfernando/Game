export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      game_stages: {
        Row: {
          id: string;
          stage_number: number;
          riddle_text: string;
          answer_hash: string;
          qr_payload: string;
          location_clue: string;
          fragment_text: string;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          stage_number: number;
          riddle_text: string;
          answer_hash: string;
          qr_payload: string;
          location_clue: string;
          fragment_text: string;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          stage_number?: number;
          riddle_text?: string;
          answer_hash?: string;
          qr_payload?: string;
          location_clue?: string;
          fragment_text?: string;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      player_progress: {
        Row: {
          user_id: string;
          current_stage: number;
          game_completed: boolean;
          tutorial_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_stage?: number;
          game_completed?: boolean;
          tutorial_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          current_stage?: number;
          game_completed?: boolean;
          tutorial_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "player_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      stage_progress: {
        Row: {
          id: string;
          user_id: string;
          stage_id: string;
          answer_solved: boolean;
          qr_scanned: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stage_id: string;
          answer_solved?: boolean;
          qr_scanned?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stage_id?: string;
          answer_solved?: boolean;
          qr_scanned?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stage_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stage_progress_stage_id_fkey";
            columns: ["stage_id"];
            isOneToOne: false;
            referencedRelation: "game_stages";
            referencedColumns: ["id"];
          }
        ];
      };
      found_fragments: {
        Row: {
          id: string;
          user_id: string;
          stage_id: string;
          fragment_snapshot: string;
          image_url: string | null;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stage_id: string;
          fragment_snapshot: string;
          image_url?: string | null;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stage_id?: string;
          fragment_snapshot?: string;
          image_url?: string | null;
          unlocked_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "found_fragments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "found_fragments_stage_id_fkey";
            columns: ["stage_id"];
            isOneToOne: false;
            referencedRelation: "game_stages";
            referencedColumns: ["id"];
          }
        ];
      };
      found_qr_codes: {
        Row: {
          id: string;
          user_id: string;
          stage_id: string;
          qr_payload: string;
          scanned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stage_id: string;
          qr_payload: string;
          scanned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stage_id?: string;
          qr_payload?: string;
          scanned_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "found_qr_codes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "found_qr_codes_stage_id_fkey";
            columns: ["stage_id"];
            isOneToOne: false;
            referencedRelation: "game_stages";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      initialize_player_progress: {
        Args: { p_user_id: string };
        Returns: void;
      };
      complete_stage_qr: {
        Args: {
          p_user_id: string;
          p_stage_number: number;
          p_qr_payload: string;
        };
        Returns: {
          next_stage: number;
          is_final: boolean;
        };
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
