# Docker Setup for Bimeh

This document explains how to use Docker to run the Bimeh application in different environments.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system
- Git (to clone the repository)

## Environment Configuration

The application uses environment variables defined in the `.env` file. Make sure to configure these variables according to your environment:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://auth.exmodules.org/api/v1/

# File Upload Service Configuration
NEXT_PUBLIC_UPLOAD_BASE_URL=https://provider.exmodules.org/api/v1/file-manager

# Main API Endpoints
NEXT_PUBLIC_AUTH_API_URL=https://auth.exmodules.org/api/v1
NEXT_PUBLIC_PET_API_URL=https://auth.exmodules.org/api/v1
NEXT_PUBLIC_USER_API_URL=https://auth.exmodules.org/api/v1

# Application Configuration
NEXT_PUBLIC_APP_NAME=Bimeh
NEXT_PUBLIC_APP_VERSION=0.1.0

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_IS_DEVELOPMENT=true
```

## Running the Application

### Development Mode

To run the application in development mode with hot reloading:

```bash
# Start development environment
docker-compose --profile dev up

# Or run in background
docker-compose --profile dev up -d
```

The application will be available at `http://localhost:3000`

### Production Mode

To run the application in production mode:

```bash
# Start production environment
docker-compose --profile prod up

# Or run in background
docker-compose --profile prod up -d
```

## Building the Docker Image

To build the Docker image manually:

```bash
# Build the image
docker build -t bimeh .

# Run the container
docker run -p 3000:3000 --env-file .env bimeh
```

## Docker Commands

### View running containers
```bash
docker-compose ps
```

### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs bimeh-dev
docker-compose logs bimeh-prod
```

### Stop services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Rebuild services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build bimeh-dev
```

## Environment-Specific Configurations

### Development
- Uses volume mounting for hot reloading
- Includes development dependencies
- Runs with `npm run dev`

### Production
- Optimized build with standalone output
- Excludes development dependencies
- Runs with `node server.js`
- Includes security headers and optimizations

## Troubleshooting

### Port conflicts
If port 3000 is already in use, you can change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change 3001 to any available port
```

### Environment variables not loading
Make sure the `.env` file exists and contains the required variables. You can also pass environment variables directly:

```bash
docker-compose --profile prod up -e NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

### Build issues
If you encounter build issues, try cleaning up Docker cache:

```bash
docker system prune -a
docker-compose build --no-cache
```

### Permission issues
On Linux systems, you might need to run Docker commands with sudo:

```bash
sudo docker-compose --profile dev up
```

## Performance Optimization

The Docker setup includes several optimizations:

1. **Multi-stage builds**: Reduces final image size
2. **Standalone output**: Optimized for production deployment
3. **Security headers**: Enhances security

## Monitoring

To monitor the application:

```bash
# View resource usage
docker stats

# View logs in real-time
docker-compose logs -f

# Check container health
docker-compose ps
```

## Deployment

For production deployment, consider:

1. Using a proper domain name
2. Setting up SSL certificates
3. Configuring environment-specific variables
4. Setting up monitoring and logging
5. Using a container orchestration platform like Kubernetes

## Support

If you encounter any issues with the Docker setup, please check:

1. Docker and Docker Compose versions
2. Environment variable configuration
3. Port availability
4. Network connectivity
5. File permissions
