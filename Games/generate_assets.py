#!/usr/bin/env python3
"""
Generate game assets for Eco-Shredder game
This script creates PNG images for bins and items
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Create assets directory if it doesn't exist
assets_dir = os.path.join(os.path.dirname(__file__), 'assets')
os.makedirs(assets_dir, exist_ok=True)

bins = [
    {'name': 'bin_compost', 'color': (39, 174, 96), 'emoji': '♻️', 'label': 'COMPOST'},
    {'name': 'bin_containers', 'color': (52, 152, 219), 'emoji': '🗑️', 'label': 'CONTAINERS'},
    {'name': 'bin_paper', 'color': (243, 156, 18), 'emoji': '📄', 'label': 'PAPER'},
    {'name': 'bin_landfill', 'color': (127, 140, 141), 'emoji': '🚮', 'label': 'LANDFILL'}
]

items = [
    {'name': 'item_plastic_bottle', 'color': (52, 152, 219), 'emoji': '🍾'},
    {'name': 'item_banana_peel', 'color': (241, 196, 15), 'emoji': '🍌'},
    {'name': 'item_soda_can', 'color': (231, 76, 60), 'emoji': '🥫'},
    {'name': 'item_pizza_box', 'color': (230, 126, 34), 'emoji': '🍕'},
    {'name': 'item_office_paper', 'color': (236, 240, 241), 'emoji': '📃'},
    {'name': 'item_broken_glass', 'color': (149, 165, 166), 'emoji': '🔨'},
    {'name': 'item_coffee_cup', 'color': (142, 68, 173), 'emoji': '☕'}
]

def draw_bin(config):
    """Draw a bin image"""
    width, height = 120, 120
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    color = config['color']
    dark_color = tuple(int(c * 0.7) for c in color)
    lid_color = tuple(int(c * 0.8) for c in color)
    
    # Bin body
    draw.rounded_rectangle([10, 20, width-10, height-10], radius=8, fill=color)
    
    # Depth shade
    draw.rectangle([15, 25, width-15, 40], fill=dark_color)
    
    # Lid
    draw.rounded_rectangle([5, 10, width-5, 25], radius=5, fill=lid_color)
    
    # Border
    draw.rounded_rectangle([10, 20, width-10, height-10], radius=8, outline=(0, 0, 0, 80), width=3)
    
    # Handle
    draw.rectangle([width//2-15, 12, width//2+15, 20], outline=(0, 0, 0, 100), width=4)
    
    # Emoji
    try:
        font = ImageFont.truetype("seguiemj.ttf", 40)
    except:
        try:
            font = ImageFont.truetype("arial.ttf", 40)
        except:
            font = ImageFont.load_default()
    
    emoji_bbox = draw.textbbox((0, 0), config['emoji'], font=font)
    emoji_width = emoji_bbox[2] - emoji_bbox[0]
    emoji_height = emoji_bbox[3] - emoji_bbox[1]
    draw.text((width//2 - emoji_width//2, height//2 - emoji_height//2 + 5), 
              config['emoji'], fill=(255, 255, 255), font=font)
    
    # Label
    try:
        label_font = ImageFont.truetype("arialbd.ttf", 10)
    except:
        try:
            label_font = ImageFont.truetype("arial.ttf", 10)
        except:
            label_font = ImageFont.load_default()
    
    label_bbox = draw.textbbox((0, 0), config['label'], font=label_font)
    label_width = label_bbox[2] - label_bbox[0]
    draw.text((width//2 - label_width//2, height - 15), config['label'], 
              fill=(255, 255, 255), font=label_font, stroke_width=2, stroke_fill=(0, 0, 0))
    
    return img

def draw_item(config):
    """Draw an item image"""
    size = 70
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    color = config['color']
    dark_color = tuple(int(c * 0.7) for c in color)
    
    # Main body
    draw.rounded_rectangle([5, 5, size-5, size-5], radius=10, fill=color)
    
    # Highlight
    draw.rounded_rectangle([8, 8, size-38, size-38], radius=8, fill=(255, 255, 255, 80))
    
    # Shadow
    draw.rounded_rectangle([10, size-20, size-10, size-10], radius=5, fill=dark_color)
    
    # Border
    draw.rounded_rectangle([5, 5, size-5, size-5], radius=10, outline=(0, 0, 0, 128), width=3)
    
    # Emoji
    try:
        font = ImageFont.truetype("seguiemj.ttf", 32)
    except:
        try:
            font = ImageFont.truetype("arial.ttf", 32)
        except:
            font = ImageFont.load_default()
    
    emoji_bbox = draw.textbbox((0, 0), config['emoji'], font=font)
    emoji_width = emoji_bbox[2] - emoji_bbox[0]
    emoji_height = emoji_bbox[3] - emoji_bbox[1]
    draw.text((size//2 - emoji_width//2, size//2 - emoji_height//2), 
              config['emoji'], fill=(255, 255, 255), font=font)
    
    return img

print('🎨 Generating game assets...\n')

# Generate bins
for config in bins:
    img = draw_bin(config)
    filepath = os.path.join(assets_dir, f"{config['name']}.png")
    img.save(filepath, 'PNG')
    print(f"✅ Created: {config['name']}.png")

# Generate items
for config in items:
    img = draw_item(config)
    filepath = os.path.join(assets_dir, f"{config['name']}.png")
    img.save(filepath, 'PNG')
    print(f"✅ Created: {config['name']}.png")

print(f'\n🎉 Successfully generated {len(bins) + len(items)} images in the assets folder!')
print('🎮 Refresh your game to see the real images!')
