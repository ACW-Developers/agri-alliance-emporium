import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lddpgavxyirfqiaigcak.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZHBnYXZ4eWlyZnFpYWlnY2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NjI4NDQsImV4cCI6MjA2OTQzODg0NH0.ErSIhgCifgzUsve8oIF5VR46nyntBSZPxbzTvuH1LMo'

export const supabase = createClient(supabaseUrl, supabaseKey)