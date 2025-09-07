#!/bin/bash

echo "🔍 Finding unused images..."

# Get all image files
all_images=$(find public/images -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.svg" \) | sed 's|public||g')

# Get referenced images from database files
referenced_images=$(grep -r "images/" server/data/ | grep -o "/images/[^\"]*" | sort | uniq)

echo "📊 Total images found: $(echo "$all_images" | wc -l)"
echo "📊 Referenced images: $(echo "$referenced_images" | wc -l)"

# Find unused images
unused_images=""
for image in $all_images; do
    if ! echo "$referenced_images" | grep -q "^$image$"; then
        unused_images="$unused_images$image\n"
    fi
done

if [ -n "$unused_images" ]; then
    echo -e "\n🗑️ Unused images to be removed:"
    echo -e "$unused_images"
    
    echo -e "\n🗑️ Removing unused images..."
    echo -e "$unused_images" | while read -r image; do
        if [ -n "$image" ]; then
            rm -f "public$image"
            echo "   ✅ Removed: public$image"
        fi
    done
    
    echo -e "\n✅ Cleanup complete!"
else
    echo "✅ No unused images found!"
fi