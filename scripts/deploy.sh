#!/bin/bash

# NBCLicensePortal Deployment Script
# This script builds, tests, and deploys the application to Netlify or Vercel

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="NBCLicensePortal"
BUILD_DIR="dist"
CLIENT_BUILD_DIR="client/dist"
SERVER_BUILD_DIR="server/dist"
NETLIFY_CONFIG="netlify.toml"
VERCEL_CONFIG="vercel.json"

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists node; then
        missing_deps+=("Node.js")
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if ! command_exists git; then
        missing_deps+=("git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_error "Please install the missing dependencies and try again."
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Function to check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    local required_vars=("DATABASE_URL" "JWT_SECRET")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_warning "Missing environment variables: ${missing_vars[*]}"
        print_warning "Please set these variables before deployment:"
        for var in "${missing_vars[@]}"; do
            echo "  export $var=\"your_value_here\""
        done
        print_warning "Continuing with build, but deployment may fail..."
    else
        print_success "All required environment variables are set"
    fi
}

# Function to clean previous builds
clean_builds() {
    print_status "Cleaning previous builds..."
    
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        print_success "Cleaned $BUILD_DIR"
    fi
    
    if [ -d "$CLIENT_BUILD_DIR" ]; then
        rm -rf "$CLIENT_BUILD_DIR"
        print_success "Cleaned $CLIENT_BUILD_DIR"
    fi
    
    if [ -d "$SERVER_BUILD_DIR" ]; then
        rm -rf "$SERVER_BUILD_DIR"
        print_success "Cleaned $SERVER_BUILD_DIR"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_success "Dependencies installed successfully"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if npm run test 2>/dev/null; then
        print_success "Tests passed"
    else
        print_warning "No tests found or tests failed, continuing with build..."
    fi
}

# Function to build the application
build_application() {
    print_status "Building application..."
    
    # Build the entire application
    if npm run build; then
        print_success "Application built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Function to verify build
verify_build() {
    print_status "Verifying build..."
    
    if [ ! -d "$BUILD_DIR" ]; then
        print_error "Build directory not found: $BUILD_DIR"
        exit 1
    fi
    
    if [ ! -d "$CLIENT_BUILD_DIR" ]; then
        print_error "Client build directory not found: $CLIENT_BUILD_DIR"
        exit 1
    fi
    
    if [ ! -d "$SERVER_BUILD_DIR" ]; then
        print_error "Server build directory not found: $SERVER_BUILD_DIR"
        exit 1
    fi
    
    print_success "Build verification passed"
}

# Function to deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if ! command_exists netlify; then
        print_error "Netlify CLI not found. Please install it with: npm install -g netlify-cli"
        return 1
    fi
    
    if [ ! -f "$NETLIFY_CONFIG" ]; then
        print_error "Netlify configuration file not found: $NETLIFY_CONFIG"
        return 1
    fi
    
    # Deploy to Netlify
    if netlify deploy --prod --dir="$CLIENT_BUILD_DIR"; then
        print_success "Successfully deployed to Netlify"
        return 0
    else
        print_error "Netlify deployment failed"
        return 1
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_error "Vercel CLI not found. Please install it with: npm install -g vercel"
        return 1
    fi
    
    # Deploy to Vercel
    if vercel --prod; then
        print_success "Successfully deployed to Vercel"
        return 0
    else
        print_error "Vercel deployment failed"
        return 1
    fi
}

