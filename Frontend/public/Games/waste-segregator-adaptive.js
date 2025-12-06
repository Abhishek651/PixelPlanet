// Waste Segregator Game - Progressive Difficulty System

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

const LEVEL_CONFIG = [
    // Progressive difficulty - all 4 bins from start, increasing complexity
    { id: 1, name: "Level 1", bins: ["organic"], 
      itemTypes: ["banana_peel", "apple_core", "coffee_grounds", "pizza_box"],
      itemCount: 5, spawnDelay: 3500, speed: 50, timeLimit: 40, passThreshold: 0.85 },
    { id: 2, name: "Level 2", bins: ["organic", "recyclable"], 
      itemTypes: ["banana_peel", "apple_core", "plastic_bottle", "soda_can", "newspaper", "cardboard"],
      itemCount: 8, spawnDelay: 3000, speed: 60, timeLimit: 50, passThreshold: 0.85 },
    { id: 3, name: "Level 3", bins: ["organic", "recyclable", "hazardous"], 
      itemTypes: ["banana_peel", "plastic_bottle", "battery", "broken_glass", "paint_can", "soda_can"],
      itemCount: 10, spawnDelay: 2500, speed: 70, timeLimit: 55, passThreshold: 0.85 },
    { id: 4, name: "Level 4", bins: ["organic", "recyclable", "hazardous", "ewaste"], 
      itemTypes: ["banana_peel", "plastic_bottle", "battery", "old_phone", "laptop", "charger", "newspaper"],
      itemCount: 12, spawnDelay: 2200, speed: 80, timeLimit: 60, passThreshold: 0.85 },
    { id: 5, name: "Level 5", bins: ["organic", "recyclable", "hazardous", "ewaste"], 
      itemTypes: ["banana_peel", "apple_core", "plastic_bottle", "soda_can", "newspaper", "cardboard", 
                  "battery", "broken_glass", "paint_can", "old_phone", "laptop", "charger"],
      itemCount: 15, spawnDelay: 1800, speed: 100, timeLimit: 65, passThreshold: 0.85 },
    { id: 6, name: "Level 6", bins: ["organic", "recyclable", "hazardous", "ewaste"], 
      itemTypes: ["banana_peel", "apple_core", "coffee_grounds", "pizza_box", "plastic_bottle", "soda_can", 
                  "newspaper", "cardboard", "battery", "broken_glass", "paint_can", "old_phone", "laptop", "charger"],
      itemCount: 18, spawnDelay: 1600, speed: 110, timeLimit: 70, passThreshold: 0.85 },
    { id: 7, name: "Level 7", bins: ["organic", "recyclable", "hazardous", "ewaste"], 
      itemTypes: ["banana_peel", "apple_core", "coffee_grounds", "pizza_box", "plastic_bottle", "soda_can", 
                  "newspaper", "cardboard", "battery", "broken_glass", "paint_can", "old_phone", "laptop", "charger"],
      itemCount: 20, spawnDelay: 1500, speed: 120, timeLimit: 75, passThreshold: 0.85 },
    { id: 8, name: "Level 8", bins: ["organic", "recyclable", "hazardous", "ewaste"], 
      itemTypes: ["banana_peel", "apple_core", "coffee_grounds", "pizza_box", "plastic_bottle", "soda_can", 
                  "newspaper", "cardboard", "battery", "broken_glass", "paint_can", "old_phone", "laptop", "charger"],
      itemCount: 22, spawnDelay: 1400, speed: 130, timeLimit: 80, passThreshold: 0.85 },
    { id: 9, name: "Level 9", bins: ["organic", "recyclable", "hazardous", "ewaste"], 
      itemTypes: ["banana_peel", "apple_core", "coffee_grounds", "pizza_box", "plastic_bottle", "soda_can", 
                  "newspaper", "cardboard", "battery", "broken_glass", "paint_can", "old_phone", "laptop", "charger"],
      itemCount: 24, spawnDelay: 1300, speed: 140, timeLimit: 85, passThreshold: 0.85 },
    { id: 10, name: "Level 10", bins: ["organic", "recyclable", "hazardous", "ewaste"], 
      itemTypes: ["banana_peel", "apple_core", "coffee_grounds", "pizza_box", "plastic_bottle", "soda_can", 
                  "newspaper", "cardboard", "battery", "broken_glass", "paint_can", "old_phone", "laptop", "charger"],
      itemCount: 26, spawnDelay: 1200, speed: 150, timeLimit: 90, passThreshold: 0.85 }
];

