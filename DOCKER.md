# Docker Setup for NextPlacement

This document explains how to use Docker with the NextPlacement monorepo.

## Overview

The project contains three Dockerfiles:
- `Dockerfile` - Root-level Dockerfile for the entire monorepo
- `apps/admin/Dockerfile` - Specific Dockerfile for the admin application
- `apps/student/Dockerfile` - Specific Dockerfile for the student application

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and run both applications:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode:**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Individual Application Builds

#### Build Admin Application
```bash
docker build -f apps/admin/Dockerfile -t nextplacement-admin .
docker run -p 3001:3001 nextplacement-admin
```

#### Build Student Application
```bash
docker build -f apps/student/Dockerfile -t nextplacement-student .
docker run -p 3000:3000 nextplacement-student
```

#### Build Entire Monorepo
```bash
docker build -t nextplacement .
docker run -p 3000:3000 nextplacement
```

## Ports

- **Student Application**: `http://localhost:3000`
- **Admin Application**: `http://localhost:3001`

## Environment Variables

Create a `.env` file in the root directory with your environment variables:

```env
# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Other environment variables...
```

Then uncomment the `env_file` section in `docker-compose.yml`:

```yaml
env_file:
  - .env
```

## Dockerfile Features

### Multi-stage Builds
- **deps stage**: Installs dependencies with optimal caching
- **builder stage**: Builds the application
- **runner stage**: Creates the production image

### Security
- Runs as non-root user (`nextjs`)
- Minimal attack surface with Alpine Linux
- Proper file permissions

### Performance
- Layer caching optimization
- Standalone Next.js output
- Minimal production image size

### Monorepo Support
- Handles workspace dependencies
- Builds shared packages (`@workspace/ui`, `@workspace/db`)
- Uses Turbo for efficient builds

## Development with Docker

### Development Mode
For development, you can mount the source code:

```bash
docker run -v $(pwd):/app -p 3000:3000 nextplacement
```

### Hot Reload
To enable hot reload in development:

```bash
docker-compose -f docker-compose.dev.yml up
```

## Production Deployment

### Environment Variables
Ensure all required environment variables are set:

```bash
docker run -e DATABASE_URL="..." -e NEXTAUTH_SECRET="..." -p 3000:3000 nextplacement
```

### Health Checks
The docker-compose configuration includes health checks that verify the applications are running properly.

### Scaling
You can scale individual services:

```bash
docker-compose up --scale student=3 --scale admin=2
```

## Troubleshooting

### Build Issues
1. **Clear Docker cache:**
   ```bash
   docker system prune -a
   ```

2. **Rebuild without cache:**
   ```bash
   docker-compose build --no-cache
   ```

### Runtime Issues
1. **Check logs:**
   ```bash
   docker-compose logs student
   docker-compose logs admin
   ```

2. **Access container shell:**
   ```bash
   docker-compose exec student sh
   ```

### Port Conflicts
If ports 3000 or 3001 are already in use, modify the `docker-compose.yml`:

```yaml
ports:
  - "3002:3000"  # Map to different host port
```

## Best Practices

1. **Always use specific image tags in production**
2. **Set up proper logging and monitoring**
3. **Use secrets management for sensitive data**
4. **Implement proper backup strategies**
5. **Monitor resource usage**

## Advanced Configuration

### Custom Dockerfile
You can create custom Dockerfiles for specific environments:

```dockerfile
# Dockerfile.prod
FROM node:22-alpine AS base
# ... production-specific configuration
```

### Docker Compose Overrides
Create `docker-compose.override.yml` for local development:

```yaml
version: '3.8'
services:
  student:
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

## Monitoring

### Health Checks
The applications include health check endpoints. Create an API route:

```typescript
// apps/student/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok' })
}
```

### Logging
Configure proper logging for production:

```bash
docker-compose up --build 2>&1 | tee app.log
```

## Security Considerations

1. **Never commit `.env` files**
2. **Use Docker secrets for sensitive data**
3. **Regularly update base images**
4. **Scan images for vulnerabilities**
5. **Implement proper network policies**

## Performance Optimization

1. **Use multi-stage builds** (already implemented)
2. **Optimize layer caching** (already implemented)
3. **Use `.dockerignore`** (already implemented)
4. **Consider using BuildKit**
5. **Monitor image sizes**

## Support

For issues related to Docker setup, check:
1. Docker logs
2. Application logs
3. Network connectivity
4. Environment variables
5. File permissions 