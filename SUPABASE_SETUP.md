# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `startright-michigan-childcare`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your location
6. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" → "API"
3. Copy the following values:
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 4. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL

## 5. Set Up Storage

1. Go to "Storage" in your Supabase dashboard
2. The `documents` bucket should be created automatically
3. If not, create it manually:
   - Click "Create a new bucket"
   - Name: `documents`
   - Make it public: ✅

## 6. Configure Storage Policies

The SQL schema includes storage policies, but you can also set them up manually:

1. Go to "Storage" → "Policies"
2. Create the following policies for the `documents` bucket:

**Public Access (for viewing files):**

```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
```

**Authenticated Upload:**

```sql
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
```

## 7. Test the Integration

1. Start your development server: `npm run dev`
2. Complete the onboarding wizard
3. Go to the Documents section
4. Try uploading a file
5. Check your Supabase Storage to see if the file appears

## 8. Production Deployment

### Vercel Deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Troubleshooting

### Common Issues:

1. **"Cannot find module '@supabase/supabase-js'"**

   ```bash
   npm install @supabase/supabase-js
   ```

2. **Storage upload fails**

   - Check that the `documents` bucket exists
   - Verify storage policies are set correctly
   - Ensure your API keys are correct

3. **Database connection fails**

   - Verify your Supabase URL and keys
   - Check that your project is active
   - Ensure the database schema was created

4. **CORS errors**
   - Add your domain to Supabase project settings
   - Check that your environment variables are correct

## Security Notes

- Never commit your `.env.local` file
- Keep your service role key secret
- Use environment variables for all sensitive data
- Consider implementing user authentication for production use

## Next Steps

Once Supabase is set up, you can:

- Add user authentication
- Implement real-time updates
- Add more sophisticated file management
- Set up automated backups
- Monitor usage and performance
