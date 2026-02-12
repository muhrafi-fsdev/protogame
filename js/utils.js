// ============================================
// UTILITY FUNCTIONS
// ============================================

const Utils = {
    formatNumber(num) {
        return num.toLocaleString('id-ID');
    },

    formatTimer(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    },

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Rarity colors
    rarityColor(rarity) {
        const colors = {
            'common': '#9ca3af',
            'uncommon': '#22c55e',
            'rare': '#3b82f6',
            'epic': '#a855f7',
            'legendary': '#f59e0b',
            'mythic': '#ef4444'
        };
        return colors[rarity] || '#9ca3af';
    },

    rarityLabel(rarity) {
        const labels = {
            'common': 'Umum',
            'uncommon': 'Tidak Umum',
            'rare': 'Langka',
            'epic': 'Epik',
            'legendary': 'Legendaris',
            'mythic': 'Mitos'
        };
        return labels[rarity] || 'Umum';
    },

    // Generate random item stats based on rarity
    generateItemStats(baseItem, level) {
        const multiplier = 1 + (level * 0.1);
        const stats = {};
        if (baseItem.baseHealth) stats.health = Math.floor(baseItem.baseHealth * multiplier * Utils.randomFloat(0.8, 1.2));
        if (baseItem.baseDmg) stats.dmg = Math.floor(baseItem.baseDmg * multiplier * Utils.randomFloat(0.8, 1.2));
        if (baseItem.baseArmor) stats.armor = Math.floor(baseItem.baseArmor * multiplier * Utils.randomFloat(0.8, 1.2));
        if (baseItem.baseCrit) stats.crit = Math.floor(baseItem.baseCrit * multiplier * Utils.randomFloat(0.8, 1.2));
        if (baseItem.baseShield) stats.shield = Math.floor(baseItem.baseShield * multiplier * Utils.randomFloat(0.8, 1.2));
        if (baseItem.basePocket) stats.pocket = baseItem.basePocket;
        if (baseItem.baseHealingMultiplier) stats.healingMultiplier = baseItem.baseHealingMultiplier;
        return stats;
    },

    // Generate random rarity
    rollRarity() {
        const roll = Math.random() * 100;
        if (roll < 1) return 'legendary';
        if (roll < 5) return 'epic';
        if (roll < 20) return 'rare';
        if (roll < 50) return 'uncommon';
        return 'common';
    },

    // Generate item name prefix based on rarity
    rarityPrefix(rarity) {
        const prefixes = {
            'common': '',
            'uncommon': '',
            'rare': 'Rare ',
            'epic': 'Epic ',
            'legendary': 'Legendary ',
            'mythic': 'Mythic '
        };
        return prefixes[rarity] || '';
    },

    // Item tag generation
    generateTag() {
        const tags = ['LETHAL', 'DISRUPTOR', '', '', '', ''];
        return Utils.randomChoice(tags);
    }
};
