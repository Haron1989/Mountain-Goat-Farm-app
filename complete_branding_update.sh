#!/bin/bash

# Complete branding update script for Mountain Goat Farm app
echo "Starting comprehensive branding updates..."

# Array of farm module files (excluding index.html, farm-records.html and tax-records.html which are already updated)
FILES=(
    "breeding-records.html"
    "casual-laborers.html"
    "contact-management.html"
    "crop-management.html"
    "download-files.html"
    "feed-schedule.html"
    "financial-records.html"
    "health-records.html"
    "land-lease-records.html"
    "machinery-equipment.html"
    "meat-production.html"
    "products-management.html"
    "reminders.html"
    "sales-records.html"
    "settings-permissions.html"
    "task-manager.html"
)

# Process each file
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        
        # Add enhanced login modal with logo (if login modal exists)
        if grep -q "login-modal" "$file"; then
            # Update login modal header with logo
            sed -i '/<div class="modal-content">/,/<h2>Login<\/h2>/ {
                /<h2>Login<\/h2>/ {
                    i\                <div class="login-header">
                    i\                    <img src="The_Mountain_Goat_Farm_Logo_Media (2).png" alt="Mountain Goat Farm Logo" class="login-logo">
                    i\                    <h2>Welcome to Mountain Goat Farm</h2>
                    i\                    <p>Manage your farm operations with precision</p>
                    i\                </div>
                    d
                }
            }' "$file"
        fi
        
        # Add farm slogan before main content
        if grep -q "<main>" "$file"; then
            sed -i '/<main>/a\        <div class="farm-slogan">"Excellence in Mountain Goat Farming - From the foothills of Mount Kenya"</div>' "$file"
        fi
        
        # Add mountain divider before footer (if container exists)
        if grep -q "</main>" "$file"; then
            sed -i '/<\/main>/i\    <div class="mountain-divider-enhanced"></div>' "$file"
        fi
        
        # Add enhanced footer
        if ! grep -q "farm-footer" "$file"; then
            sed -i '/<\/body>/i\    <footer class="farm-footer">\
        <div class="farm-slogan">"Excellence in Mountain Goat Farming"</div>\
        <p>&copy; 2024 Mountain Goat Farm Management System. Proudly serving from Mount Kenya region.</p>\
    </footer>' "$file"
        fi
        
        # Update meta description for SEO
        if grep -q 'name="description"' "$file"; then
            sed -i 's/content="[^"]*"/content="Mountain Goat Farm Management System - Professional livestock management from the foothills of Mount Kenya. Excellence in agricultural operations."/' "$file"
        fi
        
        echo "✓ $file updated successfully"
    else
        echo "⚠ $file not found"
    fi
done

echo "Branding updates complete! All farm modules now have:"
echo "- Enhanced login modals with farm logo"
echo "- Farm slogan placement" 
echo "- Mountain dividers with Mount Kenya references"
echo "- Professional footer branding"
echo "- Updated meta descriptions"
