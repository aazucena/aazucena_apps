# Security Checklist

This checklist ensures secure configuration before deploying to production.

## ✅ Pre-Deployment Security Checklist

### Environment Variables

- [ ] **No hardcoded secrets in source code**
  - Check `apps/portfolio/sentry.client.config.ts`
  - Check `apps/portfolio/sentry.server.config.ts`
  - Check all config files for API keys, tokens, passwords

- [ ] **All .env files are in .gitignore**
  - Verify: `git check-ignore apps/cms/.env apps/portfolio/.env`
  - Both should be listed (means they're ignored)

- [ ] **.env.example files are up to date**
  - `apps/cms/.env.example` has all required variables
  - `apps/portfolio/.env.example` has all required variables
  - No actual secrets in .example files

### Database & Redis

- [ ] **Strong PostgreSQL password set**
  - Generate: `openssl rand -base64 32`
  - Set in `apps/cms/.env`: `DATABASE_PASSWORD=<strong_password>`
  - Verify not using default "strapi" password in production

- [ ] **Redis password configured for production**
  - Generate: `openssl rand -base64 32`
  - Set in `apps/cms/.env`: `REDIS_PASSWORD=<strong_password>`
  - Verify `ALLOW_EMPTY_PASSWORD=no` in production

- [ ] **Database SSL enabled in production**
  - Set `DATABASE_SSL=true` for Railway/production
  - Keep `false` for local development only

### Strapi CMS

- [ ] **All Strapi secrets generated**
  - `APP_KEYS` - Unique comma-separated values
  - `API_TOKEN_SALT` - Random string
  - `ADMIN_JWT_SECRET` - Random string
  - `TRANSFER_TOKEN_SALT` - Random string
  - `JWT_SECRET` - Random string
  - `ENCRYPTION_KEY` - Random string
  - Generate all with: `openssl rand -base64 32`

- [ ] **Strapi admin panel secured**
  - Strong admin password set
  - 2FA enabled (recommended)
  - API tokens have minimal required permissions

### Sentry Configuration

- [ ] **Sentry DSN uses environment variables**
  - Client: `import.meta.env.PUBLIC_SENTRY_DSN`
  - Server: `process.env.SENTRY_DSN`
  - No hardcoded DSN in source code

- [ ] **Sentry sample rates optimized for production**
  - `tracesSampleRate: 0.1` (10%) in production
  - `replaysOnErrorSampleRate: 0.1` (10%) in production
  - `profileSessionSampleRate: 0.1` (10%) in production
  - Full sampling (1.0) only in development

### Docker & Deployment

- [ ] **Docker build context is correct**
  - CircleCI uses `apps/cms` as build context
  - Dockerfile paths match build context

- [ ] **Railway configuration uses Dockerfile**
  - `builder: "DOCKERFILE"` (not NIXPACKS)
  - `dockerfilePath: "Dockerfile.prod"` is set

- [ ] **Docker Compose is for local development only**
  - Header comment clarifies local use only
  - Production uses Railway/cloud services
  - Default credentials only for local development

### CI/CD Pipeline

- [ ] **CircleCI environment variables configured**
  - `DOCKER_USERNAME` - Docker Hub username
  - `DOCKER_PASSWORD` - Docker Hub token (not password)
  - `RAILWAY_TOKEN` - Railway API token
  - `RAILWAY_PUBLIC_URL` - Railway app URL
  - See `.circleci/README.md` for setup guide

- [ ] **CircleCI manual approval gate enabled**
  - Review workflow has `hold-for-approval` step
  - Requires manual approval before production deploy

### API Keys & Tokens

- [ ] **Cloudinary credentials set (if using)**
  - `CLOUDINARY_NAME`
  - `CLOUDINARY_KEY`
  - `CLOUDINARY_SECRET`

- [ ] **reCAPTCHA configured (if using)**
  - `PUBLIC_RECAPTCHA_SITE_KEY`
  - `RECAPTCHA_SECRET_KEY`

- [ ] **Analytics configured (optional)**
  - `PUBLIC_GOOGLE_ANALYTICS_ID`
  - `PUBLIC_PLAUSIBLE_DOMAIN`
  - `PUBLIC_PLAUSIBLE_API_HOST`

### CORS & Network Security

- [ ] **CORS origins configured**
  - Set `ALLOWED_ORIGINS` in production
  - Restrict to trusted domains only
  - Example: `https://yourdomain.com,https://www.yourdomain.com`

- [ ] **Firewall rules configured**
  - Database port (5432) not exposed to public internet
  - Redis port (6379) not exposed to public internet
  - Only Strapi API port (1337) exposed if needed

### Monitoring & Logging

- [ ] **Sentry error tracking enabled**
  - Frontend monitoring active
  - Backend monitoring active
  - Alerts configured for critical errors

- [ ] **Log sensitive data filtered**
  - Passwords not logged
  - API tokens not logged
  - Personal data redacted in logs

### Code Quality

- [ ] **Dependencies are up to date**
  - Run: `pnpm outdated`
  - Update security patches
  - Check for known vulnerabilities: `pnpm audit`

- [ ] **No console.log in production**
  - Remove debug logging
  - Use proper logging library (Pino for backend)

- [ ] **Error messages don't expose internals**
  - Generic error messages for users
  - Detailed errors only in logs
  - No stack traces exposed to frontend

## 🔒 Post-Deployment Verification

### Immediate Checks (Within 5 minutes)

- [ ] **Health check passes**
  - Verify: `curl https://your-strapi-url/_health`
  - Should return 200 OK

- [ ] **Admin panel accessible**
  - Visit: `https://your-strapi-url/admin`
  - Can log in with admin credentials

- [ ] **Database connection working**
  - Check Railway logs for connection errors
  - Verify no authentication failures

- [ ] **Redis connection working**
  - Check Railway logs for Redis errors
  - Verify caching is functioning

### Within 24 Hours

- [ ] **Monitor error rates in Sentry**
  - Check for spike in errors
  - Investigate any critical errors

- [ ] **Check application logs**
  - Review Railway logs
  - Look for warnings or errors

- [ ] **Verify API responses**
  - Test key API endpoints
  - Confirm expected responses

- [ ] **Test authentication flows**
  - Login/logout working
  - API tokens functioning

### Weekly Maintenance

- [ ] **Review security logs**
  - Check for suspicious activity
  - Review failed login attempts

- [ ] **Rotate secrets (quarterly)**
  - Rotate API tokens every 90 days
  - Update Railway tokens
  - Update Docker Hub tokens

- [ ] **Update dependencies**
  - Check for security updates
  - Apply patches promptly

## 🚨 Security Incident Response

If a security incident occurs:

1. **Immediately rotate all compromised credentials**
2. **Check logs for unauthorized access**
3. **Review Sentry for errors indicating breach**
4. **Document the incident**
5. **Update security measures to prevent recurrence**

## 📚 Resources

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Strapi Security Guide:** https://docs.strapi.io/dev-docs/deployment/security
- **Railway Security:** https://docs.railway.app/reference/security
- **Docker Security:** https://docs.docker.com/engine/security/

## 🔐 Password Generation Commands

```bash
# Generate random password (32 characters)
openssl rand -base64 32

# Generate multiple passwords at once
for i in {1..6}; do openssl rand -base64 32; done

# Generate UUID (for APP_KEYS)
uuidgen
```

## ✅ Quick Verification Script

Run this before production deployment:

```bash
#!/bin/bash
# security-check.sh

echo "🔒 Running security checks..."

# Check for hardcoded secrets
echo "Checking for hardcoded secrets..."
if grep -r "dsn: \"https://" apps/portfolio/sentry.*.ts; then
  echo "❌ FAIL: Hardcoded Sentry DSN found"
  exit 1
fi

# Check .env is ignored
echo "Checking .gitignore..."
if git check-ignore apps/cms/.env apps/portfolio/.env | grep -q .env; then
  echo "✅ PASS: .env files are ignored"
else
  echo "❌ FAIL: .env files not in .gitignore"
  exit 1
fi

# Check for default passwords in production env
if grep -q "DATABASE_PASSWORD=strapi" apps/cms/.env && [ "$NODE_ENV" = "production" ]; then
  echo "❌ FAIL: Default database password in production"
  exit 1
fi

echo "✅ All security checks passed!"
```

---

**Last Updated:** 2025-12-03
**Checklist Version:** v1.0.0

Use this checklist before every production deployment to ensure security best practices are followed.
