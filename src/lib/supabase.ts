/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nuiyufralpvbumraieka.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aXl1ZnJhbHB2YnVtcmFpZWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNTU5NjMsImV4cCI6MjEwMDkzMTk2M30.gv3REx2-h5hEEf5oG5yXAmGXoXfCbnubvSrVNuSh7uA';

export const supabase = createClient(supabaseUrl, supabaseKey);
