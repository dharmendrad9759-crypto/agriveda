export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      farmers: {
        Row: {
          id: string;
          device_id: string;
          name: string | null;
          phone: string | null;
          preferred_language: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          device_id: string;
          name?: string | null;
          phone?: string | null;
          preferred_language?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          device_id?: string;
          name?: string | null;
          phone?: string | null;
          preferred_language?: string | null;
          created_at?: string;
        };
      };
      spray_logs: {
        Row: {
          id: string;
          farmer_id: string | null;
          crop_id: string;
          field_id: string | null;
          product_id: string;
          product_name: string;
          moa_group: string | null;
          spray_date: string;
          dose_used: string | null;
          growth_stage: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          farmer_id?: string | null;
          crop_id: string;
          field_id?: string | null;
          product_id: string;
          product_name: string;
          moa_group?: string | null;
          spray_date: string;
          dose_used?: string | null;
          growth_stage?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string | null;
          crop_id?: string;
          field_id?: string | null;
          product_id?: string;
          product_name?: string;
          moa_group?: string | null;
          spray_date?: string;
          dose_used?: string | null;
          growth_stage?: string | null;
          created_at?: string;
        };
      };
      outbreak_reports: {
        Row: {
          id: string;
          farmer_id: string | null;
          crop_id: string;
          pest_or_disease: string;
          photo_url: string | null;
          latitude: number;
          longitude: number;
          severity: string;
          verified: boolean | null;
          report_date: string;
        };
        Insert: {
          id?: string;
          farmer_id?: string | null;
          crop_id: string;
          pest_or_disease: string;
          photo_url?: string | null;
          latitude: number;
          longitude: number;
          severity: string;
          verified?: boolean | null;
          report_date?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string | null;
          crop_id?: string;
          pest_or_disease?: string;
          photo_url?: string | null;
          latitude?: number;
          longitude?: number;
          severity?: string;
          verified?: boolean | null;
          report_date?: string;
        };
      };
    };
  };
}
