// supabase.js

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log("Raw env", process.env);

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("SUPABASE_URL:", supabaseUrl);
  console.error("SUPABASE_SERVICE_ROLE_KEY:", supabaseKey);
  throw new Error('Supabase URL and Key must be defined');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
