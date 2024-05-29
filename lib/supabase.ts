import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
import "react-native-gesture-handler";

import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPABASE_URL = "https://wzaqrofszlwfeatiikvk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6YXFyb2Zzemx3ZmVhdGlpa3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI0MTAxMDIsImV4cCI6MjAyNzk4NjEwMn0.4Y0M-W5V5X6NZWkrObtVIBZvJrKLYVHR5rnJP8rSPno";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export { supabase };
