# Josef Nhidi Photography Portfolio 📸✨

A premium, high-fidelity photography portfolio and studio management system built with a modern, decoupled architecture. This platform is designed for cinematic visual impact, extreme security, and effortless content management.

## 🏗️ Technical Architecture

### Frontend (React + Vite)
The frontend follows a strictly modular, hook-based architecture designed for performance and maintainability.

- **Hook-Based Logic**: Business logic is decoupled from the UI using custom hooks.
  - `useSecurity`: Orchestrates global content protection (context-menu blocking, keyboard shortcuts).
  - `useSettings`: Manages dynamic site configuration and branding tokens.
  - `useAdmin`: Centralized state and CRUD orchestrator for the Studio Dashboard.
  - `useAuth`: Secure session and token management.
- **Categorized Components**: 
  - `ui/`: Foundation & experience elements (SEO, Transitions, Custom Cursor).
  - `portfolio/`: Gallery-specific logic (Masonry, Protected Images, Lightboxes).
  - `admin/`: Modular dashboard panels.
  - `layout/`: Persistent structural components.
- **Styling**: Uses a centralized design system in `src/styles/`, utilizing CSS variables for theme-aware branding.

### Backend (Laravel API)
A robust RESTful API that powers the portfolio with secure data persistence.

- **Eloquent ORM**: Highly optimized database queries for photos and album orchestration.
- **Sanctum Auth**: Token-based security for the administrative layer.
- **Image Processing**: Automatic optimization and watermarked delivery.

## 🛡️ Content Protection System
This platform implements a multi-layer security system to protect intellectual property:
1.  **Pixel-Level Canvas Rendering**: Photos are not served as static `<img>` tags but are drawn into browser memory using a specialized `<canvas>` protector.
2.  **Pointer Interruption**: Invisible security overlays prevent standard "Save As" attempts.
3.  **Global Shortcut Blocking**: Disables DevTools and screenshot-related keyboard shortcuts.
4.  **Dynamic Watermarking**: "Burnt-in" pixel watermarks are applied dynamically to protected content.

## 🚀 Performance & SEO
- **Cinematic Dark Mode**: Theme-aware CSS filters for deep obsidian aesthetics.
- **JSON-LD Schema**: Full structured data implementation for Rich Search Results.
- **Vite-Powered**: Instant HMR and high-performance production builds.
- **Dynamic Meta**: Page-specific SEO titles and descriptions powered by the admin settings.

---

## ☁️ Azure PaaS Deployment Guide (Step-by-Step)

This project uses a high-performance, cost-effective split architecture. The frontend is hosted on **Azure Static Web Apps** (Free), and the backend runs on **Azure App Service** (~$13/mo).

### Step 1: Prepare Your Code
1. Push your latest code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure Azure deployment"
   git push origin main
   ```
2. Generate a secure Laravel App Key locally:
   ```bash
   php artisan key:generate --show
   ```
   *Keep this string (starting with `base64:`) ready.*

---

### Step 2: Deploy the Frontend (Static Web App)
1. Go to the [Azure Portal](https://portal.azure.com).
2. Create a **Static Web App**.
3. **Project Details**:
   - name: `josef-photography-ui`
   - Plan type: **Free**
   - Azure Functions/Staging location: (Choose nearest region)
4. **Deployment Details**:
   - Source: **GitHub**
   - Select your Organization, Repository, and Branch (`main`).
5. **Build Details**:
   - Build Presets: **React**
   - App location: `/frontend`
   - Api location: *(Leave empty)*
   - Output location: `dist`
6. Click **Review + Create**, then **Create**.
7. Once created, go to **Custom domains** in the Sidebar and add `josefnhidi.me`. Follow Azure's instructions to verify ownership via CNAME.

---

### Step 3: Deploy the Backend (App Service)
1. In the Azure Portal, create a **Web App**.
2. **Project Details**:
   - name: `josef-photography-api`
   - Publish: **Code**
   - Runtime stack: **PHP 8.2** (or 8.3/8.4)
   - Operating System: **Linux**
   - Region: (Same as your Static Web App)
3. **Pricing Plan**:
   - Change size to **Basic B1** (minimum for custom domains and stability).
4. Click **Review + Create**, then **Create**.
5. **Configuration (Environment Variables)**:
   - Go to the new Web App → **Settings** → **Configuration** → **Application settings**.
   - Add these New application settings:
     - `APP_ENV` = `production`
     - `APP_DEBUG` = `false`
     - `APP_KEY` = (The base64 key you generated in Step 1)
     - `DB_CONNECTION` = `sqlite`
     - `DB_DATABASE` = `/home/site/wwwroot/database/database.sqlite`
     - `FRONTEND_URL` = `https://josefnhidi.me`
   - Click **Save**.

---

### Step 4: Link GitHub Actions
1. Download the **Publish Profile** from your App Service Overview page.
2. In your GitHub Repository → **Settings** → **Secrets and variables** → **Actions**.
3. Create a new repository secret:
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: (Paste the contents of the download file)
4. Go to the **Actions** tab in GitHub and re-run the `Deploy Backend` workflow.

---

### Step 5: Initialize Database & Admin (SSH)
Once the backend deployment is green (complete):
1. In the Azure Portal, go to your Web App → **Development Tools** → **SSH** → **Go**.
2. Run these exact commands in order:
   ```bash
   cd /home/site/wwwroot
   
   # Setup database file
   mkdir -p database
   touch database/database.sqlite
   
   # Run migrations and seed data
   php artisan migrate --force
   php artisan db:seed --class=SettingsSeeder
   php artisan db:seed --class=AboutContentSeeder
   
   # Create your secure Admin account
   php artisan setup:admin
   ```
   *Follow the prompts to set your email and password.*

---

### Step 6: DNS (Namecheap)
In your Namecheap Advanced DNS settings:
- **CNAME Record**: Host: `@` | Value: `(Your Azure Static Web App URL)`
- **CNAME Record**: Host: `www` | Value: `(Your Azure Static Web App URL)`
- **CNAME Record**: Host: `api` | Value: `(Your Azure App Service URL)`

---
*Architected for excellence. Optimized for the lens.*

---
*Architected for excellence. Optimized for the lens.*
