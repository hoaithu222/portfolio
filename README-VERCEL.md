# Deploy to Vercel - Hướng dẫn

## Bước 1: Chuẩn bị

1. Đảm bảo code đã được commit và push lên GitHub/GitLab/Bitbucket
2. Kiểm tra file `.env.local` có các biến môi trường cần thiết

## Bước 2: Deploy qua Vercel Dashboard

### 2.1. Tạo project mới

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import repository từ GitHub/GitLab/Bitbucket
4. Chọn repository của bạn

### 2.2. Cấu hình Project

**Framework Preset**: Next.js (tự động detect)

**Root Directory**: `./` (mặc định)

**Build Command**: 
```
npm run build
```

**Output Directory**: `.next` (mặc định)

**Install Command**: 
```
npm install
```

### 2.3. Environment Variables

Thêm các biến môi trường trong Vercel Dashboard:

1. Vào **Settings** → **Environment Variables**
2. Thêm các biến sau:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | Production, Preview, Development |
| `NEXT_PUBLIC_OG_IMAGE_URL` | `https://your-project.vercel.app/og-image.jpg` | Production, Preview |
| `NEXT_PUBLIC_TWITTER_HANDLE` | `@your-handle` | Production, Preview |

**Lưu ý**: 
- Sau khi deploy lần đầu, Vercel sẽ cung cấp URL. Cập nhật `NEXT_PUBLIC_SITE_URL` với URL thực tế.
- Nếu có custom domain, cập nhật `NEXT_PUBLIC_SITE_URL` với domain đó.

### 2.4. Deploy

1. Click **"Deploy"**
2. Chờ build hoàn tất (thường 2-5 phút)
3. Sau khi deploy thành công, bạn sẽ nhận được URL: `https://your-project.vercel.app`

## Bước 3: Cấu hình Custom Domain (Optional)

1. Vào **Settings** → **Domains**
2. Thêm domain của bạn
3. Làm theo hướng dẫn để cấu hình DNS
4. Cập nhật `NEXT_PUBLIC_SITE_URL` với custom domain

## Bước 4: Kiểm tra sau khi deploy

### 4.1. Kiểm tra các routes

- ✅ `https://your-project.vercel.app/` → Redirect to `/vi`
- ✅ `https://your-project.vercel.app/vi` → Home page (Vietnamese)
- ✅ `https://your-project.vercel.app/en` → Home page (English)
- ✅ `https://your-project.vercel.app/vi/skills` → Skills page
- ✅ `https://your-project.vercel.app/vi/experience` → Experience page
- ✅ `https://your-project.vercel.app/vi/contact` → Contact page

### 4.2. Kiểm tra SEO

- ✅ `https://your-project.vercel.app/sitemap.xml` → Sitemap
- ✅ `https://your-project.vercel.app/robots.txt` → Robots.txt
- ✅ Kiểm tra meta tags trong source code
- ✅ Test Open Graph với [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- ✅ Test Twitter Cards với [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Bước 5: Cập nhật Environment Variables sau khi có URL

Sau khi deploy lần đầu và có URL từ Vercel:

1. Vào **Settings** → **Environment Variables**
2. Cập nhật `NEXT_PUBLIC_SITE_URL` với URL thực tế:
   ```
   https://your-project.vercel.app
   ```
3. Redeploy để áp dụng thay đổi

## Troubleshooting

### Build fails

1. Kiểm tra logs trong Vercel Dashboard
2. Đảm bảo tất cả dependencies đã được cài đặt
3. Kiểm tra TypeScript errors: `npm run build` locally

### Routes không hoạt động

1. Kiểm tra `middleware.ts` có đúng cấu hình không
2. Kiểm tra `i18n/routing.ts` có đúng locales không
3. Đảm bảo `next.config.ts` đã cấu hình next-intl plugin

### Environment variables không hoạt động

1. Đảm bảo biến có prefix `NEXT_PUBLIC_` cho client-side
2. Redeploy sau khi thay đổi environment variables
3. Kiểm tra trong Vercel Dashboard → Settings → Environment Variables

### 404 trên các routes

1. Kiểm tra `vercel.json` có đúng cấu hình không
2. Đảm bảo Next.js routing đúng với cấu trúc `app/[locale]/...`

## Deploy qua CLI (Alternative)

Nếu muốn deploy qua CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Continuous Deployment

Vercel tự động deploy khi:
- Push code lên `main`/`master` branch → Production
- Push code lên các branch khác → Preview
- Tạo Pull Request → Preview với comment

## Performance Tips

1. **Enable Edge Functions**: Vercel tự động optimize
2. **Image Optimization**: Sử dụng Next.js Image component
3. **Static Generation**: Tối ưu các trang có thể static
4. **Caching**: Vercel tự động cache static assets

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Next-intl Deployment](https://next-intl-docs.vercel.app/docs/next-13/server-components)

