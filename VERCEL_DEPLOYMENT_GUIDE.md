# Deploying NestJS Backend to Vercel

This guide will help you deploy your Task Manager backend to Vercel.

⚠️ **IMPORTANT**: Vercel is serverless with an ephemeral filesystem. File uploads won't work without cloud storage.

## Critical Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Repository** - Push your code to GitHub
3. **PostgreSQL Database** - Set up a cloud PostgreSQL instance
4. **Cloud Storage** - AWS S3, Cloudinary, or similar (required for file uploads!)

## ⚠️ What Won't Work Without Changes

| Feature | Issue | Solution |
|---------|-------|----------|
| File Uploads (Attachments) | Local filesystem deleted after each request | Migrate to AWS S3, Cloudinary, or DigitalOcean Spaces |
| User Avatars | Stored locally, will be lost | Use cloud storage |
| WebSockets | Vercel Pro only, uses polling | Use Pusher, Supabase Realtime, or Firebase |

**See `CLOUD_STORAGE_GUIDE.md` for implementation.**

## Step 1: Migrate File Uploads to Cloud Storage

1. Ensure all changes are committed to Git:
   ```bash
   git add .
   git commit -m "Add Vercel configuration and Swagger documentation"
   git push
   ```

2. Make sure `.env` file is in `.gitignore` (already should be):
   ```bash
   echo ".env" >> .gitignore
   ```

## Step 2: Set Up PostgreSQL Database

### Option A: Vercel Storage (Recommended)
1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create New" → Select "Postgres"
3. Copy the connection details

### Option B: External Database
- Use services like:
  - Railway.app
  - Supabase
  - AWS RDS
  - DigitalOcean

## Step 3: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Configure the project:
   - **Root Directory**: `.` (current)
   - **Framework Preset**: `Other`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from project directory
vercel

# Follow the prompts and select your preferences
```

## Step 4: Configure Environment Variables

After creating the project on Vercel:

1. Go to your project → **Settings** → **Environment Variables**
2. Add all variables from `.env.example`:

```
DB_HOST=your-database-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database-name
JWT_SECRET=your-secret-key
JWT_EXPIRY=3600
NODE_ENV=production
MAIL_SERVICE=gmail
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
FRONTEND_URL=https://your-frontend.com
```

3. Save the variables
4. Redeploy for changes to take effect

## Step 5: Connect Your Frontend

Update your frontend API base URL to your Vercel deployment URL:

```typescript
// In your frontend code
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-project.vercel.app/api/v1';
```

## Common Issues & Solutions

### Issue 1: Build Fails
**Error**: `npm ERR! code ENOENT`
- **Solution**: Ensure all dependencies are in `package.json`
- Run `npm install` locally and verify it works

### Issue 2: Database Connection Failed
- Verify DB credentials in environment variables
- Check IP whitelist (if using external DB)
- Ensure database URL includes correct port

### Issue 3: Port Already in Use
- **Fixed**: Updated `main.ts` to use dynamic PORT
- Vercel automatically assigns an available port

### Issue 4: Memory Limit Exceeded
- Optimize queries and add pagination
- Consider using Vercel Pro for higher limits
- Profile your application locally

## Monitoring & Logs

### View Logs
1. Go to project → **Deployments**
2. Click on a deployment
3. View "Logs" or "Function logs"

### Common Log Locations
- Build logs: Shown during deployment
- Runtime logs: Available in deployment details

## Database Migrations

For TypeORM migrations on Vercel:

1. Create a migration locally:
   ```bash
   npm run typeorm migration:create src/migrations/InitialSchema
   ```

2. Generate from entities:
   ```bash
   npm run typeorm migration:generate src/migrations/InitialSchema
   ```

3. Run migrations before deployment:
   ```bash
   npm run typeorm migration:run
   ```

## API Documentation

Your Swagger API docs will be available at:
```
https://your-project.vercel.app/api/docs
```

## Performance Optimization

1. **Enable compression**:
   - Already configured via NestJS defaults

2. **Add caching headers**:
   - Configure in your controllers

3. **Database indexing**:
   - Add indexes to frequently queried columns

4. **Pagination**:
   - Implement for list endpoints (Ensure page/limit queries)

## Redeployment

Changes are automatically deployed when you push to your connected branch:

```bash
git add .
git commit -m "Your changes"
git push origin main  # Vercel will automatically deploy
```

Manual redeploy:
- Go to project → **Deployments**
- Click "..." on latest deployment
- Select "Redeploy"

## Environment-Specific Configurations

### Development
```bash
npm run start:dev  # Local with hot reload
```

### Production (Local Test)
```bash
npm run build
npm run start:prod
```

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **NestJS Docs**: https://docs.nestjs.com
- **TypeORM Docs**: https://typeorm.io

---

**Your API will be live at**: `https://your-project-name.vercel.app/api/v1/`
