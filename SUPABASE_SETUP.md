# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account or sign in
2. Create a new project
3. Wait for the project to be set up

## 2. Create the Email Signups Table

In your Supabase dashboard, go to the SQL Editor and run this query:

```sql
CREATE TABLE email_signups (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts
CREATE POLICY "Allow email inserts" ON email_signups
  FOR INSERT WITH CHECK (true);
```

## 3. Get Your Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy your Project URL
3. Copy your anon/public key

## 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in the `.env` file:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## 5. Test the Integration

1. Start the development server:
   ```bash
   bun run dev
   ```

2. Enter a valid email address and click the Download button
3. Check your Supabase dashboard to see if the email was stored

## Security Notes

- The anon key is safe to use in client-side code
- Row Level Security is enabled to protect your data
- Only email inserts are allowed through the current policy