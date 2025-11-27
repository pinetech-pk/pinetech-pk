# Admin Authentication Implementation Guide

## Overview

This implementation adds NextAuth.js authentication to protect your admin dashboard. Only authenticated users with valid credentials can access `/admin` and fetch submissions from the API.

## Files Created/Modified

### New Files:
1. `src/lib/auth.ts` - NextAuth configuration with Credentials provider
2. `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route handler
3. `src/app/admin/login/page.tsx` - Admin login page
4. `src/middleware.ts` - Route protection middleware
5. `src/components/providers.tsx` - SessionProvider wrapper
6. `src/types/next-auth.d.ts` - TypeScript type extensions
7. `.env.local.example` - Environment variables template

### Modified Files:
1. `src/app/layout.tsx` - Added SessionProvider wrapper
2. `src/app/admin/page.tsx` - Added session checks, logout button
3. `src/app/api/user-submissions/route.ts` - Added server-side auth for GET requests

## Installation Steps

### 1. Install next-auth package

```bash
npm install next-auth
# or
yarn add next-auth
# or
pnpm add next-auth
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and update the values:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```env
# Generate a secure secret (run this in terminal):
# openssl rand -base64 32

NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000

# Your admin credentials
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-password

# Your existing database URL
DATABASE_URL=your-neon-database-url
```

### 3. Copy the new files to your project

Copy all the files from this package to your project, maintaining the directory structure.

### 4. For Production (Vercel)

Add these environment variables to your Vercel project:

1. Go to your Vercel project → Settings → Environment Variables
2. Add:
   - `NEXTAUTH_SECRET` - A secure random string
   - `NEXTAUTH_URL` - Your production URL (https://www.pinetech.pk)
   - `ADMIN_EMAIL` - Your admin email
   - `ADMIN_PASSWORD` - Your admin password

## How It Works

### Authentication Flow:
1. User visits `/admin` → Middleware checks for valid session
2. No session → Redirect to `/admin/login`
3. User enters credentials → NextAuth validates against env vars
4. Valid credentials → JWT token created, user redirected to `/admin`
5. Invalid credentials → Error shown on login page

### Route Protection:
- **Middleware** (`src/middleware.ts`): Protects all `/admin/*` routes except `/admin/login`
- **API Route**: Server-side check in `/api/user-submissions` GET endpoint
- **Client-side**: `useSession` hook in admin page for loading states

### Security Layers:
1. **Middleware**: First line of defense, blocks unauthenticated requests
2. **Server-side auth check**: Backup validation in API routes
3. **Client-side redirect**: UX improvement for unauthorized users

## Testing

1. Start your dev server: `npm run dev`
2. Visit `http://localhost:3000/admin`
3. You should be redirected to `/admin/login`
4. Log in with your credentials
5. You should see the admin dashboard
6. Click "Logout" to end your session

## Security Recommendations

1. **Use a strong password**: At least 12 characters with mixed case, numbers, and symbols
2. **Generate a proper NEXTAUTH_SECRET**: Use `openssl rand -base64 32`
3. **Never commit `.env.local`**: It's already in your `.gitignore`
4. **Consider password hashing**: For production, you might want to hash the password with bcrypt
5. **Add rate limiting**: Consider adding rate limiting to the login endpoint

## Future Enhancements

If you need to expand authentication later:
- Add more admin users by storing them in the database
- Implement password hashing with bcrypt
- Add 2FA with authenticator apps
- Add session management (view/revoke sessions)
- Add audit logging for admin actions

## Troubleshooting

### "NEXTAUTH_SECRET" error
Make sure you've set the `NEXTAUTH_SECRET` environment variable.

### Redirect loops
Check that `NEXTAUTH_URL` matches your actual site URL.

### Session not persisting
Clear cookies and try again. Ensure cookies are enabled.

### 401 on API calls
Check that your session is valid and not expired (24-hour default).
