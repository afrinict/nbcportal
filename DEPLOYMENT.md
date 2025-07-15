# NBC Portal Deployment Guide

## Environment Variables Configuration

### For Local Development

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Update the `.env` file with your local configuration:
   ```env
   # Database Configuration (SQLite for local development)
   DATABASE_URL=./nbc_portal.db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Environment
   NODE_ENV=development
   
   # Server Configuration
   PORT=5000
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173
   ```

### For GitHub Actions (CI/CD)

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

   **Required Secrets:**
   - `DATABASE_URL`: Your production database URL
   - `JWT_SECRET`: A strong, unique JWT secret key

   **Optional Secrets:**
   - `PORT`: Server port (default: 5000)
   - `CORS_ORIGIN`: Allowed CORS origin
   - `DB_POOL_MIN`: Database pool minimum connections
   - `DB_POOL_MAX`: Database pool maximum connections
   - `MAX_FILE_SIZE`: Maximum file upload size
   - `UPLOAD_PATH`: File upload directory
   - `SMTP_HOST`: SMTP server host
   - `SMTP_PORT`: SMTP server port
   - `SMTP_USER`: SMTP username
   - `SMTP_PASS`: SMTP password
   - `REDIS_URL`: Redis connection URL
   - `LOG_LEVEL`: Logging level

### For Netlify Deployment

1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following environment variables:

   ```env
   DATABASE_URL=your-production-database-url
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://your-domain.netlify.app
   ```

### For Vercel Deployment

1. Go to your Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the same environment variables as above

### For Railway Deployment

1. Go to your Railway dashboard
2. Navigate to your project → **Variables**
3. Add the environment variables

### For Render Deployment

1. Go to your Render dashboard
2. Navigate to your service → **Environment**
3. Add the environment variables

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, unique JWT secrets** (at least 32 characters)
3. **Use environment-specific database URLs**
4. **Rotate secrets regularly** in production
5. **Use HTTPS** for all production deployments
6. **Limit CORS origins** to your actual domains

## Database Configuration

### Development (SQLite)
```env
DATABASE_URL=./nbc_portal.db
```

### Production (PostgreSQL/MySQL)
```env
DATABASE_URL=postgresql://username:password@host:port/database
# or
DATABASE_URL=mysql://username:password@host:port/database
```

## JWT Secret Generation

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Environment-Specific Configurations

### Development
- Use SQLite for simplicity
- Enable detailed logging
- Allow localhost CORS

### Staging
- Use a separate database
- Enable moderate logging
- Restrict CORS to staging domain

### Production
- Use production database
- Minimal logging
- Strict CORS policies
- Enable rate limiting
- Use HTTPS only

## Troubleshooting

### Common Issues

1. **Database connection errors**: Check `DATABASE_URL` format
2. **JWT errors**: Verify `JWT_SECRET` is set and consistent
3. **CORS errors**: Check `CORS_ORIGIN` matches your frontend URL
4. **File upload errors**: Verify `UPLOAD_PATH` exists and is writable

### Debug Commands

```bash
# Check environment variables
node -e "console.log(process.env)"

# Test database connection
npm run db:test

# Validate configuration
npm run config:validate
```

## Monitoring and Logging

Set appropriate log levels:
- `development`: `debug`
- `staging`: `info`
- `production`: `warn` or `error`

## Backup and Recovery

1. **Database backups**: Set up automated backups
2. **Environment backups**: Document all environment variables
3. **Recovery procedures**: Test deployment rollbacks 