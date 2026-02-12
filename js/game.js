// ============================================
// GAME ENGINE - State Management, Save/Load
// ============================================

class GameEngine {
    constructor() {
        this.state = null;
        this.listeners = {};
        this.timers = {};
        this.tickInterval = null;
    }

    init() {
        this.state = this.loadGame() || this.createNewGame();
        // Backward compatibility: add missing fields from old saves
        if (!this.state.skills) this.state.skills = { searchLevel: 1, medLevel: 1, ammoLevel: 1 };
        if (!this.state.calibration) this.state.calibration = { amProgress: 0, pmProgress: 0, lastAmReset: 0, lastPmReset: 0, selectedSlot: null };
        if (this.state.hideFilter === undefined) this.state.hideFilter = false;
        if (this.state.combatView === undefined) this.state.combatView = null;
        if (this.state.dungeonView === undefined) this.state.dungeonView = null;
        if (!this.state.stats.totalEnemiesDefeated) this.state.stats.totalEnemiesDefeated = 0;
        if (!this.state.stats.totalDungeonsCompleted) this.state.stats.totalDungeonsCompleted = 0;
        this.startGameLoop();
        this.emit('init');
        this.emit('stateChanged');
    }

    createNewGame() {
        return {
            player: {
                name: 'CyberNova',
                level: 1,
                exp: 0,
                maxExp: GameData.getExpForLevel(1),
                health: 1000,
                maxHealth: 1000,
                armor: 50,
                shield: 0,
                dmg: 10,
                crit: 0,
                btc: 5000,
                units: 0,
                title: 'Pendatang Baru',
            },
            inventory: {
                items: [],
                maxSize: 20,
                equipped: {
                    head: null,
                    body: null,
                    weapon: null,
                    legs: null,
                    feet: null,
                    accessory: null,
                }
            },
            bank: {
                btcBalance: 0,
                vault: [],
                maxVaultSlots: 10,
                vaultLevel: 0,
            },
            crafting: {
                level: 1,
                exp: 0,
                maxExp: 1150,
            },
            skills: {
                searchLevel: 1,
                medLevel: 1,
                ammoLevel: 1,
            },
            calibration: {
                amProgress: 0,
                pmProgress: 0,
                lastAmReset: 0,
                lastPmReset: 0,
                selectedSlot: null,
            },
            currentLocation: 'pusat_kota',
            currentView: 'map',
            currentNpc: null,
            currentSubLocation: null,
            activeMission: null,
            missionEndTime: null,
            missionQty: 1,
            buffs: [],
            hideFilter: false,
            combatView: null,
            dungeonView: null,
            gameLog: [
                { text: 'Selamat datang di Neo Shangri-La!', time: Date.now(), type: 'system' },
                { text: 'Gunakan menu navigasi di bawah untuk menjelajahi kota.', time: Date.now(), type: 'system' },
            ],
            cooldowns: {},
            stats: {
                totalBtcEarned: 0,
                totalMissionsCompleted: 0,
                totalItemsCrafted: 0,
                totalItemsBought: 0,
                totalEnemiesDefeated: 0,
                totalDungeonsCompleted: 0,
                playTime: 0,
            },
            settings: {
                darkMode: true,
                notifications: true,
            },
            createdAt: Date.now(),
            lastSaved: Date.now(),
        };
    }

