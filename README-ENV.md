# Environment Variables Configuration

## Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your actual deployment URL:

   ```env
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NEXT_PUBLIC_OG_IMAGE_URL=https://your-domain.com/og-image.jpg
   NEXT_PUBLIC_TWITTER_HANDLE=@your-handle
   ```

## Variables

### `NEXT_PUBLIC_SITE_URL` (Required)
- **Description**: Your website's base URL after deployment
- **Example**: `https://hoaithu222.github.io` or `https://yourdomain.com`
- **Used in**: 
  - Sitemap generation
  - Robots.txt
  - SEO metadata (Open Graph, Twitter Cards)
  - Structured data (JSON-LD)
  - Canonical URLs

### `NEXT_PUBLIC_OG_IMAGE_URL` (Optional)
- **Description**: URL to your Open Graph image (1200x630px recommended)
- **Default**: `{NEXT_PUBLIC_SITE_URL}/og-image.jpg`
- **Used in**: Open Graph and Twitter Card metadata

### `NEXT_PUBLIC_TWITTER_HANDLE` (Optional)
- **Description**: Your Twitter/X handle
- **Default**: `@hoaithu222`
- **Used in**: Twitter Card metadata

## Deployment

### GitHub Pages
Set environment variables in your GitHub repository settings:
- Go to Settings → Secrets and variables → Actions
- Add `NEXT_PUBLIC_SITE_URL` as a repository variable

### Vercel
Environment variables are automatically read from `.env.local` or can be set in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add all variables

### Other Platforms
Make sure to set `NEXT_PUBLIC_SITE_URL` as an environment variable in your hosting platform.

## Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- `.env.local` is gitignored and should not be committed
- `.env.example` is a template and should be committed
- After changing environment variables, restart your development server