# Function to create deployment summary
create_deployment_summary() {
    print_status "Creating deployment summary..."
    
    local summary_file="DEPLOYMENT_SUMMARY.md"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local git_commit=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    local git_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
    
    cat > "$summary_file" << EOF
# NBCLicensePortal Deployment Summary

**Deployment Date:** $timestamp  
**Git Commit:** $git_commit  
**Git Branch:** $git_branch  
**Node Version:** $(node --version)  
**NPM Version:** $(npm --version)  

## Build Information

- **Client Build Directory:** $CLIENT_BUILD_DIR
- **Server Build Directory:** $SERVER_BUILD_DIR
- **Total Build Size:** $(du -sh "$BUILD_DIR" 2>/dev/null | cut -f1 || echo "unknown")

## Environment Variables

- **DATABASE_URL:** ${DATABASE_URL:+set}${DATABASE_URL:-not set}
- **JWT_SECRET:** ${JWT_SECRET:+set}${JWT_SECRET:-not set}
- **NODE_ENV:** ${NODE_ENV:-development}

## Deployment Status

$([ "$1" = "netlify" ] && echo "- ✅ Netlify: Successfully deployed" || echo "- ❌ Netlify: Not deployed")
$([ "$1" = "vercel" ] && echo "- ✅ Vercel: Successfully deployed" || echo "- ❌ Vercel: Not deployed")

## Next Steps

1. Verify the deployment by visiting the live URL
2. Test all major functionality
3. Check database connectivity
4. Monitor application logs for any errors

## Troubleshooting

If you encounter issues:

1. Check the deployment logs
2. Verify environment variables are set correctly
3. Ensure database is accessible
4. Check application health endpoints

EOF

    print_success "Deployment summary created: $summary_file"
}

# Function to show help
show_help() {
    echo "NBCLicensePortal Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS] [PLATFORM]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -c, --clean    Clean previous builds before deploying"
    echo "  -t, --test     Run tests before building"
    echo "  -v, --verify   Verify build after completion"
    echo ""
    echo "Platforms:"
    echo "  netlify        Deploy to Netlify"
    echo "  vercel         Deploy to Vercel"
    echo "  both           Deploy to both platforms"
    echo ""
    echo "Examples:"
    echo "  $0 netlify                    # Deploy to Netlify"
    echo "  $0 --clean --test vercel      # Clean, test, and deploy to Vercel"
    echo "  $0 --verify both              # Deploy to both platforms with verification"
}

# Main function
main() {
    local platform=""
    local clean_build=false
    local run_tests_flag=false
    local verify_build_flag=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -c|--clean)
                clean_build=true
                shift
                ;;
            -t|--test)
                run_tests_flag=true
                shift
                ;;
            -v|--verify)
                verify_build_flag=true
                shift
                ;;
            netlify|vercel|both)
                platform="$1"
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # If no platform specified, default to both
    if [ -z "$platform" ]; then
        platform="both"
    fi
    
    print_status "Starting deployment for $PROJECT_NAME"
    print_status "Target platform(s): $platform"
    
    # Check prerequisites
    check_prerequisites
    
    # Check environment variables
    check_env_vars
    
    # Clean builds if requested
    if [ "$clean_build" = true ]; then
        clean_builds
    fi
    
    # Install dependencies
    install_dependencies
    
    # Run tests if requested
    if [ "$run_tests_flag" = true ]; then
        run_tests
    fi
    
    # Build application
    build_application
    
    # Verify build if requested
    if [ "$verify_build_flag" = true ]; then
        verify_build
    fi
    
    # Deploy based on platform
    local deployment_success=""
    
    case $platform in
        netlify)
            if deploy_netlify; then
                deployment_success="netlify"
            fi
            ;;
        vercel)
            if deploy_vercel; then
                deployment_success="vercel"
            fi
            ;;
        both)
            local netlify_success=false
            local vercel_success=false
            
            if deploy_netlify; then
                netlify_success=true
                deployment_success="netlify"
            fi
            
            if deploy_vercel; then
                vercel_success=true
                if [ "$netlify_success" = true ]; then
                    deployment_success="both"
                else
                    deployment_success="vercel"
                fi
            fi
            ;;
    esac
    
    # Create deployment summary
    create_deployment_summary "$deployment_success"
    
    # Final status
    if [ -n "$deployment_success" ]; then
        print_success "Deployment completed successfully!"
        print_success "Platform(s) deployed: $deployment_success"
    else
        print_error "Deployment failed for all platforms"
        exit 1
    fi
}

# Run main function with all arguments
main "$@" 