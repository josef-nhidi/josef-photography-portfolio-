#!/bin/bash
# =============================================================================
# Josef Photography — Azure VM Setup Script
# =============================================================================
# Run this script on a FRESH Ubuntu 22.04/24.04 Azure VM to set up everything.
#
# Usage:
#   1. SSH into your Azure VM
#   2. Upload this script:  scp deploy-azure.sh azureuser@YOUR_VM_IP:~/
#   3. Run it:              chmod +x deploy-azure.sh && ./deploy-azure.sh
# =============================================================================

set -e  # Exit on any error

echo "============================================="
echo "  Josef Photography — Azure VM Setup"
echo "============================================="

# --- Colors for output ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

step() { echo -e "\n${GREEN}▸ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
error() { echo -e "${RED}✖ $1${NC}"; exit 1; }

# =============================================================================
# STEP 1: System Updates
# =============================================================================
step "Updating system packages..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq

# =============================================================================
# STEP 2: Install Docker
# =============================================================================
step "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker $USER
    echo "Docker installed successfully."
else
    echo "Docker already installed, skipping."
fi

# =============================================================================
# STEP 3: Install Docker Compose Plugin
# =============================================================================
step "Installing Docker Compose..."
if ! docker compose version &> /dev/null; then
    sudo apt-get install -y docker-compose-plugin
    echo "Docker Compose installed successfully."
else
    echo "Docker Compose already installed, skipping."
fi

# =============================================================================
# STEP 4: Install Git
# =============================================================================
step "Installing Git..."
sudo apt-get install -y -qq git

# =============================================================================
# STEP 5: Clone the Repository
# =============================================================================
APP_DIR="/opt/josef-photography"

if [ -d "$APP_DIR" ]; then
    warn "Directory $APP_DIR already exists. Pulling latest changes..."
    cd "$APP_DIR"
    sudo git pull
else
    step "Cloning repository..."
    echo ""
    echo "Enter your GitHub repository URL (e.g., https://github.com/username/josef-website.git):"
    read -r REPO_URL
    sudo git clone "$REPO_URL" "$APP_DIR"
    sudo chown -R $USER:$USER "$APP_DIR"
    cd "$APP_DIR"
fi

# =============================================================================
# STEP 6: Configure Environment
# =============================================================================
step "Setting up environment configuration..."

if [ ! -f "$APP_DIR/backend/.env" ]; then
    cp "$APP_DIR/backend/.env.production" "$APP_DIR/backend/.env"

    # Generate a random APP_KEY
    APP_KEY=$(openssl rand -base64 32)
    sed -i "s|APP_KEY=|APP_KEY=base64:${APP_KEY}|" "$APP_DIR/backend/.env"

    # Generate strong random passwords
    DB_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
    DB_ROOT_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
    sed -i "s|CHANGE_ME_TO_A_STRONG_PASSWORD|${DB_PASS}|" "$APP_DIR/backend/.env"
    sed -i "s|CHANGE_ME_ROOT_PASSWORD|${DB_ROOT_PASS}|" "$APP_DIR/backend/.env"

    # Get the VM's public IP
    PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_VM_IP")
    sed -i "s|YOUR_DOMAIN_OR_IP|${PUBLIC_IP}|g" "$APP_DIR/backend/.env"

    echo ""
    echo -e "${GREEN}✔ Environment file created at $APP_DIR/backend/.env${NC}"
    echo -e "${YELLOW}  Database password: ${DB_PASS}${NC}"
    echo -e "${YELLOW}  Root DB password:  ${DB_ROOT_PASS}${NC}"
    echo -e "${YELLOW}  (Save these somewhere safe!)${NC}"
else
    warn "Environment file already exists. Skipping configuration."
fi

# =============================================================================
# STEP 7: Create Docker Compose .env for DB credentials
# =============================================================================
step "Creating Docker Compose environment..."

if [ -f "$APP_DIR/backend/.env" ]; then
    # Extract DB credentials from Laravel .env to pass to docker-compose
    DB_DATABASE=$(grep "^DB_DATABASE=" "$APP_DIR/backend/.env" | cut -d'=' -f2)
    DB_USERNAME=$(grep "^DB_USERNAME=" "$APP_DIR/backend/.env" | cut -d'=' -f2)
    DB_PASSWORD=$(grep "^DB_PASSWORD=" "$APP_DIR/backend/.env" | cut -d'=' -f2)
    DB_ROOT_PASSWORD=$(grep "^DB_ROOT_PASSWORD=" "$APP_DIR/backend/.env" | cut -d'=' -f2)

    cat > "$APP_DIR/.env" <<EOF
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
EOF
    echo "Docker Compose .env created."
fi

# =============================================================================
# STEP 8: Build and Start Containers
# =============================================================================
step "Building and starting Docker containers..."
cd "$APP_DIR"
docker compose -f docker-compose.prod.yml up -d --build

# =============================================================================
# STEP 9: Run Laravel Setup Commands
# =============================================================================
step "Running Laravel setup (migrations, storage link, cache)..."

# Wait for the DB to be ready
echo "Waiting for database to become healthy..."
sleep 10

docker exec josef-app php artisan storage:link 2>/dev/null || true
docker exec josef-app php artisan config:cache
docker exec josef-app php artisan route:cache
docker exec josef-app php artisan view:cache

# =============================================================================
# STEP 10: Setup UFW Firewall
# =============================================================================
step "Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# =============================================================================
# DONE!
# =============================================================================
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_VM_IP")
echo ""
echo "============================================="
echo -e "${GREEN}  ✔ DEPLOYMENT COMPLETE!${NC}"
echo "============================================="
echo ""
echo "  Your website is live at:"
echo -e "  ${GREEN}http://${PUBLIC_IP}${NC}"
echo ""
echo "  Admin panel:"
echo -e "  ${GREEN}http://${PUBLIC_IP}/admin${NC}"
echo ""
echo "  Useful commands:"
echo "    View logs:      docker compose -f docker-compose.prod.yml logs -f"
echo "    Stop:           docker compose -f docker-compose.prod.yml down"
echo "    Restart:        docker compose -f docker-compose.prod.yml restart"
echo "    Update:         git pull && docker compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "  Next steps:"
echo "    1. Point your domain DNS to ${PUBLIC_IP}"
echo "    2. Set up SSL with: sudo certbot --nginx (install certbot first)"
echo "============================================="