    // ---- EVENTS ----
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }

    // ---- GAME LOOP ----
    startGameLoop() {
        if (this.tickInterval) clearInterval(this.tickInterval);
        this.tickInterval = setInterval(() => this.tick(), 1000);
    }

    tick() {
        // Update active mission timer
        if (this.state.activeMission && this.state.missionEndTime) {
            const now = Date.now();
            if (now >= this.state.missionEndTime) {
                this.completeMission();
            }
            this.emit('timerUpdate');
        }

        // Update buffs
        this.updateBuffs();

        // Update cooldowns
        this.updateCooldowns();

        // Auto-save every 30s
        if (Date.now() - this.state.lastSaved > 30000) {
            this.saveGame();
        }

        this.state.stats.playTime++;
    }

    // ---- SAVE / LOAD ----
    saveGame() {
        this.state.lastSaved = Date.now();
        localStorage.setItem('cyberpunk_rpg_save', JSON.stringify(this.state));
    }

    loadGame() {
        const saved = localStorage.getItem('cyberpunk_rpg_save');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    resetGame() {
        localStorage.removeItem('cyberpunk_rpg_save');
        this.state = this.createNewGame();
        this.emit('stateChanged');
        this.addLog('Game direset. Memulai petualangan baru!', 'system');
    }

    // ---- PLAYER ----
    addExp(amount) {
        // Check for EXP buff
        const expBuff = this.state.buffs.find(b => b.type === 'buff_exp');
        if (expBuff) {
            amount = Math.floor(amount * (1 + GameData.BUFFS.buff_exp.bonus));
        }

        this.state.player.exp += amount;
        while (this.state.player.exp >= this.state.player.maxExp) {
            this.state.player.exp -= this.state.player.maxExp;
            this.state.player.level++;
            this.state.player.maxExp = GameData.getExpForLevel(this.state.player.level);
            this.state.player.maxHealth += 100;
            this.state.player.health = this.state.player.maxHealth;
            this.state.player.armor += 10;
            this.state.player.dmg += 5;
            this.addLog(`🎉 Level Up! Sekarang Level ${this.state.player.level}!`, 'levelup');
        }
        this.emit('stateChanged');
    }

    addBtc(amount) {
        this.state.player.btc += amount;
        this.state.stats.totalBtcEarned += amount;
        this.emit('stateChanged');
    }

    spendBtc(amount) {
        if (this.state.player.btc >= amount) {
            this.state.player.btc -= amount;
            this.emit('stateChanged');
            return true;
        }
        return false;
    }

    addUnits(amount) {
        this.state.player.units += amount;
        this.emit('stateChanged');
    }

    spendUnits(amount) {
        if (this.state.player.units >= amount) {
            this.state.player.units -= amount;
            this.emit('stateChanged');
            return true;
        }
        return false;
    }

    healPlayer(amount) {
        this.state.player.health = Math.min(this.state.player.health + amount, this.state.player.maxHealth);
        this.emit('stateChanged');
    }

    // ---- INVENTORY ----
    addItem(item) {
        // Check if stackable material
        if (item.stackable) {
            const existing = this.state.inventory.items.find(i => i.id === item.id);
            if (existing) {
                existing.qty = (existing.qty || 1) + (item.qty || 1);
                this.emit('stateChanged');
                return true;
            }
        }

        if (this.state.inventory.items.length >= this.state.inventory.maxSize) {
            this.addLog('❌ Inventory penuh!', 'error');
            return false;
        }

        const newItem = {
            ...Utils.deepClone(item),
            uid: Utils.generateId(),
            qty: item.qty || 1,
        };
        this.state.inventory.items.push(newItem);
        this.emit('stateChanged');
        return true;
    }

    removeItem(uid, qty = 1) {
        const idx = this.state.inventory.items.findIndex(i => i.uid === uid);
        if (idx === -1) return false;

        const item = this.state.inventory.items[idx];
        if (item.stackable && item.qty > qty) {
            item.qty -= qty;
        } else {
            this.state.inventory.items.splice(idx, 1);
        }
        this.emit('stateChanged');
        return true;
    }

    removeItemById(itemId, qty = 1) {
        const item = this.state.inventory.items.find(i => i.id === itemId);
        if (!item) return false;
        if (item.stackable && item.qty > qty) {
            item.qty -= qty;
        } else if (item.stackable && item.qty === qty) {
            const idx = this.state.inventory.items.indexOf(item);
            this.state.inventory.items.splice(idx, 1);
        } else {
            const idx = this.state.inventory.items.indexOf(item);
            this.state.inventory.items.splice(idx, 1);
        }
        this.emit('stateChanged');
        return true;
    }

    hasItem(itemId, qty = 1) {
        const item = this.state.inventory.items.find(i => i.id === itemId);
        if (!item) return false;
        return (item.qty || 1) >= qty;
    }

    getItemCount(itemId) {
        const item = this.state.inventory.items.find(i => i.id === itemId);
        return item ? (item.qty || 1) : 0;
    }

    equipItem(uid) {
        const item = this.state.inventory.items.find(i => i.uid === uid);
        if (!item || !item.slot) return false;

        // Unequip current
        const currentEquipped = this.state.inventory.equipped[item.slot];
        if (currentEquipped) {
            this.addItem(currentEquipped);
        }

        // Remove from inventory and equip
        const idx = this.state.inventory.items.indexOf(item);
        this.state.inventory.items.splice(idx, 1);
        this.state.inventory.equipped[item.slot] = Utils.deepClone(item);

        this.recalcStats();
        this.addLog(`✅ Equipped: ${item.name}`, 'success');
        this.emit('stateChanged');
        return true;
    }

    unequipItem(slot) {
        const item = this.state.inventory.equipped[slot];
        if (!item) return false;

        if (this.state.inventory.items.length >= this.state.inventory.maxSize) {
            this.addLog('❌ Inventory penuh! Tidak bisa unequip.', 'error');
            return false;
        }

        this.state.inventory.equipped[slot] = null;
        this.addItem(item);
        this.recalcStats();
        this.emit('stateChanged');
        return true;
    }

    recalcStats() {
        let bonusHealth = 0, bonusArmor = 0, bonusDmg = 0, bonusCrit = 0, bonusShield = 0;

        Object.values(this.state.inventory.equipped).forEach(item => {
            if (!item) return;
            if (item.stats) {
                bonusHealth += item.stats.health || 0;
                bonusArmor += item.stats.armor || 0;
                bonusDmg += item.stats.dmg || 0;
                bonusCrit += item.stats.crit || 0;
                bonusShield += item.stats.shield || 0;
            }
        });

        const baseHealth = 1000 + (this.state.player.level - 1) * 100;
        const baseArmor = 50 + (this.state.player.level - 1) * 10;
        const baseDmg = 10 + (this.state.player.level - 1) * 5;

        this.state.player.maxHealth = baseHealth + bonusHealth;
        this.state.player.armor = baseArmor + bonusArmor;
        this.state.player.dmg = baseDmg + bonusDmg;
        this.state.player.crit = bonusCrit;
        this.state.player.shield = bonusShield;

        if (this.state.player.health > this.state.player.maxHealth) {
            this.state.player.health = this.state.player.maxHealth;
        }
    }

    // ---- MISSIONS ----
    startMission(missionId, qty = 1) {
        if (this.state.activeMission) {
            this.addLog('⚠️ Sudah ada misi aktif!', 'warning');
            return false;
        }

        const mission = GameData.MISSIONS.find(m => m.id === missionId);
        if (!mission) return false;

        if (this.state.player.level < mission.levelReq) {
            this.addLog(`⚠️ Level minimal: ${mission.levelReq}`, 'warning');
            return false;
        }

        let duration = mission.duration * qty;

        // Check time reduction buff
        const timeBuff = this.state.buffs.filter(b => b.type === 'time_reduction');
        if (timeBuff.length > 0) {
            const reduction = Math.min(timeBuff.length * 0.4, 0.8);
            duration = Math.floor(duration * (1 - reduction));
        }

        this.state.activeMission = {
            ...mission,
            qty: qty,
        };
        this.state.missionEndTime = Date.now() + (duration * 1000);
        this.state.missionQty = qty;
        this.addLog(`🎯 Misi dimulai: ${mission.name} x${qty}`, 'mission');
        this.emit('stateChanged');
        return true;
    }

    completeMission() {
        const mission = this.state.activeMission;
        if (!mission) return;

        const qty = mission.qty || 1;
        let totalBtc = 0;
        let totalExp = 0;
        const lootItems = [];

        for (let i = 0; i < qty; i++) {
            totalBtc += Utils.randomInt(mission.rewards.btc[0], mission.rewards.btc[1]);
            totalExp += Utils.randomInt(mission.rewards.exp[0], mission.rewards.exp[1]);

            if (mission.rewards.items) {
                mission.rewards.items.forEach(loot => {
                    if (Math.random() * 100 < loot.chance) {
                        const lootQty = Utils.randomInt(loot.qty[0], loot.qty[1]);
                        const existing = lootItems.find(l => l.itemId === loot.itemId);
                        if (existing) {
                            existing.qty += lootQty;
                        } else {
                            lootItems.push({ itemId: loot.itemId, qty: lootQty });
                        }
                    }
                });
            }
        }

        // Check boost reward buff
        const boostBuff = this.state.buffs.find(b => b.type === 'boost_reward');
        if (boostBuff) {
            totalBtc *= GameData.BUFFS.boost_reward.multiplier;
            totalExp *= GameData.BUFFS.boost_reward.multiplier;
        }

        this.addBtc(totalBtc);
        this.addExp(totalExp);

        lootItems.forEach(loot => {
            const mat = GameData.MATERIALS.find(m => m.id === loot.itemId) ||
                GameData.KEYS.find(k => k.id === loot.itemId);
            if (mat) {
                this.addItem({ ...mat, qty: loot.qty, stackable: true });
            }
        });

        this.addLog(`✅ Misi selesai: ${mission.name}! +${Utils.formatNumber(totalBtc)} BTC, +${Utils.formatNumber(totalExp)} EXP`, 'success');
        if (lootItems.length > 0) {
            const lootNames = lootItems.map(l => {
                const mat = GameData.MATERIALS.find(m => m.id === l.itemId) || GameData.KEYS.find(k => k.id === l.itemId);
                return `${mat ? mat.name : l.itemId} x${l.qty}`;
            }).join(', ');
            this.addLog(`📦 Loot: ${lootNames}`, 'loot');
        }

        this.state.activeMission = null;
        this.state.missionEndTime = null;
        this.state.stats.totalMissionsCompleted++;
        this.emit('missionComplete');
        this.emit('stateChanged');
        this.saveGame();
    }

    getMissionTimeRemaining() {
        if (!this.state.missionEndTime) return 0;
        return Math.max(0, Math.ceil((this.state.missionEndTime - Date.now()) / 1000));
    }

    // ---- CRAFTING ----
    craftItem(recipeId) {
        const recipe = GameData.CRAFTING_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return false;

        // Check requirements
        for (const req of recipe.requirements) {
            if (!this.hasItem(req.itemId, req.qty)) {
                this.addLog(`❌ Bahan tidak cukup!`, 'error');
                return false;
            }
        }

        if (!this.spendBtc(recipe.costBtc)) {
            this.addLog(`❌ BTC tidak cukup!`, 'error');
            return false;
        }

        // Consume materials
        recipe.requirements.forEach(req => {
            this.removeItemById(req.itemId, req.qty);
        });

        // Generate reward item
        const rarity = Utils.rollRarity();
        let baseItem;
        if (recipe.rewards.type === 'weapon') {
            baseItem = Utils.randomChoice(GameData.BASE_WEAPONS);
        } else {
            baseItem = Utils.randomChoice(GameData.BASE_ARMORS.filter(a => a.slot === recipe.rewards.slot));
            if (!baseItem) baseItem = Utils.randomChoice(GameData.BASE_ARMORS);
        }

        const stats = Utils.generateItemStats(baseItem, this.state.crafting.level);
        const tag = Utils.generateTag();
        const craftedItem = {
            id: baseItem.id,
            name: `${Utils.rarityPrefix(rarity)}${baseItem.name}${tag ? ' Of ' + (tag === 'LETHAL' ? 'Crit Chance' : 'Crit Damage') : ''}`,
            icon: baseItem.icon,
            rarity: rarity,
            slot: baseItem.slot,
            stats: stats,
            tag: tag || baseItem.tag,
            type: recipe.rewards.type,
        };

        this.addItem(craftedItem);

        // Add crafting EXP
        this.state.crafting.exp += recipe.craftExp;
        while (this.state.crafting.exp >= this.state.crafting.maxExp) {
            this.state.crafting.exp -= this.state.crafting.maxExp;
            this.state.crafting.level++;
            this.state.crafting.maxExp = Math.floor(this.state.crafting.maxExp * 1.2);
            this.addLog(`⚒️ Level Mencetak naik ke ${this.state.crafting.level}!`, 'levelup');
        }

        this.state.stats.totalItemsCrafted++;
        this.addLog(`⚒️ Crafted: ${craftedItem.name} [${Utils.rarityLabel(rarity)}]`, 'craft');
        this.emit('stateChanged');
        this.saveGame();
        return true;
    }

    // ---- TRADING ----
    buyItem(item) {
        if (item.priceUnit) {
            if (!this.spendUnits(item.priceUnit)) {
                this.addLog('❌ Unit tidak cukup!', 'error');
                return false;
            }
        } else {
            if (!this.spendBtc(item.price)) {
                this.addLog('❌ BTC tidak cukup!', 'error');
                return false;
            }
        }

        const bought = { ...item, stackable: item.stackable !== false, qty: 1 };
        this.addItem(bought);
        this.state.stats.totalItemsBought++;
        this.addLog(`🛒 Membeli: ${item.name}`, 'success');
        this.emit('stateChanged');
        this.saveGame();
        return true;
    }

    sellItem(uid) {
        const item = this.state.inventory.items.find(i => i.uid === uid);
        if (!item) return false;

        const sellPrice = Math.floor((item.price || 100) * 0.5);
        this.addBtc(sellPrice);
        this.removeItem(uid);
        this.addLog(`💰 Menjual: ${item.name} +${Utils.formatNumber(sellPrice)} BTC`, 'success');
        this.emit('stateChanged');
        return true;
    }

    // ---- BANK ----
    depositBtc(amount) {
        if (this.state.player.btc < amount) return false;
        this.state.player.btc -= amount;
        this.state.bank.btcBalance += amount;
        this.addLog(`🏦 Setor ${Utils.formatNumber(amount)} BTC ke Bank`, 'success');
        this.emit('stateChanged');
        this.saveGame();
        return true;
    }

    withdrawBtc(amount) {
        if (this.state.bank.btcBalance < amount) return false;
        this.state.bank.btcBalance -= amount;
        this.state.player.btc += amount;
        this.addLog(`🏦 Tarik ${Utils.formatNumber(amount)} BTC dari Bank`, 'success');
        this.emit('stateChanged');
        this.saveGame();
        return true;
    }

    depositItem(uid) {
        if (this.state.bank.vault.length >= this.state.bank.maxVaultSlots) {
            this.addLog('❌ Berangkas penuh!', 'error');
            return false;
        }
        const item = this.state.inventory.items.find(i => i.uid === uid);
        if (!item) return false;

        this.state.bank.vault.push(Utils.deepClone(item));
        this.removeItem(uid);
        this.addLog(`🏦 Setor barang: ${item.name}`, 'success');
        this.emit('stateChanged');
        this.saveGame();
        return true;
    }

    withdrawItem(uid) {
        if (this.state.inventory.items.length >= this.state.inventory.maxSize) {
            this.addLog('❌ Inventory penuh!', 'error');
            return false;
        }
        const idx = this.state.bank.vault.findIndex(i => i.uid === uid);
        if (idx === -1) return false;

        const item = this.state.bank.vault.splice(idx, 1)[0];
        this.addItem(item);
        this.addLog(`🏦 Tarik barang: ${item.name}`, 'success');
        this.emit('stateChanged');
        this.saveGame();
        return true;
    }

    upgradeVault() {
        const nextLevel = this.state.bank.vaultLevel + 1;
        if (nextLevel >= GameData.VAULT_UPGRADES.length) {
            this.addLog('❌ Sudah level maksimal!', 'error');
            return false;
        }

        const upgrade = GameData.VAULT_UPGRADES[nextLevel];
        if (!this.spendBtc(upgrade.cost)) {
            this.addLog('❌ BTC tidak cukup!', 'error');
            return false;
        }

        this.state.bank.vaultLevel = nextLevel;
        this.state.bank.maxVaultSlots = upgrade.slots;
        this.addLog(`🏦 Berangkas ditingkatkan ke ${upgrade.slots} slot!`, 'success');
        this.emit('stateChanged');
        this.saveGame();
        return true;
    }

    // ---- TERMINAL / KUNCI RAHASIA ----
    craftKey(keyId) {
        const keyData = GameData.KUNCI_RAHASIA.find(k => k.id === keyId);
        if (!keyData) return false;

        for (const req of keyData.requirements) {
            if (!this.hasItem(req.itemId, req.qty)) {
                this.addLog('❌ Kepingan kunci tidak cukup!', 'error');
                return false;
            }
        }

        keyData.requirements.forEach(req => {
            this.removeItemById(req.itemId, req.qty);
        });

        const keyItem = GameData.KEYS.find(k => k.id === keyData.reward);
        this.addItem({ ...keyItem, qty: 1 });
        this.addLog(`🗝️ ${keyData.rewardDesc} berhasil dibuat!`, 'success');
        this.emit('stateChanged');
        this.saveGame();
        return true;
    }

    openContainer() {
        // Random loot from container
        const btcReward = Utils.randomInt(100, 2000);
        const expReward = Utils.randomInt(50, 500);
        this.addBtc(btcReward);
        this.addExp(expReward);

        // Random material drop
        const mat = Utils.randomChoice(GameData.MATERIALS);
        const qty = Utils.randomInt(1, 5);
        this.addItem({ ...mat, qty: qty, stackable: true });

        this.addLog(`📦 Kontainer dibuka! +${Utils.formatNumber(btcReward)} BTC, +${expReward} EXP, ${mat.name} x${qty}`, 'loot');
        this.emit('stateChanged');
        this.saveGame();
        return true;
    }

    // ---- BUFFS ----
    activateBuff(buffType) {
        const buffInfo = GameData.BUFFS[buffType];
        if (!buffInfo) return false;

        const existing = this.state.buffs.filter(b => b.type === buffType);
        if (buffInfo.maxStack && existing.length >= buffInfo.maxStack) {
            this.addLog('❌ Buff sudah maksimal!', 'error');
            return false;
        }

        const buff = {
            type: buffType,
            name: buffInfo.name,
            activatedAt: Date.now(),
            expiresAt: buffInfo.duration ? Date.now() + (buffInfo.duration * 1000) : null,
        };

        this.state.buffs.push(buff);
        this.addLog(`✨ Buff aktif: ${buffInfo.name}`, 'buff');
        this.emit('stateChanged');
        return true;
    }

    updateBuffs() {
        const now = Date.now();
        this.state.buffs = this.state.buffs.filter(b => {
            if (b.expiresAt && now >= b.expiresAt) {
                this.addLog(`⏰ Buff habis: ${b.name}`, 'warning');
                return false;
            }
            return true;
        });
    }

    // ---- COOLDOWNS ----
    setCooldown(key, seconds) {
        this.state.cooldowns[key] = Date.now() + (seconds * 1000);
    }

    isOnCooldown(key) {
        if (!this.state.cooldowns[key]) return false;
        return Date.now() < this.state.cooldowns[key];
    }

    getCooldownRemaining(key) {
        if (!this.state.cooldowns[key]) return 0;
        return Math.max(0, Math.ceil((this.state.cooldowns[key] - Date.now()) / 1000));
    }

    updateCooldowns() {
        const now = Date.now();
        Object.keys(this.state.cooldowns).forEach(key => {
            if (now >= this.state.cooldowns[key]) {
                delete this.state.cooldowns[key];
            }
        });
    }

    // ---- GAME LOG ----
    addLog(text, type = 'info') {
        this.state.gameLog.unshift({
            text: text,
            time: Date.now(),
            type: type,
        });

        // Keep only last 100 entries
        if (this.state.gameLog.length > 100) {
            this.state.gameLog = this.state.gameLog.slice(0, 100);
        }
        this.emit('logUpdate');
    }

    // ---- COMBAT ----
    fightEnemy(locationId) {
        const enemies = GameData.ENEMIES[locationId];
        if (!enemies || enemies.length === 0) return;

        const enemy = Utils.randomChoice(enemies);
        const playerDmg = this.state.player.dmg;
        const enemyHp = enemy.level * 50;
        const enemyDmg = Math.floor(enemy.level * 3);

        // Simple auto-combat
        let playerHp = this.state.player.health;
        let rounds = 0;
        let eHp = enemyHp;

        while (eHp > 0 && playerHp > 0 && rounds < 20) {
            eHp -= playerDmg + Utils.randomInt(0, Math.floor(playerDmg * 0.5));
            if (eHp > 0) {
                const blocked = Math.min(this.state.player.armor * 0.5, enemyDmg * 0.7);
                playerHp -= Math.max(1, enemyDmg - blocked);
            }
            rounds++;
        }

        this.state.player.health = Math.max(1, playerHp);

        if (eHp <= 0) {
            const expReward = enemy.level * Utils.randomInt(30, 60);
            const btcReward = enemy.level * Utils.randomInt(5, 20);
            this.addExp(expReward);
            this.addBtc(btcReward);
            this.state.stats.totalEnemiesDefeated++;
            this.addLog(`⚔️ Mengalahkan lv${enemy.level} ${enemy.name}${enemy.type ? ' (' + enemy.type + ')' : ''}! +${Utils.formatNumber(expReward)} EXP, +${Utils.formatNumber(btcReward)} BTC`, 'success');

            // Random loot drop
            if (Math.random() < 0.3) {
                const mat = Utils.randomChoice(GameData.MATERIALS);
                this.addItem({ ...mat, qty: 1, stackable: true });
                this.addLog(`📦 Drop: ${mat.name} x1`, 'loot');
            }
        } else {
            this.addLog(`💀 Kalah melawan lv${enemy.level} ${enemy.name}! HP tersisa: ${Math.max(1, playerHp)}`, 'error');
        }

        this.setCooldown('combat_' + locationId, 5);
        this.emit('stateChanged');
        this.saveGame();
    }

    // ---- DUNGEON ----
    enterDungeon(dungeonId, locationId) {
        const dungeons = GameData.DUNGEONS[locationId];
        if (!dungeons) return;
        const dungeon = dungeons.find(d => d.id === dungeonId);
        if (!dungeon) return;

        if (this.state.player.level < dungeon.levelReq) {
            this.addLog(`⚠️ Level minimal: ${dungeon.levelReq}`, 'warning');
            return;
        }

        if (dungeon.reqGang) {
            this.addLog('⚠️ Hilang! Requires to be in a gang', 'error');
            return;
        }

        if (dungeon.reqItem && !this.hasItem(dungeon.reqItem, dungeon.reqQty || 1)) {
            this.addLog(`⚠️ Membutuhkan: ${dungeon.reqItem} x${dungeon.reqQty || 1}`, 'warning');
            return;
        }

        // Simulate dungeon run (5 fights)
        const enemies = GameData.ENEMIES[locationId] || [];
        let totalExp = 0, totalBtc = 0;
        let survived = true;

        for (let i = 0; i < 5; i++) {
            const enemy = Utils.randomChoice(enemies.length > 0 ? enemies : [{ name: 'Dungeon Guard', level: dungeon.levelReq + 10, type: null }]);
            const enemyHp = enemy.level * 60;
            const enemyDmg = Math.floor(enemy.level * 4);
            let eHp = enemyHp;
            let rounds = 0;

            while (eHp > 0 && this.state.player.health > 0 && rounds < 15) {
                eHp -= this.state.player.dmg + Utils.randomInt(0, Math.floor(this.state.player.dmg * 0.3));
                if (eHp > 0) {
                    const blocked = Math.min(this.state.player.armor * 0.4, enemyDmg * 0.6);
                    this.state.player.health -= Math.max(1, enemyDmg - blocked);
                }
                rounds++;
            }

            if (this.state.player.health <= 0) {
                this.state.player.health = 1;
                survived = false;
                this.addLog(`💀 Mati di lantai ${i + 1} dungeon!`, 'error');
                break;
            }

            totalExp += Math.floor(enemy.level * Utils.randomInt(50, 100) * dungeon.expMultiplier);
            totalBtc += enemy.level * Utils.randomInt(10, 30);
        }

        if (survived) {
            this.addExp(totalExp);
            this.addBtc(totalBtc);
            this.state.stats.totalDungeonsCompleted++;
            this.addLog(`🏰 Dungeon ${dungeon.tier} selesai! +${Utils.formatNumber(totalExp)} EXP, +${Utils.formatNumber(totalBtc)} BTC`, 'success');

            // Loot drop
            const mat = Utils.randomChoice(GameData.MATERIALS);
            const qty = Utils.randomInt(1, 5);
            this.addItem({ ...mat, qty: qty, stackable: true });
            this.addLog(`📦 Loot dungeon: ${mat.name} x${qty}`, 'loot');
        }

        this.setCooldown('dungeon_' + dungeonId, 60);
        this.emit('stateChanged');
        this.saveGame();
    }

    // ---- TRAINING ----
    doTraining(trainingId) {
        const training = GameData.TRAINING.find(t => t.id === trainingId);
        if (!training) return;

        if (this.isOnCooldown('training_' + trainingId)) {
            const remaining = this.getCooldownRemaining('training_' + trainingId);
            this.addLog(`⏰ Cooldown: ${Utils.formatTimer(remaining)}`, 'warning');
            this.emit('stateChanged');
            return;
        }

        if (training.reqItem && !this.hasItem(training.reqItem, training.reqQty || 1)) {
            this.addLog(`❌ Membutuhkan: ${training.reqItem} x${training.reqQty}`, 'error');
            this.emit('stateChanged');
            return;
        }

        if (training.reqItem) {
            this.removeItemById(training.reqItem, training.reqQty || 1);
        }

        const amount = Utils.randomInt(training.rewardAmount[0], training.rewardAmount[1]);

        if (training.reward === 'craftExp') {
            this.state.crafting.exp += amount;
            while (this.state.crafting.exp >= this.state.crafting.maxExp) {
                this.state.crafting.exp -= this.state.crafting.maxExp;
                this.state.crafting.level++;
                this.state.crafting.maxExp = Math.floor(this.state.crafting.maxExp * 1.2);
                this.addLog(`⚒️ Level Mencetak naik ke ${this.state.crafting.level}!`, 'levelup');
            }
            this.addLog(`⚙️ ${training.name}: +${amount} Crafting EXP`, 'success');
        } else if (training.reward === 'btc') {
            this.addBtc(amount);
            this.addLog(`⛏️ ${training.name}: +${Utils.formatNumber(amount)} BTC`, 'success');
        } else {
            this.addExp(amount);
            this.addLog(`📚 ${training.name}: +${amount} EXP`, 'success');
        }

        this.setCooldown('training_' + trainingId, training.cooldown);
        this.emit('stateChanged');
        this.saveGame();
    }

    // ---- BOT FARMING ----
    deployBot() {
        if (this.state.activeMission) {
            this.addLog('⚠️ Sudah ada misi/farming aktif!', 'warning');
            return;
        }

        if (!this.hasItem('inti_ai', 1)) {
            this.addLog('❌ Membutuhkan: Inti AI x1', 'error');
            this.emit('stateChanged');
            return;
        }

        this.removeItemById('inti_ai', 1);

        const duration = 1800; // 30 minutes
        this.state.activeMission = {
            id: 'bot_farm',
            name: 'AFK Peternakan EXP',
            desc: 'Bot AI sedang farming...',
            duration: duration,
            qty: 1,
            rewards: {
                btc: [200, 1000],
                exp: [500, 2000],
                items: []
            },
            levelReq: 1,
            isBotFarm: true,
        };
        this.state.missionEndTime = Date.now() + (duration * 1000);
        this.addLog('🤖 Bot dikirim untuk farming! ETA: 30 menit', 'mission');
        this.emit('stateChanged');
        this.saveGame();
    }

    // ---- SCAVENGING ----
    startScavenging(locationId) {
        if (this.state.activeMission) {
            this.addLog('⚠️ Sudah ada misi aktif!', 'warning');
            return;
        }

        const duration = 900; // 15 minutes
        this.state.activeMission = {
            id: 'scavenge_' + locationId,
            name: 'Memulung',
            desc: 'Mengumpulkan sumber daya...',
            duration: duration,
            qty: 1,
            rewards: {
                btc: [100, 500],
                exp: [100, 500],
                items: GameData.MATERIALS.slice(0, 3).map(m => ({ itemId: m.id, qty: [1, 3], chance: 50 }))
            },
            levelReq: 1,
            isScavenge: true,
        };
        this.state.missionEndTime = Date.now() + (duration * 1000);
        this.addLog('🔍 Mulai memulung! ETA: 15 menit', 'mission');
        this.emit('stateChanged');
        this.saveGame();
    }

    // ---- CALIBRATION ----
    calibrateItem(slot) {
        if (!slot) return;
        const item = this.state.inventory.equipped[slot];
        if (!item) {
            this.addLog('❌ Tidak ada equipment di slot tersebut!', 'error');
            return;
        }

        const hour = new Date().getHours();
        let fundKey = hour >= 7 && hour < 19 ? 'am' : 'pm';
        let progressKey = fundKey + 'Progress';

        if (this.state.calibration[progressKey] <= 0) {
            this.addLog('❌ Dana kalibrasi habis! Tunggu reset.', 'error');
            return;
        }

        const rate = GameData.CALIBRATION.funds[0].rate;
        this.state.calibration[progressKey] = Math.max(0, this.state.calibration[progressKey] - rate);

        // Boost item stats by 2-5%
        const boost = 1 + (Utils.randomInt(2, 5) / 100);
        if (item.stats) {
            Object.keys(item.stats).forEach(key => {
                if (typeof item.stats[key] === 'number') {
                    item.stats[key] = Math.floor(item.stats[key] * boost);
                }
            });
        }

        this.recalcStats();
        this.addLog(`⚙️ ${item.name} dikalibrasi! Stats meningkat.`, 'success');
        this.emit('stateChanged');
        this.saveGame();
    }

    resetCalibrationFunds() {
        const now = new Date();
        const hour = now.getHours();
        const today = now.toDateString();

        if (hour >= 7 && this.state.calibration.lastAmReset !== today) {
            this.state.calibration.amProgress = 100;
            this.state.calibration.lastAmReset = today;
        }
        if (hour >= 19 && this.state.calibration.lastPmReset !== today) {
            this.state.calibration.pmProgress = 100;
            this.state.calibration.lastPmReset = today;
        }
    }

    // ---- NAVIGATION ----
    navigateTo(locationId) {
        if (GameData.LOCATIONS[locationId]) {
            const dest = GameData.LOCATIONS[locationId];
            if (dest.travel && dest.travel[0] && dest.travel[0].levelReq) {
                // Check level for station travel
            }
            this.state.currentLocation = locationId;
            this.state.currentView = 'map';
            this.state.currentNpc = null;
            this.state.currentSubLocation = null;
            this.state.combatView = null;
            this.state.dungeonView = null;
            this.addLog(`📍 Pindah ke ${GameData.LOCATIONS[locationId].name}`, 'travel');
            this.emit('stateChanged');
        }
    }

    openNpc(npcId) {
        this.state.currentNpc = npcId;
        this.state.currentView = 'npc';
        this.emit('stateChanged');
    }

    openCrafting() {
        this.state.currentView = 'crafting';
        this.state.currentNpc = null;
        this.emit('stateChanged');
    }

    openMissions() {
        this.state.currentView = 'mission';
        this.state.currentNpc = null;
        this.emit('stateChanged');
    }

    openCombatView(type, locationId) {
        if (type === 'enemies') {
            this.state.combatView = locationId;
            this.state.currentView = 'enemies';
        } else if (type === 'dungeon') {
            this.state.dungeonView = locationId;
            this.state.currentView = 'dungeon';
        }
        this.emit('stateChanged');
    }

    openCalibration() {
        this.resetCalibrationFunds();
        this.state.currentView = 'npc';
        this.state.currentNpc = 'kamila';
        this.emit('stateChanged');
    }

    goBack() {
        const loc = GameData.LOCATIONS[this.state.currentLocation];
        if (this.state.currentView === 'enemies' || this.state.currentView === 'dungeon') {
            this.state.combatView = null;
            this.state.dungeonView = null;
            this.state.currentView = 'map';
        } else if (this.state.currentNpc || this.state.currentView === 'crafting' || this.state.currentView === 'mission') {
            this.state.currentNpc = null;
            this.state.currentView = 'map';
        } else if (loc && loc.parent) {
            this.navigateTo(loc.parent);
        }
        this.emit('stateChanged');
    }
}

// Global game instance
const game = new GameEngine();
