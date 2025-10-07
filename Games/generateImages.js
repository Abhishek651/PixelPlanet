const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

const bins = [
    { name: 'bin_compost', color: '#27ae60', emoji: '♻️', label: 'COMPOST' },
    { name: 'bin_containers', color: '#3498db', emoji: '🗑️', label: 'CONTAINERS' },
    { name: 'bin_paper', color: '#f39c12', emoji: '📄', label: 'PAPER' },
    { name: 'bin_landfill', color: '#7f8c8d', emoji: '🚮', label: 'LANDFILL' }
];

const items = [
    { name: 'item_plastic_bottle', color: '#3498db', emoji: '🍾' },
    { name: 'item_banana_peel', color: '#f1c40f', emoji: '🍌' },
    { name: 'item_soda_can', color: '#e74c3c', emoji: '🥫' },
    { name: 'item_pizza_box', color: '#e67e22', emoji: '🍕' },
    { name: 'item_office_paper', color: '#ecf0f1', emoji: '📃' },
    { name: 'item_broken_glass', color: '#95a5a6', emoji: '🔨' },
    { name: 'item_coffee_cup', color: '#8e44ad', emoji: '☕' }
];

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function drawBin(config) {
    const canvas = createCanvas(120, 120);
    const ctx = canvas.getContext('2d');
    const width = 120;
    const height = 120;

    const rgb = hexToRgb(config.color);

    // Bin body
    ctx.fillStyle = config.color;
    roundRect(ctx, 10, 20, width - 20, height - 30, 8);
    ctx.fill();

    // Depth shade
    ctx.fillStyle = `rgb(${Math.floor(rgb.r * 0.7)}, ${Math.floor(rgb.g * 0.7)}, ${Math.floor(rgb.b * 0.7)})`;
    ctx.fillRect(15, 25, width - 30, 15);

    // Lid
    ctx.fillStyle = `rgb(${Math.floor(rgb.r * 0.8)}, ${Math.floor(rgb.g * 0.8)}, ${Math.floor(rgb.b * 0.8)})`;
    roundRect(ctx, 5, 10, width - 10, 15, 5);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 3;
    roundRect(ctx, 10, 20, width - 20, height - 30, 8);
    ctx.stroke();

    // Handle
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(width / 2 - 15, 12, 30, 8);

    // Emoji
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.emoji, width / 2, height / 2 + 5);

    // Label
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeText(config.label, width / 2, height - 10);
    ctx.fillText(config.label, width / 2, height - 10);

    return canvas;
}

function drawItem(config) {
    const canvas = createCanvas(70, 70);
    const ctx = canvas.getContext('2d');
    const size = 70;

    const rgb = hexToRgb(config.color);

    // Main body
    ctx.fillStyle = config.color;
    roundRect(ctx, 5, 5, size - 10, size - 10, 10);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    roundRect(ctx, 8, 8, size - 40, size - 40, 8);
    ctx.fill();

    // Shadow
    ctx.fillStyle = `rgb(${Math.floor(rgb.r * 0.7)}, ${Math.floor(rgb.g * 0.7)}, ${Math.floor(rgb.b * 0.7)})`;
    roundRect(ctx, 10, size - 20, size - 20, 10, 5);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 3;
    roundRect(ctx, 5, 5, size - 10, size - 10, 10);
    ctx.stroke();

    // Emoji
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.emoji, size / 2, size / 2);

    return canvas;
}

console.log('🎨 Generating game assets...\n');

// Generate bins
bins.forEach(config => {
    const canvas = drawBin(config);
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(assetsDir, `${config.name}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Created: ${config.name}.png`);
});

// Generate items
items.forEach(config => {
    const canvas = drawItem(config);
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(assetsDir, `${config.name}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Created: ${config.name}.png`);
});

console.log(`\n🎉 Successfully generated ${bins.length + items.length} images in the assets folder!`);
console.log('🎮 Refresh your game to see the real images!');
