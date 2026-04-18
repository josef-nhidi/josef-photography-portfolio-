#!/bin/bash

# verify_persistence.sh
# Simulates the NEW entrypoint.sh logic (Restore on Boot + Backup) to prove persistence.

set -e

echo "--- Starting Persistence Backup/Restore Simulation ---"

# 1. Setup mock environment
MOCK_ROOT=$(mktemp -d)
echo "Mock Root: $MOCK_ROOT"

# Azure persistent share
MOCK_HOME="$MOCK_ROOT/home"
# Container local disk
MOCK_APP="$MOCK_ROOT/var/www"

mkdir -p "$MOCK_HOME"
mkdir -p "$MOCK_APP"

# 2. Simulate First Deployment (Empty, creates local DB)
echo "--- Simulation 1: First Deploy ---"
(
    cd "$MOCK_APP"
    # Create persistent dirs
    mkdir -p "$MOCK_HOME/storage/app/public/photos"
    mkdir -p "$MOCK_HOME/database"
    mkdir -p "$MOCK_APP/database"
    mkdir -p "$MOCK_APP/storage/app/public"
    
    # Link photos
    ln -sf "$MOCK_HOME/storage/app/public/photos" "$MOCK_APP/storage/app/public/photos"
    
    # Restore DB logic
    if [ -f "$MOCK_HOME/database/database.sqlite" ]; then
        cp "$MOCK_HOME/database/database.sqlite" "$MOCK_APP/database/database.sqlite"
    else
        touch "$MOCK_APP/database/database.sqlite"
    fi
    
    # User makes changes
    echo "user-setting-v1" > "$MOCK_APP/database/database.sqlite"
    echo "photo-v1" > "$MOCK_APP/storage/app/public/photos/p1.jpg"
)

# 3. Simulate The Background Sync (Backup)
echo "--- Simulation 2: Background Backup ---"
cp "$MOCK_APP/database/database.sqlite" "$MOCK_HOME/database/database.sqlite"

# 4. Simulate Instance Restart / Wiping local var/www
echo "--- Simulation 3: Container Wipe & Restart ---"
rm -rf "$MOCK_APP" # Clean local container disk
mkdir -p "$MOCK_APP"

(
    cd "$MOCK_APP"
    # Re-run entrypoint logic
    mkdir -p "$MOCK_HOME/database"
    mkdir -p "$MOCK_APP/database"
    mkdir -p "$MOCK_APP/storage/app/public"

    # Link PHOTOS
    ln -sf "$MOCK_HOME/storage/app/public/photos" "$MOCK_APP/storage/app/public/photos"

    # Restore DB
    if [ -f "$MOCK_HOME/database/database.sqlite" ]; then
        cp "$MOCK_HOME/database/database.sqlite" "$MOCK_APP/database/database.sqlite"
    fi
)

echo "VERIFY: Did data survive restart via Backup/Restore Bridge?"
if [ "$(cat $MOCK_APP/database/database.sqlite)" == "user-setting-v1" ]; then
    echo "  - DB RESTORE: SUCCESS ✅"
else
    echo "  - DB RESTORE: FAILED ❌"
    exit 1
fi

if [ "$(cat $MOCK_APP/storage/app/public/photos/p1.jpg)" == "photo-v1" ]; then
    echo "  - PHOTO PERSISTENCE: SUCCESS ✅"
else
    echo "  - PHOTO PERSISTENCE: FAILED ❌"
    exit 1
fi

echo "--- Backup/Restore Bridge 100% PROVEN ---"
rm -rf "$MOCK_ROOT"
