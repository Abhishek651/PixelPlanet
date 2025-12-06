// Game Manager - Handles profile, progression, and adaptive difficulty
class GameManager {
  constructor(userId) {
    this.userId = userId;
    this.profile = null;
    this.currentGameState = null;
  }

  async initialize() {
    this.profile = await this.loadProfile();
    return this.profile;
  }

  async loadProfile() {
    const stored = localStorage.getItem(`wasteSegregator_${this.userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return this.createNewProfile();
  }

  createNewProfile() {
    return {
      userId: this.userId,
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
    const level = GAME_CONFIG.LEVEL_CONFIG.find(l => l.id === levelId);
    if (!level) return null;

    const newBins = level.bins.filter(bin => !this.profile.seenBins.includes(bin));
    const newItems = level.itemTypes.filter(item => !this.profile.seenItems.includes(item));

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

    return {
      level: level,
      newBins: newBins.map(binId => GAME_CONFIG.BIN_CONFIG[binId]),
      newItems: newItems.map(itemId => GAME_CONFIG.ITEM_DATABASE[itemId]),
      showIntro: newBins.length > 0 || newItems.length > 0
    };
  }

  markContentAsSeen(bins, items) {
    bins.forEach(bin => {
      if (!this.profile.seenBins.includes(bin)) {
        this.profile.seenBins.push(bin);
      }
    });
    items.forEach(item => {
      if (!this.profile.seenItems.includes(item)) {
        this.profile.seenItems.push(item);
      }
    });
  }

  handleItemDrop(itemName, correctBin, selectedBin, reactionTime) {
    const isCorrect = correctBin === selectedBin;
    const item = GAME_CONFIG.ITEM_DATABASE[itemName];

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

    return { isCorrect, correctBin, selectedBin };
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
      accuracy,
      avgReactionTime,
      categoryAccuracy,
      confusedCategories,
      totalItems: this.currentGameState.totalItems,
      correct: this.currentGameState.correct,
      wrong: this.currentGameState.wrong
    };
  }

  decideNextLevel(performance) {
    const currentLevelId = this.currentGameState.levelId;
    const accuracy = performance.accuracy;
    const decision = { action: null, nextLevelId: null, reason: "", hints: [] };

    if (accuracy >= 0.85) {
      decision.action = 'advance';
      decision.nextLevelId = currentLevelId + 1;
      decision.reason = `Excellent! ${(accuracy * 100).toFixed(0)}% accuracy`;
      
      if (!GAME_CONFIG.LEVEL_CONFIG.find(l => l.id === decision.nextLevelId)) {
        decision.action = 'complete';
        decision.reason = "🎉 You've mastered all levels!";
      }
    } else if (accuracy >= 0.6) {
      decision.action = 'repeat';
      decision.nextLevelId = currentLevelId;
      decision.reason = `Good try! ${(accuracy * 100).toFixed(0)}% accuracy. Practice for mastery!`;
      
      if (performance.confusedCategories.length > 0) {
        decision.hints = performance.confusedCategories.map(cat => {
          const bin = this.getCategoryBin(cat);
          return `💡 ${cat.replace('_', ' ')} items go in ${bin}`;
        });
      }
    } else {
      decision.action = 'repeat_easier';
      decision.nextLevelId = currentLevelId;
      decision.reason = `Let's practice! ${(accuracy * 100).toFixed(0)}% accuracy`;
      decision.hints = this.generateHints();
    }

    return decision;
  }

  getCategoryBin(category) {
    const map = {
      food_waste: "organic", plastic: "recyclable", metal: "recyclable",
      paper: "recyclable", chemical: "hazardous", sharp: "hazardous",
      electronics: "ewaste"
    };
    return map[category] || "unknown";
  }

  generateHints() {
    const hints = [];
    for (const [item, data] of Object.entries(this.currentGameState.confusionMatrix)) {
      const totalMistakes = Object.values(data.mistakes).reduce((a, b) => a + b, 0);
      if (totalMistakes >= 2) {
        const itemData = GAME_CONFIG.ITEM_DATABASE[item];
        hints.push(`💡 ${itemData.name}: ${itemData.hint}`);
      }
    }
    return hints.slice(0, 3);
  }

  updateProfileStats(performance) {
    const levelId = this.currentGameState.levelId;

    if (!this.profile.levelStats[levelId]) {
      this.profile.levelStats[levelId] = {
        attempts: 0, bestAccuracy: 0, totalItems: 0,
        correct: 0, wrong: 0, avgReactionTime: 0, lastPlayed: null
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

    this.profile.totalGamesPlayed++;
    this.profile.lastUpdated = new Date().toISOString();
  }

  async endGame() {
    const performance = this.evaluatePerformance();
    this.updateProfileStats(performance);
    const decision = this.decideNextLevel(performance);

    if (decision.action === 'advance') {
      this.profile.bestLevelUnlocked = Math.max(
        this.profile.bestLevelUnlocked,
        decision.nextLevelId
      );
      this.profile.currentLevelId = decision.nextLevelId;
    }

    await this.saveProfile();

    // Send rewards to parent window (React app)
    const levelId = this.currentGameState.levelId;
    const isSuccess = performance.accuracy >= 0.85;
    const baseEcoPoints = 50 * levelId;
    const baseXP = 30 + (levelId * 10);
    const completionRate = performance.correct / performance.totalItems;
    
    const ecoPoints = Math.floor(baseEcoPoints * (isSuccess ? 1 : completionRate * 0.5));
    const coins = Math.floor(performance.correct * 10);
    const xp = Math.floor(baseXP * (isSuccess ? 1 : completionRate * 0.5));

    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'GAME_COMPLETE',
        game: 'waste-segregator',
        level: levelId,
        score: performance.correct * 10,
        ecoPoints: ecoPoints,
        coins: coins,
        xp: xp,
        isSuccess: isSuccess
      }, '*');
    }

    return { performance, decision };
  }

  async saveProfile() {
    localStorage.setItem(`wasteSegregator_${this.userId}`, JSON.stringify(this.profile));
    return this.profile;
  }
}
