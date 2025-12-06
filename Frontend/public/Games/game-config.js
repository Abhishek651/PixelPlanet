// Game Configuration
const GAME_CONFIG = {
  LEVEL_CONFIG: [
    {
      id: 1,
      name: "Organic Basics",
      bins: ["organic"],
      itemTypes: ["banana_peel", "apple_core", "coffee_grounds", "pizza_box"],
      itemCount: 5,
      spawnDelay: 3500,
      speed: 50,
      timeLimit: 40,
      passThreshold: 0.85
    },
    {
      id: 2,
      name: "Add Recyclables",
      bins: ["organic", "recyclable"],
      itemTypes: ["banana_peel", "apple_core", "plastic_bottle", "soda_can", "newspaper", "cardboard"],
      itemCount: 8,
      spawnDelay: 3000,
      speed: 60,
      timeLimit: 50,
      passThreshold: 0.85
    },
    {
      id: 3,
      name: "Hazardous Materials",
      bins: ["organic", "recyclable", "hazardous"],
      itemTypes: ["banana_peel", "plastic_bottle", "battery", "broken_glass", "paint_can", "soda_can"],
      itemCount: 10,
      spawnDelay: 2500,
      speed: 70,
      timeLimit: 55,
      passThreshold: 0.85
    },
    {
      id: 4,
      name: "E-Waste Challenge",
      bins: ["organic", "recyclable", "hazardous", "ewaste"],
      itemTypes: ["banana_peel", "plastic_bottle", "battery", "old_phone", "laptop", "charger", "newspaper"],
      itemCount: 12,
      spawnDelay: 2200,
      speed: 80,
      timeLimit: 60,
      passThreshold: 0.85
    },
    {
      id: 5,
      name: "Master Challenge",
      bins: ["organic", "recyclable", "hazardous", "ewaste"],
      itemTypes: ["banana_peel", "apple_core", "plastic_bottle", "soda_can", "battery", "old_phone", "laptop", "paint_can", "newspaper", "cardboard"],
      itemCount: 15,
      spawnDelay: 1800,
      speed: 100,
      timeLimit: 65,
      passThreshold: 0.85
    }
  ],

  ITEM_DATABASE: {
    banana_peel: { name: "Banana Peel", emoji: "🍌", bin: "organic", category: "food_waste", hint: "Food waste is compostable!" },
    apple_core: { name: "Apple Core", emoji: "🍎", bin: "organic", category: "food_waste", hint: "Fruit waste makes great compost!" },
    coffee_grounds: { name: "Coffee Grounds", emoji: "☕", bin: "organic", category: "food_waste", hint: "Coffee grounds enrich soil!" },
    pizza_box: { name: "Greasy Pizza Box", emoji: "🍕", bin: "organic", category: "food_waste", hint: "Grease makes it non-recyclable!" },
    
    plastic_bottle: { name: "Plastic Bottle", emoji: "🍾", bin: "recyclable", category: "plastic", hint: "Rinse before recycling!" },
    soda_can: { name: "Soda Can", emoji: "🥫", bin: "recyclable", category: "metal", hint: "Aluminum is 100% recyclable!" },
    newspaper: { name: "Newspaper", emoji: "📰", bin: "recyclable", category: "paper", hint: "Clean paper can be recycled!" },
    cardboard: { name: "Cardboard Box", emoji: "📦", bin: "recyclable", category: "paper", hint: "Flatten boxes for recycling!" },
    
    battery: { name: "Battery", emoji: "🔋", bin: "hazardous", category: "chemical", hint: "Contains toxic chemicals!" },
    broken_glass: { name: "Broken Glass", emoji: "🔨", bin: "hazardous", category: "sharp", hint: "Sharp objects need special care!" },
    paint_can: { name: "Paint Can", emoji: "🎨", bin: "hazardous", category: "chemical", hint: "Paint is hazardous waste!" },
    
    old_phone: { name: "Old Phone", emoji: "📱", bin: "ewaste", category: "electronics", hint: "Contains valuable materials!" },
    laptop: { name: "Laptop", emoji: "💻", bin: "ewaste", category: "electronics", hint: "E-waste can be recycled!" },
    charger: { name: "Charger", emoji: "🔌", bin: "ewaste", category: "electronics", hint: "Electronic accessories are e-waste!" }
  },

  BIN_CONFIG: {
    organic: {
      name: "Organic",
      color: 0x27ae60,
      emoji: "♻️",
      description: "Food waste, yard waste, compostable materials",
      intro: "Organic waste can be composted to create nutrient-rich soil! 🌱"
    },
    recyclable: {
      name: "Recyclable",
      color: 0x3498db,
      emoji: "🗑️",
      description: "Paper, plastic, metal, glass that can be recycled",
      intro: "Recyclables can be processed and turned into new products! ♻️"
    },
    hazardous: {
      name: "Hazardous",
      color: 0xe74c3c,
      emoji: "⚠️",
      description: "Batteries, chemicals, sharp objects",
      intro: "Hazardous waste needs special handling to protect the environment! ⚠️"
    },
    ewaste: {
      name: "E-Waste",
      color: 0x9b59b6,
      emoji: "📱",
      description: "Electronic devices and components",
      intro: "E-waste contains valuable materials that can be recovered! 💻"
    }
  }
};
