# Eco-Shredder: Sort the Scraps - Game Setup

## ✅ Fixed Issues

1. **File Path Corrections**
   - Fixed QuizScene.js path from `assests/` to `assets/` in index.html
   - Consolidated Phaser configuration in index.html (removed duplicates from scene files)

2. **Drag-and-Drop Functionality**
   - Added missing drag-and-drop event listener in GameScene.js
   - Items can now be dragged to bins for sorting

3. **Scene Management**
   - Properly configured both GameScene and QuizScene
   - GameScene starts first, QuizScene available for quiz mode

## 📋 Current Status

### Working Features
- ✅ Phaser game initialization
- ✅ GameScene with conveyor belt sorting mechanic
- ✅ QuizScene with environmental quiz questions
- ✅ Drag-and-drop functionality
- ✅ Scoring system with Knowledge Points (KP)
- ✅ Timer and feedback systems

### ⚠️ Missing Assets

All image files in the `assets/` folder are currently **0 bytes (empty)**. You need to replace them with actual images:

#### Bin Images (150x150px recommended)
- `bin_compost.png` - Green bin for compostable items
- `bin_containers.png` - Blue bin for recyclable containers
- `bin_paper.png` - Yellow bin for paper products
- `bin_landfill.png` - Gray/black bin for landfill waste

#### Item Images (80x80px recommended)
- `item_plastic_bottle.png`
- `item_banana_peel.png`
- `item_soda_can.png`
- `item_pizza_box.png`
- `item_office_paper.png`
- `item_broken_glass.png`
- `item_coffee_cup.png`

## 🎮 How to Play

1. **Open** `index.html` in a web browser
2. **GameScene** will start automatically
3. **Drag items** from the conveyor belt to the correct bins
4. **Score points** for correct sorting
5. **Avoid penalties** for wrong sorting or missed items

## 🎯 Game Mechanics

### GameScene (Sorting Game)
- **Goal**: Sort 10 items correctly within 60 seconds
- **Scoring**:
  - Correct sort: +10 KP
  - Wrong sort: -5 KP, -5 seconds
  - Missed item: -2 KP
- **Bins**:
  - Compost: Organic waste (banana peels, greasy pizza boxes)
  - Containers: Recyclable containers (plastic bottles, soda cans)
  - Paper: Clean paper products (office paper)
  - Landfill: Non-recyclable items (broken glass, coffee cups with plastic lining)

### QuizScene (Environmental Quiz)
- **Goal**: Answer 5 environmental questions
- **Scoring**:
  - Correct answer: +20 KP
  - Speed bonus (< 3 seconds): +5 KP
  - Wrong answer: 0 KP (educational feedback shown)
- **Time**: 10 seconds per question

## 🛠️ Next Steps

1. **Add Images**: Replace the empty PNG files with actual images
   - Use simple, clear icons or illustrations
   - Recommended tools: Canva, Figma, or download free icons from flaticon.com

2. **Test the Game**: Open `index.html` in a browser to test functionality

3. **Optional Enhancements**:
   - Add sound effects
   - Add more items to the database
   - Create a menu to switch between GameScene and QuizScene
   - Add difficulty levels
   - Implement a leaderboard

## 📁 File Structure

```
Games/
├── index.html              # Main HTML file with Phaser config
├── GameScene.js           # Sorting game scene
├── assets/
│   ├── QuizScene.js       # Quiz game scene
│   ├── bin_*.png          # Bin images (4 files)
│   └── item_*.png         # Item images (7 files)
└── README.md              # This file
```

## 🐛 Troubleshooting

- **Images not loading**: Check browser console for errors, ensure PNG files are not empty
- **Drag not working**: Make sure you're using a modern browser (Chrome, Firefox, Edge)
- **Game not starting**: Check browser console for JavaScript errors

## 📝 Notes

- The game uses Phaser 3.80.1 from CDN
- No server required - just open index.html in a browser
- All game logic is client-side JavaScript