const ITEM_DATABASE = {
    // Organic waste
    banana_peel: { name: "Banana Peel", emoji: "🍌", bin: "organic", category: "food_waste", 
                   hint: "Food scraps are perfect for composting!" },
    apple_core: { name: "Apple Core", emoji: "🍎", bin: "organic", category: "food_waste",
                  hint: "Fruit waste makes great compost!" },
    coffee_grounds: { name: "Coffee Grounds", emoji: "☕", bin: "organic", category: "food_waste",
                      hint: "Coffee grounds enrich compost!" },
    pizza_box: { name: "Pizza Box (Greasy)", emoji: "🍕", bin: "organic", category: "food_waste",
                 hint: "Greasy cardboard can't be recycled, but can be composted!" },
    
    // Recyclable
    plastic_bottle: { name: "Plastic Bottle", emoji: "🍾", bin: "recyclable", category: "plastic",
                      hint: "Rinse and recycle plastic bottles!" },
    soda_can: { name: "Soda Can", emoji: "🥫", bin: "recyclable", category: "metal",
                hint: "Aluminum cans are infinitely recyclable!" },
    newspaper: { name: "Newspaper", emoji: "📰", bin: "recyclable", category: "paper",
                 hint: "Clean paper can be recycled!" },
    cardboard: { name: "Cardboard Box", emoji: "📦", bin: "recyclable", category: "paper",
                 hint: "Flatten cardboard for recycling!" },
    
    // Hazardous
    battery: { name: "Battery", emoji: "🔋", bin: "hazardous", category: "chemical",
               hint: "Batteries contain toxic chemicals!" },
    broken_glass: { name: "Broken Glass", emoji: "🔨", bin: "hazardous", category: "sharp",
                    hint: "Sharp objects need special handling!" },
    paint_can: { name: "Paint Can", emoji: "🎨", bin: "hazardous", category: "chemical",
                 hint: "Paint contains harmful chemicals!" },
    
    // E-waste
    old_phone: { name: "Old Phone", emoji: "📱", bin: "ewaste", category: "electronics",
                 hint: "Electronics contain valuable recoverable materials!" },
    laptop: { name: "Laptop", emoji: "💻", bin: "ewaste", category: "electronics",
              hint: "E-waste should never go to landfill!" },
    charger: { name: "Charger", emoji: "🔌", bin: "ewaste", category: "electronics",
               hint: "Electronic accessories are e-waste!" }
};

const BIN_CONFIG = {
    organic: {
        name: "Organic",
        color: 0x27ae60,
        emoji: "♻️",
        description: "Food waste, yard waste, compostable materials",
        intro: "Organic waste can be composted to create nutrient-rich soil for plants!"
    },
    recyclable: {
        name: "Recyclable",
        color: 0x3498db,
        emoji: "🗑️",
        description: "Paper, plastic, metal, glass that can be recycled",
        intro: "Recyclables can be processed and turned into new products, saving resources!"
    },
    hazardous: {
        name: "Hazardous",
        color: 0xe74c3c,
        emoji: "⚠️",
        description: "Batteries, chemicals, sharp objects",
        intro: "Hazardous waste needs special handling to protect people and the environment!"
    },
    ewaste: {
        name: "E-Waste",
        color: 0x9b59b6,
        emoji: "📱",
        description: "Electronic devices and components",
        intro: "E-waste contains valuable materials like gold and copper that can be recovered!"
    }
};

// ============================================================================
// GAME CLASS - SIMPLE PROFILE SYSTEM
// ============================================================================

class WasteSegregatorGame {
    constructor(userId, apiBaseUrl) {
        this.userId = userId;
        this.apiBaseUrl = apiBaseUrl;
        this.profile = null;
        this.authToken = null;
    }
    
    setAuthToken(token) {
        this.authToken = token;
    }
    
    async initialize() {
        try {
            this.profile = await this.loadProfile();
            console.log('Profile loaded:', this.profile);
            return this.profile;
        } catch (error) {
            console.error('Error initializing:', error);
            const stored = localStorage.getItem('wasteSegregatorProfile');
            if (stored) {
                this.profile = JSON.parse(stored);
            } else {
                this.profile = this.createNewProfile();
            }
            return this.profile;
        }
    }
    
    async loadProfile() {
        const headers = { 'Content-Type': 'application/json' };
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        
        const response = await fetch(`${this.apiBaseUrl}/api/game/profile/${this.userId}`, { headers });
        if (!response.ok) throw new Error('Failed to load profile');
        return await response.json();
    }
    
