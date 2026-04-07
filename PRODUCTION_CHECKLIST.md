# Vercel Deployment - Production Checklist

This checklist ensures your NestJS backend is production-ready on Vercel.

## Pre-Deployment

### Architecture Changes
- [ ] **File Uploads**: Migrate from local storage to cloud (S3/Cloudinary)
  - See `CLOUD_STORAGE_GUIDE.md` for implementation
  - Install: `npm install aws-sdk` or `npm install cloudinary`
  - Update attachment & user services
  - Add cloud storage environment variables

- [ ] **WebSockets**: Plan for Vercel limitations
  - [ ] Note: Vercel Pro only, uses polling fallback
  - [ ] Consider alternatives: Pusher, Supabase Realtime, Firebase
  - [ ] Or: Remove real-time features for MVP

- [ ] **File System**: Remove all local file operations
  - [ ] Remove `./upload` directory usage
  - [ ] Remove `fs` module usage for persistence
  - [ ] Remove `diskStorage` from Multer config

### Code Quality
- [ ] Run linting: `npm run lint`
- [ ] Run tests locally: `npm test`
- [ ] Build locally: `npm run build`
- [ ] Verify dist folder generates correctly: `ls dist/`

### Database
- [ ] PostgreSQL instance running and accessible
- [ ] Verify connection string works
- [ ] Test database queries locally
- [ ] Plan migration strategy
  - [ ] Run migrations before first deployment
  - [ ] Or: Use `synchronize: true` in TypeORM (dev only)

### Environment Variables
- [ ] Create `.env.example` with all needed vars
- [ ] Document each variable
- [ ] No hardcoded secrets in code
- [ ] All values can be provided via env vars

### Package.json
- [ ] Check all dependencies are listed (not devDependencies)
- [ ] Remove unused packages: `npm prune`
- [ ] Verify build command: `npm run build`
- [ ] Verify start command uses dist/main.js

## Vercel Setup

### Create Vercel Project
- [ ] Go to https://vercel.com
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
- [ ] Create project

### Environment Variables in Vercel
Copy these to Vercel → Settings → Environment Variables:

```
# Database
DB_HOST=
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

# JWT
JWT_SECRET=generate-a-long-random-string
JWT_EXPIRY=3600

# AWS S3 (if using)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# OR Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Application
NODE_ENV=production
BACKEND_URL=https://your-project.vercel.app
FRONTEND_URL=https://your-frontend.com

# Mail Service
MAIL_SERVICE=gmail
MAIL_USER=
MAIL_PASS=

# Optional
LOG_LEVEL=info
```

### Test Environment
- [ ] Don't include Vercel in production yet
- [ ] Test in staging/preview first

## Deployment

### Initial Deploy
- [ ] Push code to Git
- [ ] Vercel auto-deploys on push
- [ ] Monitor build logs for errors
- [ ] Check deployment status dashboard

### Post-Deployment Testing
- [ ] Verify health check: `GET /api/v1/`
- [ ] Check Swagger docs: `GET /api/v1/api/docs`
- [ ] Test authentication: `POST /api/v1/auth/login`
- [ ] Test database connection: `GET /api/v1/users/me`
- [ ] Monitor function logs for errors

## Production Monitoring

### Logs
- [ ] Set up logging with Winston or Pino
- [ ] Monitor Vercel function logs regularly
- [ ] Set up error alerts (Sentry.io recommended)

### Performance
- [ ] Monitor response times
- [ ] Check cold start duration
- [ ] Optimize database queries
- [ ] Add caching where possible

### Backups
- [ ] Database: Enable automatic backups
- [ ] Cloud Storage: Verify versioning enabled
- [ ] Document recovery procedures

### Security
- [ ] All secrets in environment variables
- [ ] CORS properly configured for frontend URL
- [ ] API keys rotated periodically
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints

## Troubleshooting

### Build Fails
```bash
# Test locally first
npm run build
npm run start:prod

# Check for missing dependencies
npm install

# Verify node version compatibility
node --version
```

### Deployment Timeout
- Vercel default timeout: 60 seconds for Pro, 30 for free
- Optimize build: Remove unnecessary files in `.vercelignore`
- Check database connection timeout
- Consider Vercel Pro for longer timeouts

### Database Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Verify DB credentials are correct
- Check IP whitelist if using external DB
- Test connection locally first
- Enable verbose logging

### File Upload Returns 404
- Ensure migrated to cloud storage
- Verify S3/Cloudinary credentials
- Check file size limits
- Review CORS configuration

### WebSocket Connection Fails
- Note: Vercel Pro only
- Fallback to polling for free tier
- Consider alternative: Pusher/Firebase

## Optimization Tips

### Bundle Size
```bash
npm run build
ls -lh dist/main.js
# Target: < 15MB
```

### Cold Start
- Keep dependencies minimal
- Avoid large initialization in imports
- Lazy load modules where possible

### Database
- Add pagination to list endpoints ✓ (already done)
- Add proper indexes
- Monitor slow queries
- Use connection pooling

### API
- Enable gzip compression
- Add caching headers
- Implement rate limiting
- Use ETags

## Documentation

- [ ] API: https://your-project.vercel.app/api/docs (Swagger)
- [ ] README updated with deployment info
- [ ] Environment vars documented
- [ ] Troubleshooting guide created

## Emergency Procedures

### Rollback
1. Find previous deployment in Vercel dashboard
2. Click "Deploy" → "Redeploy"
3. Or revert git commit and push

### Database Issues
1. Check backups in database provider
2. Restore from backup
3. Test changes locally before redeployment

### Security Incident
1. Rotate all secrets/keys
2. Update environment variables in Vercel
3. Redeploy application
4. Review access logs

## Final Checks

- [ ] All tests passing
- [ ] No console errors in production logs
- [ ] Frontend can connect to backend
- [ ] File uploads work with cloud storage
- [ ] Database operations complete successfully
- [ ] Emails sending correctly
- [ ] Swagger docs accessible
- [ ] CORS working for frontend requests

---

## Deployment Complete! 🎉

Your API is now live at:
```
https://your-project-name.vercel.app
📚 Docs: https://your-project-name.vercel.app/api/docs
🔗 Base URL: https://your-project-name.vercel.app/api/v1
```

Update your frontend to use the production URL and you're ready to go!

---

## Support

- Vercel Docs: https://vercel.com/docs
- NestJS Docs: https://docs.nestjs.com
- AWS S3 Docs: https://docs.aws.amazon.com/s3/
- Cloudinary Docs: https://cloudinary.com/documentation
