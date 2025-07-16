#!/bin/bash

# List of files to update with logo
files=(
    "goat-records.html"
    "breeding-records.html"
    "products-management.html"
    "health-records.html"
    "contact-management.html"
    "task-manager.html"
    "reminders.html"
    "financial-records.html"
    "sales-records.html"
    "feed-schedule.html"
    "crop-management.html"
    "meat-production.html"
    "land-lease-records.html"
    "machinery-equipment.html"
    "casual-laborers.html"
    "tax-records.html"
)

echo "Adding logo images to farm management modules..."

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        
        # Add logo image before the h1 title in each file
        sed -i 's|<div class="logo">|<div class="logo">\n                <img src="The_Mountain_Goat_Farm_Logo_Media (2).png" alt="The Mountain Goat Farm Logo">|g' "$file"
    fi
done

echo "Logo branding update complete!"