    async saveProfile() {
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (this.authToken) {
                headers['Authorization'] = `Bearer ${this.authToken}`;
            }
            
            const response = await fetch(`${this.apiBaseUrl}/api/game/profile`, {
                method: 'POST',
                headers,
                body: JSON.stringify(this.profile)
            });
            
            if (!response.ok) throw new Error('Failed to save profile');
            return await response.json();
        } catch (error) {
            console.error('Error saving profile:', error);
            localStorage.setItem('wasteSegregatorProfile', JSON.stringify(this.profile));
            return this.profile;
        }
    }
    
    createNewProfile() {
        return {
            userId: this.userId,
            username: "Player",
            currentLevelId: 1,
            bestLevelUnlocked: 1,
            totalGamesPlayed: 0,
            seenBins: [],
            seenItems: [],
            levelStats: {},
            categoryMastery: {},
            confusionMatrix: {},
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
    }
    
    startLevel(levelId) {
        const level = LEVEL_CONFIG.find(l => l.id === levelId);
        if (!level) return null;
        
        const newBins = level.bins.filter(bin => !this.profile.seenBins.includes(bin));
        const levelItems = level.itemTypes.map(type => ITEM_DATABASE[type]);
        const newItems = levelItems.filter(item => !this.profile.seenItems.includes(item.name));
        
        return {
            level: level,
            newBins: newBins.map(binId => BIN_CONFIG[binId]),
            newItems: newItems,
            showIntro: newBins.length > 0 || newItems.length > 0
        };
    }
    
    markContentAsSeen(bins, items) {
        bins.forEach(bin => {
            const binName = typeof bin === 'string' ? bin : bin.name.toLowerCase();
            if (!this.profile.seenBins.includes(binName)) {
                this.profile.seenBins.push(binName);
            }
        });
        
        items.forEach(item => {
            const itemName = typeof item === 'string' ? item : item.name;
            if (!this.profile.seenItems.includes(itemName)) {
                this.profile.seenItems.push(itemName);
            }
        });
        
        this.profile.lastUpdated = new Date().toISOString();
    }
    
    initializeGameState(levelId, level) {
        this.currentGameState = {
            levelId: levelId,
            level: level,
            totalItems: 0,
            correct: 0,
            wrong: 0,
            reactionTimes: [],
            categoryMastery: {},
            confusionMatrix: {},
            startTime: Date.now()
        };
    }
    
    updateGameStats(itemName, correctBin, selectedBin, reactionTime) {
        const isCorrect = correctBin === selectedBin;
        const item = ITEM_DATABASE[itemName];
        
        this.currentGameState.totalItems++;
        
        if (isCorrect) {
            this.currentGameState.correct++;
        } else {
            this.currentGameState.wrong++;
            
            if (!this.currentGameState.confusionMatrix[itemName]) {
                this.currentGameState.confusionMatrix[itemName] = {
                    intended: correctBin,
                    mistakes: {}
                };
            }
            this.currentGameState.confusionMatrix[itemName].mistakes[selectedBin] = 
                (this.currentGameState.confusionMatrix[itemName].mistakes[selectedBin] || 0) + 1;
        }
        
        const category = item.category;
        if (!this.currentGameState.categoryMastery[category]) {
            this.currentGameState.categoryMastery[category] = { correct: 0, wrong: 0 };
        }
        
        if (isCorrect) {
            this.currentGameState.categoryMastery[category].correct++;
        } else {
            this.currentGameState.categoryMastery[category].wrong++;
        }
        
        this.currentGameState.reactionTimes.push(reactionTime);
        
        return { isCorrect, hint: item.hint };
    }
    
    evaluatePerformance() {
        const accuracy = this.currentGameState.correct / this.currentGameState.totalItems;
        const avgReactionTime = this.currentGameState.reactionTimes.reduce((a, b) => a + b, 0) / 
                                this.currentGameState.reactionTimes.length;
        
        const categoryAccuracy = {};
        for (const [category, stats] of Object.entries(this.currentGameState.categoryMastery)) {
            const total = stats.correct + stats.wrong;
            categoryAccuracy[category] = total > 0 ? stats.correct / total : 0;
        }
        
        const confusedCategories = Object.entries(categoryAccuracy)
            .filter(([cat, acc]) => {
                const stats = this.currentGameState.categoryMastery[cat];
                return acc < 0.6 && (stats.correct + stats.wrong) >= 3;
            })
            .map(([cat]) => cat);
        
        return {
            accuracy: accuracy,
            avgReactionTime: avgReactionTime,
            categoryAccuracy: categoryAccuracy,
            confusedCategories: confusedCategories,
            totalItems: this.currentGameState.totalItems,
            correct: this.currentGameState.correct,
            wrong: this.currentGameState.wrong
        };
    }
    
    decideNextLevel(currentLevelId, performance) {
        const currentLevel = LEVEL_CONFIG.find(l => l.id === currentLevelId);
        const accuracy = performance.accuracy;
        
        let decision = {
            action: null,
            nextLevelId: null,
            reason: "",
            hints: [],
            easierSettings: null
        };
        
        if (accuracy >= 0.85) {
            decision.action = 'advance';
            decision.nextLevelId = currentLevelId + 1;
            decision.reason = `Excellent! ${(accuracy * 100).toFixed(0)}% accuracy`;
            
            if (!LEVEL_CONFIG.find(l => l.id === decision.nextLevelId)) {
                decision.action = 'complete';
                decision.reason = "Congratulations! You've mastered all levels!";
            }
        } else if (accuracy >= 0.6) {
            decision.action = 'repeat';
            decision.nextLevelId = currentLevelId;
            decision.reason = `Good effort! ${(accuracy * 100).toFixed(0)}% accuracy. Try again!`;
            
            if (performance.confusedCategories.length > 0) {
                decision.hints = performance.confusedCategories.map(cat => 
                    `Tip: Review ${cat.replace('_', ' ')} items`
                );
            }
        } else {
            decision.action = 'repeat_easier';
            decision.nextLevelId = currentLevelId;
            decision.reason = `Let's practice more! ${(accuracy * 100).toFixed(0)}% accuracy`;
            
            decision.hints = this.generateHintsFromConfusion();
            
            decision.easierSettings = {
                spawnDelay: currentLevel.spawnDelay + 500,
                speed: Math.max(40, currentLevel.speed - 10),
                itemCount: Math.max(5, currentLevel.itemCount - 2)
            };
        }
        
        return decision;
    }
    
    generateHintsFromConfusion() {
        const hints = [];
        
        for (const [itemName, data] of Object.entries(this.currentGameState.confusionMatrix)) {
            const totalMistakes = Object.values(data.mistakes).reduce((a, b) => a + b, 0);
            if (totalMistakes >= 2) {
                const item = ITEM_DATABASE[itemName];
                hints.push(`${item.name}: ${item.hint}`);
            }
        }
        
        return hints.slice(0, 3);
    }
    
    updateProfileStats(performance) {
        const levelId = this.currentGameState.levelId;
        
        if (!this.profile.levelStats[levelId]) {
            this.profile.levelStats[levelId] = {
                attempts: 0,
                bestAccuracy: 0,
                bestScore: 0,
                totalItems: 0,
                correct: 0,
                wrong: 0,
                avgReactionTime: 0,
                lastPlayed: null
            };
        }
        
        const stats = this.profile.levelStats[levelId];
        stats.attempts++;
        stats.bestAccuracy = Math.max(stats.bestAccuracy, performance.accuracy);
        stats.totalItems += performance.totalItems;
        stats.correct += performance.correct;
        stats.wrong += performance.wrong;
        stats.avgReactionTime = performance.avgReactionTime;
        stats.lastPlayed = new Date().toISOString();
        
        for (const [category, stats] of Object.entries(this.currentGameState.categoryMastery)) {
            if (!this.profile.categoryMastery[category]) {
                this.profile.categoryMastery[category] = { correct: 0, wrong: 0, accuracy: 0 };
            }
            this.profile.categoryMastery[category].correct += stats.correct;
            this.profile.categoryMastery[category].wrong += stats.wrong;
            
            const total = this.profile.categoryMastery[category].correct + 
                          this.profile.categoryMastery[category].wrong;
            this.profile.categoryMastery[category].accuracy = 
                this.profile.categoryMastery[category].correct / total;
        }
        
        for (const [item, data] of Object.entries(this.currentGameState.confusionMatrix)) {
            if (!this.profile.confusionMatrix[item]) {
                this.profile.confusionMatrix[item] = data;
            } else {
                for (const [bin, count] of Object.entries(data.mistakes)) {
                    this.profile.confusionMatrix[item].mistakes[bin] = 
                        (this.profile.confusionMatrix[item].mistakes[bin] || 0) + count;
                }
            }
        }
        
        this.profile.totalGamesPlayed++;
        this.profile.lastUpdated = new Date().toISOString();
    }
    
    async endGame() {
        const performance = this.evaluatePerformance();
        console.log('Performance:', performance);
        
        this.updateProfileStats(performance);
        
        const decision = this.decideNextLevel(this.currentGameState.levelId, performance);
        console.log('Next level decision:', decision);
        
        if (decision.action === 'advance') {
            this.profile.bestLevelUnlocked = Math.max(
                this.profile.bestLevelUnlocked,
                decision.nextLevelId
            );
            this.profile.currentLevelId = decision.nextLevelId;
        }
        
        await this.saveProfile();
        
        return {
            performance: performance,
            decision: decision
        };
    }
}

// Export for use in Phaser scenes
window.WasteSegregatorGame = WasteSegregatorGame;
window.LEVEL_CONFIG = LEVEL_CONFIG;
window.ITEM_DATABASE = ITEM_DATABASE;
window.BIN_CONFIG = BIN_CONFIG;
