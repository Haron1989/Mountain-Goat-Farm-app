#!/bin/bash

# Files that need navigation updates
files=(
    "breeding-records.html"
    "products-management.html"
    "health-records.html"
    "contact-management.html"
    "task-manager.html"
    "reminders.html"
    "financial-records.html"
    "feed-schedule.html"
    "sales-records.html"
    "crop-management.html"
    "meat-production.html"
    "land-lease-records.html"
    "machinery-equipment.html"
    "casual-laborers.html"
)

# Add missing navigation items
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating navigation in $file..."
        
        # Check if the file already has the new navigation items
        if ! grep -q "land-lease-records.html" "$file"; then
            # Replace the logout button with the new navigation items
            sed -i 's|<li><a href="crop-management.html">Crops</a></li>.*<li><button id="logout-btn">Logout</button></li>|<li><a href="crop-management.html">Crops</a></li>\n                <li><a href="land-lease-records.html">Land Lease</a></li>\n                <li><a href="machinery-equipment.html">Equipment</a></li>\n                <li><a href="casual-laborers.html">Laborers</a></li>\n                <li><button id="logout-btn">Logout</button></li>|g' "$file"
        fi
    fi
done

echo "Navigation update complete!"
