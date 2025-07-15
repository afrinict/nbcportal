#!/bin/bash

# NBC License Portal Deployment Script
# This script helps deploy the application to different platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ -z "$DATABASE_URL" ]; then
        print_error "DATABASE_URL is not set"
        exit 1
    fi
    
    if [ -z "$JWT_SECRET" ]; then
        print_error "JWT_SECRET is not set"
        exit 1
    fi
    
    print_success "Environment variables are set"
}

# Function to install dependencies
install_deps() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Function to run type check
type_check() {
    print_status "Running TypeScript type check..."
    npm run type-check
    print_success "Type check passed"
}

# Function to build the application
build_app() {
    print_status "Building application..."
    npm run build
    print_success "Application built successfully"
}

# Function to test the build
test_build() {
    print_status "Testing build..."
    
    if [ ! -d "dist" ]; then
        print_error "Build directory not found"
        exit 1
    fi
    
    if [ ! -d "dist/public" ]; then
        print_error "Public build directory not found"
        exit 1
    fi
    
    if [ ! -f "dist/index.js" ]; then
        print_error "Server build not found"
        exit 1
    fi
    
    print_success "Build test passed"
}

# Function to deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command_exists netlify; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Check if we're in a Netlify environment
    if [ -n "$NETLIFY" ]; then
        print_status "Running in Netlify environment"
        build_app
    else
        print_status "Deploying to Netlify..."
        netlify deploy --prod --dir=dist/public
    fi
    
    print_success "Deployed to Netlify"
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    vercel --prod
    print_success "Deployed to Vercel"
}

# Function to create production build
production_build() {
    print_status "Creating production build..."
    
    # Set production environment
    export NODE_ENV=production
    
    # Install dependencies
    install_deps
    
    # Type check
    type_check
    
    # Build application
    build_app
    
    # Test build
    test_build
    
    print_success "Production build completed"
}

# Function to show help
show_help() {
    echo "NBC License Portal Deployment Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  build       Create a production build"
    echo "  netlify     Deploy to Netlify"
    echo "  vercel      Deploy to Vercel"
    echo "  test        Run tests"
    echo "  clean       Clean build artifacts"
    echo "  help        Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DATABASE_URL    PostgreSQL connection string"
    echo "  JWT_SECRET      Secret key for JWT tokens"
    echo "  NODE_ENV        Environment (development/production)"
    echo ""
    echo "Examples:"
    echo "  $0 build"
    echo "  $0 netlify"
    echo "  DATABASE_URL=postgresql://... JWT_SECRET=... $0 build"
}

# Main script logic
case "${1:-help}" in
    "build")
        check_env_vars
        production_build
        ;;
    "netlify")
        check_env_vars
        production_build
        deploy_netlify
        ;;
    "vercel")
        check_env_vars
        production_build
        deploy_vercel
        ;;
    "test")
        install_deps
        npm run test
        ;;
    "clean")
        print_status "Cleaning build artifacts..."
        rm -rf dist
        rm -rf node_modules
        print_success "Clean completed"
        ;;
    "help"|*)
        show_help
        ;;
esac 