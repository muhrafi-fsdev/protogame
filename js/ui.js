// ============================================
// UI RENDERING - All DOM Manipulation
// ============================================

class UI {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.currentTab = 'map';
        this.inventoryTab = 'barang';
        this.rightPanelTab = 'notif';
        this.selectedItem = null;
        this.missionQtyInput = 1;
        this.bankAmountInput = 0;
        this.selectedMission = null;
    }

    init() {
        this.bindEvents();
        this.game.on('stateChanged', () => this.renderAll());
        this.game.on('timerUpdate', () => this.updateTimers());
        this.game.on('logUpdate', () => this.renderLog());
        this.game.on('missionComplete', () => {
            this.currentTab = 'map';
            this.renderAll();
        });
        this.renderAll();
    }

    bindEvents() {
        // Bottom nav
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.currentTab = tab.dataset.tab;
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.renderMainPanel();
            });
        });
    }

    renderAll() {
        this.renderTopBar();
        this.renderLeftPanel();
        this.renderMainPanel();
        this.renderRightPanel();
    }

    // ==========================================
    // TOP BAR
    // ==========================================
    renderTopBar() {
        const p = this.game.state.player;
        const expPercent = Math.floor((p.exp / p.maxExp) * 100);

        document.getElementById('player-level').textContent = p.level;
        document.getElementById('player-exp-current').textContent = Utils.formatNumber(p.exp);
        document.getElementById('player-exp-max').textContent = Utils.formatNumber(p.maxExp);
        document.getElementById('exp-fill').style.width = expPercent + '%';
        document.getElementById('exp-percent').textContent = expPercent + '%';
        document.getElementById('player-btc').textContent = Utils.formatNumber(p.btc);
        document.getElementById('player-units').textContent = Utils.formatNumber(p.units);
        document.getElementById('player-name').textContent = p.name;
        document.getElementById('player-title').textContent = p.title;
    }

    // ==========================================
    // LEFT PANEL - Inventory
    // ==========================================
    renderLeftPanel() {
        const inv = this.game.state.inventory;
        const leftPanel = document.getElementById('left-panel-content');

        // Tabs
        const tabBar = `
            <div class="inv-tabs">
                <button class="inv-tab ${this.inventoryTab === 'barang' ? 'active' : ''}" onclick="ui.switchInvTab('barang')">BARANG</button>
                <button class="inv-tab ${this.inventoryTab === 'kunci' ? 'active' : ''}" onclick="ui.switchInvTab('kunci')">KUNCI RAHASIA</button>
            </div>
        `;

        let itemsHtml = '';

        if (this.inventoryTab === 'barang') {
            // Filter icons
            const filterBar = `
                <div class="inv-filter-bar">
                    <button class="filter-btn active" title="Semua">📋</button>
                    <button class="filter-btn" title="Senjata">⚔️</button>
                    <button class="filter-btn" title="Armor">🛡️</button>
                    <button class="filter-btn" title="Material">⚙️</button>
                    <button class="filter-btn" title="Consumable">💊</button>
                </div>
                <div class="inv-size">Size: ${inv.items.length}/${inv.maxSize}</div>
            `;

            const equippedItems = Object.values(inv.equipped).filter(e => e);

            // Equipment items first
            const equipItems = inv.items.filter(i => i.slot);
            const materialItems = inv.items.filter(i => i.stackable || !i.slot);

            const allItems = [...equipItems, ...materialItems];

            allItems.forEach(item => {
                const rarityColor = item.rarity ? Utils.rarityColor(item.rarity) : '#9ca3af';
                const tag = item.tag ? `<span class="item-tag ${item.tag === 'LETHAL' ? 'lethal' : 'disruptor'}">${item.tag}</span>` : '';
                const statsLine = this.getItemStatsLine(item);

                itemsHtml += `
                    <div class="inv-item ${item.rarity || ''}" onclick="ui.showItemDetail('${item.uid}')" style="border-left: 3px solid ${rarityColor}">
                        <div class="inv-item-header">
                            <span class="inv-item-icon">${item.icon || '📦'}</span>
                            <span class="inv-item-name" style="color: ${rarityColor}">${item.name}</span>
                            ${tag}
                        </div>
                        <div class="inv-item-stats">${statsLine}</div>
                        ${item.qty && item.qty > 1 ? `<span class="inv-item-qty">x ${Utils.formatNumber(item.qty)}</span>` : ''}
                    </div>
                `;
            });

            leftPanel.innerHTML = tabBar + filterBar + `<div class="inv-items-list">${itemsHtml || '<div class="empty-state">Inventory kosong</div>'}</div>`;
        } else {
            // Kunci Rahasia tab
            const keys = inv.items.filter(i => i.id && i.id.startsWith('kunci_'));
            keys.forEach(item => {
                itemsHtml += `
                    <div class="inv-item key-item">
                        <span class="inv-item-icon">${item.icon}</span>
                        <span class="inv-item-name">${item.name}</span>
                        ${item.qty > 1 ? `<span class="inv-item-qty">x ${item.qty}</span>` : ''}
                    </div>
                `;
            });
            leftPanel.innerHTML = tabBar + `<div class="inv-items-list">${itemsHtml || '<div class="empty-state">Belum ada kunci</div>'}</div>`;
        }
    }

    getItemStatsLine(item) {
        if (!item.stats) return '';
        const parts = [];
        if (item.stats.health) parts.push(`HEALTH: ${Utils.formatNumber(item.stats.health)}`);
        if (item.stats.dmg) parts.push(`DMG: ${Utils.formatNumber(item.stats.dmg)}`);
        if (item.stats.armor) parts.push(`ARMOR: ${item.stats.armor}`);
        if (item.stats.crit) parts.push(`CRIT: ${item.stats.crit}`);
        if (item.stats.shield) parts.push(`SHIELD: ${item.stats.shield}`);
        if (item.stats.pocket) parts.push(`POCKET: ${item.stats.pocket}`);
        if (item.stats.healingMultiplier) parts.push(`HEALING_MULTIPLIER: ${item.stats.healingMultiplier}`);
        return parts.join(', ');
    }

    switchInvTab(tab) {
        this.inventoryTab = tab;
        this.renderLeftPanel();
    }

    showItemDetail(uid) {
        const item = this.game.state.inventory.items.find(i => i.uid === uid);
        if (!item) return;

        const modal = document.getElementById('modal');
        const rarityColor = item.rarity ? Utils.rarityColor(item.rarity) : '#9ca3af';

        let actions = '';
        if (item.slot) {
            actions += `<button class="btn btn-primary" onclick="game.equipItem('${uid}'); ui.closeModal(); ui.renderAll();">Equip</button>`;
        }
        if (item.effect === 'heal') {
            actions += `<button class="btn btn-success" onclick="game.healPlayer(${item.value || 100}); game.removeItem('${uid}'); ui.closeModal(); ui.renderAll();">Gunakan</button>`;
        }
        actions += `<button class="btn btn-danger" onclick="game.sellItem('${uid}'); ui.closeModal(); ui.renderAll();">Jual</button>`;
        actions += `<button class="btn btn-bank" onclick="game.depositItem('${uid}'); ui.closeModal(); ui.renderAll();">Simpan ke Bank</button>`;

        modal.innerHTML = `
            <div class="modal-overlay" onclick="ui.closeModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <span class="modal-icon">${item.icon || '📦'}</span>
                        <h3 style="color: ${rarityColor}">${item.name}</h3>
                        ${item.rarity ? `<span class="rarity-badge" style="color: ${rarityColor}">[${Utils.rarityLabel(item.rarity)}]</span>` : ''}
                    </div>
                    <div class="modal-stats">${this.getItemStatsLine(item)}</div>
                    ${item.tag ? `<div class="modal-tag ${item.tag === 'LETHAL' ? 'lethal' : 'disruptor'}">${item.tag}</div>` : ''}
                    <div class="modal-actions">${actions}</div>
                    <button class="btn btn-close" onclick="ui.closeModal()">Tutup</button>
                </div>
            </div>
        `;
        modal.style.display = 'flex';
    }

    closeModal() {
        document.getElementById('modal').style.display = 'none';
    }

    // ==========================================
    // MAIN PANEL
    // ==========================================
    renderMainPanel() {
        const main = document.getElementById('main-panel-content');

        switch (this.currentTab) {
            case 'map':
                if (this.game.state.currentView === 'npc') {
                    this.renderNpcView(main);
                } else if (this.game.state.currentView === 'crafting') {
                    this.renderCraftingView(main);
                } else if (this.game.state.currentView === 'mission') {
                    this.renderMissionView(main);
                } else if (this.game.state.currentView === 'enemies') {
                    this.renderEnemiesView(main);
                } else if (this.game.state.currentView === 'dungeon') {
                    this.renderDungeonView(main);
                } else {
                    this.renderMapView(main);
                }
                break;
            case 'inventory':
                this.renderInventoryFullView(main);
                break;
            case 'missions':
                this.renderMissionView(main);
                break;
            case 'chat':
                this.renderChatView(main);
                break;
            case 'account':
                this.renderAccountView(main);
                break;
            default:
                this.renderMapView(main);
        }
    }

    // ---- MAP VIEW ----
    renderMapView(container) {
        const loc = GameData.LOCATIONS[this.game.state.currentLocation];
        if (!loc) return;

        let breadcrumb = '';
        if (loc.parent) {
            const parentLoc = GameData.LOCATIONS[loc.parent];
            breadcrumb = `
                <div class="breadcrumb">
                    <span class="breadcrumb-link" onclick="game.navigateTo('${loc.parent}')">${parentLoc.name}</span>
                    <span class="breadcrumb-sep">›</span>
                    <span class="breadcrumb-current">${loc.name}</span>
                </div>
                <div class="back-btn" onclick="game.goBack()">
                    ← Kembali ke ${parentLoc.name}
                    <span class="back-hint">Tekan lama untuk kembali ke kota</span>
                </div>
            `;
        }

        // Location header with image placeholder
        const header = `
            <div class="location-header">
                <div class="location-banner" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);">
                    <div class="location-banner-overlay">
                        <h2 class="location-name">${loc.name}</h2>
                        <p class="location-desc">${loc.desc}</p>
                        ${loc.tag ? `<span class="location-tag">${loc.tag}</span>` : ''}
                    </div>
                </div>
            </div>
        `;

        // Interactables
        let interactablesHtml = '';
        if (loc.interactables && loc.interactables.length > 0) {
            interactablesHtml = `
                <div class="section-title">DAPAT DIINTERAKSI</div>
                <div class="interactables-grid">
                    ${loc.interactables.map(item => `
                        <button class="interactable-btn" onclick="ui.openInteractable('${item.id}')">
                            <span class="interactable-icon">${item.icon}</span>
                            <span class="interactable-name">${item.name}</span>
                        </button>
                    `).join('')}
                </div>
            `;
        }

        // Combat Zones
        let combatHtml = '';
        if (loc.combatZones && loc.combatZones.length > 0) {
            combatHtml = `
                <div class="combat-zones-list">
                    ${loc.combatZones.map(zone => `
                        <div class="combat-zone-card ${zone.type}" onclick="game.openCombatView('${zone.type}', '${this.game.state.currentLocation}')">
                            <div class="combat-zone-header">
                                <span class="combat-zone-name">${zone.name}</span>
                                <span class="combat-zone-arrow">→</span>
                            </div>
                            <p class="combat-zone-desc">${zone.desc}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Travel with level range
        let travelHtml = '';
        const hideFilter = this.game.state.hideFilter;
        if (loc.travel && loc.travel.length > 0) {
            const filteredTravel = hideFilter ? loc.travel.filter(d => !d.maxLevel || d.maxLevel >= this.game.state.player.level) : loc.travel;
            travelHtml = `
                <div class="section-title">PERJALANAN</div>
                ${loc.hideFilter ? `
                    <label class="hide-filter-label">
                        <input type="checkbox" ${hideFilter ? 'checked' : ''} onchange="game.state.hideFilter = this.checked; ui.renderAll();">
                        <span>Sembunyikan level yang lebih rendah</span>
                    </label>
                ` : ''}
                <div class="travel-list">
                    ${filteredTravel.map(dest => {
                const levelLocked = dest.levelReq && this.game.state.player.level < dest.levelReq;
                const locked = dest.requirement === 'level_50' && this.game.state.player.level < 50;
                const lockedGang = dest.requirement === 'gang';
                const isLocked = locked || lockedGang || levelLocked;
                return `
                            <div class="travel-card ${isLocked ? 'locked' : ''}" ${!isLocked ? `onclick="game.navigateTo('${dest.id}')"` : ''}>
                                <div class="travel-icon">${dest.icon}</div>
                                <div class="travel-info">
                                    <h4 class="travel-name">${dest.name}</h4>
                                    ${dest.levelRange ? `<span class="level-range-tag">${dest.levelRange}</span>` : ''}
                                    ${dest.desc ? `<p class="travel-desc">${dest.desc}</p>` : ''}
                                    ${isLocked ? `<p class="travel-locked">${levelLocked ? 'Level ' + dest.levelReq + ' dibutuhkan' : locked ? 'Kamu harus mencapai level 50' : 'Kamu perlu bergabung dengan geng'}</p>` : ''}
                                </div>
                                ${dest.btnText ? `<button class="travel-btn ${isLocked ? 'disabled' : ''}">${dest.btnText}</button>` : ''}
                            </div>
                        `;
            }).join('')}
                </div>
            `;
        }

        // Travel Back
        let travelBackHtml = '';
        if (loc.travelBack && loc.travelBack.length > 0) {
            travelBackHtml = `
                <div class="travel-list travel-back-list">
                    ${loc.travelBack.map(dest => `
                        <div class="travel-card" onclick="game.navigateTo('${dest.id}')">
                            <div class="travel-icon">${dest.icon}</div>
                            <div class="travel-info">
                                <h4 class="travel-name">${dest.name}</h4>
                                ${dest.desc ? `<p class="travel-desc">${dest.desc}</p>` : ''}
                            </div>
                            <button class="travel-btn">${dest.btnText}</button>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Actions
        let actionsHtml = '';
        if (loc.actions && loc.actions.length > 0) {
            actionsHtml = `
                <div class="section-title">DAPAT DIINTERAKSI</div>
                <div class="actions-list">
                    ${loc.actions.map(action => `
                        <div class="action-card" onclick="ui.doAction('${action.id}')">
                            <span class="action-icon">${action.icon}</span>
                            <div class="action-info">
                                <h4>${action.name}</h4>
                                <p>${action.desc}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Tindakan (Training/Activities)
        let tindakanHtml = '';
        if (loc.tindakan && loc.tindakan.length > 0) {
            tindakanHtml = `
                <div class="section-title">TINDAKAN</div>
                <div class="tindakan-list">
                    ${loc.tindakan.map(action => {
                const onCd = this.game.isOnCooldown('training_' + action.id);
                const cdRem = this.game.getCooldownRemaining('training_' + action.id);
                const hasReq = action.reqItem ? this.game.hasItem(action.reqItem, action.reqQty || 1) : true;
                return `
                        <div class="tindakan-card ${onCd ? 'on-cooldown' : ''}">
                            <span class="tindakan-icon">${action.icon}</span>
                            <div class="tindakan-info">
                                <h4>${action.name}</h4>
                                <p>${action.desc}</p>
                                ${action.reqItem ? `<p class="tindakan-req">Membutuhkan:<br>${action.reqItem.replace(/_/g, ' ')} x${action.reqQty || 1}</p>` : ''}
                                ${onCd ? `<p class="cooldown-timer">⏰ ${Utils.formatTimer(cdRem)}</p>` : ''}
                            </div>
                            <button class="btn btn-tindakan ${onCd || !hasReq ? 'disabled' : ''}" ${!onCd && hasReq ? `onclick="event.stopPropagation(); ui.doTindakan('${action.id}')"` : ''}>${action.btnText || action.name}</button>
                        </div>
                    `;
            }).join('')}
                </div>
            `;
        }

        container.innerHTML = breadcrumb + header + combatHtml + interactablesHtml + travelHtml + travelBackHtml + actionsHtml + tindakanHtml;
    }

    openInteractable(id) {
        switch (id) {
            case 'kantor_bursa':
                this.game.openNpc('violet');
                break;
            case 'toko_trinoky':
                this.game.openNpc('victor');
                break;
            case 'terminal':
                this.game.openNpc('liam');
                break;
            case 'bank_arasaka':
                this.game.openNpc('lexi');
                break;
            case 'pos_perdagangan':
                this.game.openNpc('lee');
                break;
            case 'printer_3d':
                this.game.openCrafting();
                break;
            case 'toko_senjata':
            case 'stasiun_kalibrasi':
                this.game.openCalibration();
                break;
            case 'kosmetik':
                this.game.addLog(`🏪 ${id.replace(/_/g, ' ')} akan datang segera!`, 'info');
                this.renderAll();
                break;
            default:
                this.game.addLog(`🏪 Fitur dalam pengembangan`, 'info');
                this.renderAll();
        }
    }

    doAction(id) {
        switch (id) {
            case 'istirahat':
                if (this.game.isOnCooldown('rest')) {
                    const remaining = this.game.getCooldownRemaining('rest');
                    this.game.addLog(`⏰ Istirahat cooldown: ${Utils.formatTimer(remaining)}`, 'warning');
                } else {
                    this.game.state.player.health = this.game.state.player.maxHealth;
                    this.game.setCooldown('rest', 1800);
                    this.game.addLog('🛏️ Beristirahat... HP dipulihkan sepenuhnya!', 'success');
                }
                break;
            case 'memancing':
                if (this.game.isOnCooldown('fishing')) {
                    const remaining = this.game.getCooldownRemaining('fishing');
                    this.game.addLog(`⏰ Memancing cooldown: ${Utils.formatTimer(remaining)}`, 'warning');
                } else {
                    const btcReward = Utils.randomInt(50, 500);
                    this.game.addBtc(btcReward);
                    this.game.addExp(Utils.randomInt(20, 100));
                    this.game.setCooldown('fishing', 300);
                    this.game.addLog(`🎣 Memancing berhasil! +${btcReward} BTC`, 'success');
                }
                break;
            case 'sukarelawan':
                if (this.game.isOnCooldown('volunteer')) {
                    const remaining = this.game.getCooldownRemaining('volunteer');
                    this.game.addLog(`⏰ Cooldown: ${Utils.formatTimer(remaining)}`, 'warning');
                } else {
                    this.game.addExp(Utils.randomInt(100, 300));
                    this.game.setCooldown('volunteer', 600);
                    this.game.addLog('🐕 Selesai jaga sukarelawan! +EXP', 'success');
                }
                break;
            case 'kerja_freelance':
                if (this.game.isOnCooldown('freelance')) {
                    const remaining = this.game.getCooldownRemaining('freelance');
                    this.game.addLog(`⏰ Cooldown: ${Utils.formatTimer(remaining)}`, 'warning');
                } else {
                    const reward = Utils.randomInt(200, 1000);
                    this.game.addBtc(reward);
                    this.game.addExp(Utils.randomInt(50, 200));
                    this.game.setCooldown('freelance', 600);
                    this.game.addLog(`💻 Freelance selesai! +${reward} BTC`, 'success');
                }
                break;
            default:
                this.game.addLog('Fitur dalam pengembangan', 'info');
        }
        this.renderAll();
    }

    doTindakan(id) {
        switch (id) {
            case 'bot_farm':
                this.game.deployBot();
                break;
            case 'memulung_akado':
                this.game.startScavenging(this.game.state.currentLocation);
                break;
            default:
                this.game.doTraining(id);
        }
        this.renderAll();
    }

    // ---- NPC VIEW ----
    renderNpcView(container) {
        const npcId = this.game.state.currentNpc;
        const npc = GameData.NPCS[npcId];
        if (!npc) return;

        const backBtn = `<div class="back-nav" onclick="game.goBack()">‹ Kembali</div>`;

        const npcHeader = `
            <div class="npc-header">
                <div class="npc-banner" style="background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a1a3e 100%);">
                    <div class="npc-avatar">${npc.icon}</div>
                    <h2 class="npc-title">${npc.title}</h2>
                </div>
                <div class="npc-dialog">
                    <span class="npc-name-tag">${npc.name}:</span>
                    <p>${npc.dialog}</p>
                </div>
            </div>
        `;

        let content = '';

        switch (npc.shopType) {
            case 'buy':
                content = this.renderShopBuy(npc);
                break;
            case 'trade':
                content = this.renderTradingPost(npc);
                break;
            case 'bank':
                content = this.renderBank(npc);
                break;
            case 'exchange':
                content = this.renderExchange(npc);
                break;
            case 'terminal':
                content = this.renderTerminal(npc);
                break;
            case 'calibration':
                content = this.renderCalibration(npc);
                break;
        }

        container.innerHTML = backBtn + npcHeader + content;
    }

    // ---- SHOP (Toko Trinoky) ----
    renderShopBuy(npc) {
        const items = GameData.CONSUMABLES;
        return `
            <div class="section-title">BERBELANJA (BELI)</div>
            <div class="shop-list">
                ${items.map(item => `
                    <div class="shop-item" onclick="game.buyItem(${JSON.stringify(item).replace(/"/g, '&quot;')}); ui.renderAll();">
                        <div class="shop-item-left">
                            <span class="shop-item-icon">✦</span>
                            <span class="shop-item-name">${item.name}</span>
                        </div>
                        <span class="shop-item-price">${Utils.formatNumber(item.price)} <small>BTC</small></span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ---- TRADING POST (Lee) ----
    renderTradingPost(npc) {
        const recipes = GameData.BAG_RECIPES;
        return `
            <div class="section-title">BERDAGANG</div>
            <div class="shop-list">
                ${recipes.map(recipe => {
            const onCooldown = this.game.isOnCooldown('bag_' + recipe.id);
            const cdRemaining = this.game.getCooldownRemaining('bag_' + recipe.id);
            const reqText = recipe.requirements.map(r => {
                const mat = [...GameData.MATERIALS, ...GameData.BAGS].find(m => m.id === r.itemId);
                return `${mat ? mat.name : r.itemId} x${r.qty}`;
            }).join(', ');

            return `
                        <div class="shop-item trade-item ${onCooldown ? 'on-cooldown' : ''}">
                            <div class="shop-item-icon-lg">${recipe.icon}</div>
                            <div class="trade-item-info">
                                <h4>${recipe.name}</h4>
                                <div class="trade-req">
                                    <span class="req-label">Membutuhkan:</span>
                                    <span>${reqText}</span>
                                    <span>${Utils.formatNumber(recipe.costBtc)} BTC</span>
                                </div>
                                <div class="trade-reward">
                                    <span class="req-label">Menerima:</span>
                                    <span>${recipe.name} x1</span>
                                </div>
                                ${onCooldown ? `<div class="cooldown-timer">⏰ ${Utils.formatTimer(cdRemaining)}</div>` : ''}
                            </div>
                            ${!onCooldown ? `<button class="btn btn-trade" onclick="event.stopPropagation(); ui.doCraftBag('${recipe.id}')">Berdagang</button>` : ''}
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    doCraftBag(recipeId) {
        const recipe = GameData.BAG_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return;

        for (const req of recipe.requirements) {
            if (!this.game.hasItem(req.itemId, req.qty)) {
                this.game.addLog('❌ Bahan tidak cukup!', 'error');
                this.renderAll();
                return;
            }
        }

        if (!this.game.spendBtc(recipe.costBtc)) {
            this.game.addLog('❌ BTC tidak cukup!', 'error');
            this.renderAll();
            return;
        }

        recipe.requirements.forEach(req => {
            this.game.removeItemById(req.itemId, req.qty);
        });

        const bag = GameData.BAGS.find(b => b.id === recipe.result);
        if (bag) {
            this.game.state.inventory.maxSize = bag.capacity;
            this.game.addLog(`👝 Tas ditingkatkan: ${bag.name} (${bag.capacity} slot)!`, 'success');
        }

        this.game.setCooldown('bag_' + recipeId, recipe.cooldown);
        this.game.saveGame();
        this.renderAll();
    }

    // ---- BANK (Lexi) ----
    renderBank(npc) {
        const bank = this.game.state.bank;
        const nextUpgrade = bank.vaultLevel + 1 < GameData.VAULT_UPGRADES.length ?
            GameData.VAULT_UPGRADES[bank.vaultLevel + 1] : null;

        return `
            <div class="bank-saldo">SALDO: ${Utils.formatNumber(bank.btcBalance)}</div>
            <div class="bank-actions">
                <div class="bank-action-card" onclick="ui.showBankAction('setor')">
                    <span class="bank-action-icon">💰</span>
                    <div>
                        <h4>SETOR</h4>
                        <p>Setor / Masukkan Bitcoin ke bank</p>
                    </div>
                </div>
                <div class="bank-action-card" onclick="ui.showBankAction('tarik')">
                    <span class="bank-action-icon">💸</span>
                    <div>
                        <h4>TARIK</h4>
                        <p>Tarik / Ambil Bitcoin dari Bank</p>
                    </div>
                </div>
                <div class="bank-action-card" onclick="ui.showBankAction('setor_barang')">
                    <span class="bank-action-icon">📥</span>
                    <div>
                        <h4>SETOR BARANG</h4>
                        <p>Setor / Masukkan barang ke Berangkasmu</p>
                    </div>
                </div>
                <div class="bank-action-card" onclick="ui.showBankAction('tarik_barang')">
                    <span class="bank-action-icon">📤</span>
                    <div>
                        <h4>TARIK BARANG</h4>
                        <p>Tarik / Ambil barang dari Berangkasmu</p>
                    </div>
                </div>
                ${nextUpgrade ? `
                    <div class="bank-action-card upgrade" onclick="game.upgradeVault(); ui.renderAll();">
                        <span class="bank-action-icon">⬆️</span>
                        <div>
                            <h4>TINGKATKAN KE ${nextUpgrade.slots} SLOT</h4>
                            <p>Menambah jumlah maksimum barang yang dapat Kamu simpan di berangkas ke ${nextUpgrade.slots}</p>
                            <p class="upgrade-cost">${Utils.formatNumber(nextUpgrade.cost)} BTC</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    showBankAction(action) {
        const modal = document.getElementById('modal');
        let content = '';

        if (action === 'setor') {
            content = `
                <div class="bank-modal">
                    <h3>Setor BTC</h3>
                    <p>Saldo saat ini: ${Utils.formatNumber(this.game.state.bank.btcBalance)} BTC</p>
                    <p>BTC tersedia: ${Utils.formatNumber(this.game.state.player.btc)} BTC</p>
                    <input type="number" id="bank-amount" class="bank-input" value="0" min="0" max="${this.game.state.player.btc}">
                    <div class="bank-quick-btns">
                        <button class="btn btn-sm" onclick="document.getElementById('bank-amount').value = Math.floor(${this.game.state.player.btc} * 0.25)">25%</button>
                        <button class="btn btn-sm" onclick="document.getElementById('bank-amount').value = Math.floor(${this.game.state.player.btc} * 0.5)">50%</button>
                        <button class="btn btn-sm" onclick="document.getElementById('bank-amount').value = ${this.game.state.player.btc}">MAX</button>
                    </div>
                    <button class="btn btn-primary" onclick="game.depositBtc(parseInt(document.getElementById('bank-amount').value)); ui.closeModal(); ui.renderAll();">Setor</button>
                    <button class="btn btn-close" onclick="ui.closeModal()">Batal</button>
                </div>
            `;
        } else if (action === 'tarik') {
            content = `
                <div class="bank-modal">
                    <h3>Tarik BTC</h3>
                    <p>Saldo: ${Utils.formatNumber(this.game.state.bank.btcBalance)} BTC</p>
                    <input type="number" id="bank-amount" class="bank-input" value="0" min="0" max="${this.game.state.bank.btcBalance}">
                    <div class="bank-quick-btns">
                        <button class="btn btn-sm" onclick="document.getElementById('bank-amount').value = Math.floor(${this.game.state.bank.btcBalance} * 0.25)">25%</button>
                        <button class="btn btn-sm" onclick="document.getElementById('bank-amount').value = Math.floor(${this.game.state.bank.btcBalance} * 0.5)">50%</button>
                        <button class="btn btn-sm" onclick="document.getElementById('bank-amount').value = ${this.game.state.bank.btcBalance}">MAX</button>
                    </div>
                    <button class="btn btn-primary" onclick="game.withdrawBtc(parseInt(document.getElementById('bank-amount').value)); ui.closeModal(); ui.renderAll();">Tarik</button>
                    <button class="btn btn-close" onclick="ui.closeModal()">Batal</button>
                </div>
            `;
        } else if (action === 'setor_barang') {
            const items = this.game.state.inventory.items;
            content = `
                <div class="bank-modal">
                    <h3>Setor Barang (${this.game.state.bank.vault.length}/${this.game.state.bank.maxVaultSlots})</h3>
                    <div class="bank-items-list">
                        ${items.length > 0 ? items.map(item => `
                            <div class="bank-item" onclick="game.depositItem('${item.uid}'); ui.showBankAction('setor_barang');">
                                <span>${item.icon || '📦'} ${item.name}</span>
                                ${item.qty > 1 ? `<span>x${item.qty}</span>` : ''}
                            </div>
                        `).join('') : '<p class="empty-state">Tidak ada barang</p>'}
                    </div>
                    <button class="btn btn-close" onclick="ui.closeModal()">Tutup</button>
                </div>
            `;
        } else if (action === 'tarik_barang') {
            const vault = this.game.state.bank.vault;
            content = `
                <div class="bank-modal">
                    <h3>Tarik Barang (${vault.length}/${this.game.state.bank.maxVaultSlots})</h3>
                    <div class="bank-items-list">
                        ${vault.length > 0 ? vault.map(item => `
                            <div class="bank-item" onclick="game.withdrawItem('${item.uid}'); ui.showBankAction('tarik_barang');">
                                <span>${item.icon || '📦'} ${item.name}</span>
                                ${item.qty > 1 ? `<span>x${item.qty}</span>` : ''}
                            </div>
                        `).join('') : '<p class="empty-state">Berangkas kosong</p>'}
                    </div>
                    <button class="btn btn-close" onclick="ui.closeModal()">Tutup</button>
                </div>
            `;
        }

        modal.innerHTML = `
            <div class="modal-overlay" onclick="ui.closeModal()">
                <div class="modal-content bank-modal-content" onclick="event.stopPropagation()">
                    ${content}
                </div>
            </div>
        `;
        modal.style.display = 'flex';
    }

    // ---- EXCHANGE (Bursa Arasaka) ----
    renderExchange(npc) {
        const items = GameData.TECH_ITEMS;
        return `
            <div class="section-title">BERBELANJA (BELI)</div>
            <div class="shop-list">
                ${items.map(item => `
                    <div class="shop-item ${item.rare ? 'rare-item' : ''}" onclick="game.buyItem(${JSON.stringify({ ...item, price: 0 }).replace(/"/g, '&quot;')}); ui.renderAll();">
                        <div class="shop-item-left">
                            <span class="shop-item-icon">${item.rare ? '🔴' : '◆'}</span>
                            <span class="shop-item-name" ${item.rare ? 'style="color: #ef4444"' : ''}>${item.name}</span>
                            ${item.desc ? `<span class="shop-item-desc">${item.desc}</span>` : ''}
                        </div>
                        <span class="shop-item-price">${Utils.formatNumber(item.priceUnit)} <small>Unit</small></span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ---- TERMINAL (Liam) ----
    renderTerminal(npc) {
        const keys = GameData.KUNCI_RAHASIA;
        return `
            <div class="terminal-actions">
                <div class="terminal-action-card" onclick="game.openContainer(); ui.renderAll();">
                    <span class="terminal-icon">⊘</span>
                    <h4>BUKA KONTAINER</h4>
                </div>
            </div>
            <div class="section-title">SERANG-PAKSA</div>
            <div class="key-recipes-list">
                ${keys.map(key => `
                    <div class="key-recipe-card" style="border-color: ${key.color}">
                        <h4>${key.name.toUpperCase()} (${key.levelRange})</h4>
                        <div class="key-req">
                            <span class="req-label">Membutuhkan:</span>
                            ${key.requirements.map(r => {
            const keyItem = GameData.KEYS.find(k => k.id === r.itemId);
            const has = this.game.hasItem(r.itemId, r.qty);
            return `<span class="${has ? 'has-req' : 'missing-req'}">${keyItem.name} x${r.qty}</span>`;
        }).join('')}
                        </div>
                        <div class="key-reward">
                            <span class="req-label">Menerima:</span>
                            <span>${key.rewardDesc}</span>
                        </div>
                        <p class="key-note">${key.attackNote}</p>
                        <p class="key-consume">${key.consumeNote}</p>
                        <button class="btn btn-craft-key" onclick="game.craftKey('${key.id}'); ui.renderAll();">Craft</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ---- ENEMIES VIEW ----
    renderEnemiesView(container) {
        const locId = this.game.state.combatView;
        const enemies = GameData.ENEMIES[locId] || [];
        const backBtn = `<div class="back-nav" onclick="game.goBack()">← KEMBALI</div>`;

        const enemyRows = enemies.map(e => {
            const typeStr = e.type ? ` (${e.type})` : '';
            const color = e.color || '#e8e8f0';
            return `<div class="enemy-row" style="color: ${color}" onclick="game.fightEnemy('${locId}'); ui.renderAll();">
                <span>lv${e.level}  ${e.name}${typeStr}</span>
            </div>`;
        }).join('');

        container.innerHTML = `
            ${backBtn}
            <h2 class="enemies-title">Musuh</h2>
            <div class="enemies-list">${enemyRows}</div>
        `;
    }

    // ---- DUNGEON VIEW ----
    renderDungeonView(container) {
        const locId = this.game.state.dungeonView;
        const dungeons = GameData.DUNGEONS[locId] || [];
        const backBtn = `<div class="back-nav" onclick="game.goBack()">← KEMBALI</div>`;

        const dungeonCards = dungeons.map(d => {
            const onCd = this.game.isOnCooldown('dungeon_' + d.id);
            const cdRem = this.game.getCooldownRemaining('dungeon_' + d.id);
            const meetsLevel = this.game.state.player.level >= d.levelReq;
            const gangLocked = d.reqGang;

            return `
                <div class="dungeon-card" style="border-color: ${d.color}">
                    <div class="dungeon-header">
                        <span class="dungeon-name">${d.name}</span>
                        <span class="dungeon-tier" style="color: ${d.color}">${d.tier}</span>
                    </div>
                    <div class="dungeon-details">
                        <p>Level yang direkomendasikan: ${d.recLevel}</p>
                        <p>${d.expMultiplier}x kali lebih banyak EXP!</p>
                        ${d.extra ? `<p>${d.extra}</p>` : ''}
                        <p>${d.lootDrop}</p>
                        ${gangLocked ? `<p class="dungeon-warn">Tidak disarankan untuk masuk jika levelmu terlalu rendah</p>` : ''}
                        <p class="dungeon-req">Membutuhkan:</p>
                        ${d.reqItem ? `<p class="dungeon-req-item">${d.reqItem.replace(/_/g, ' ')} x${d.reqQty || 1}</p>` : ''}
                        <p class="dungeon-req-item">Level ${d.levelReq}</p>
                        ${gangLocked ? `<p class="dungeon-gang-lock">Hilang Requires to be in a gang</p>` : ''}
                    </div>
                    ${onCd ? `<p class="cooldown-timer">⏰ ${Utils.formatTimer(cdRem)}</p>` : ''}
                    ${!onCd && meetsLevel && !gangLocked ? `<button class="btn btn-dungeon" onclick="game.enterDungeon('${d.id}', '${locId}'); ui.renderAll();">Masuk</button>` : ''}
                </div>
            `;
        }).join('');

        container.innerHTML = `
            ${backBtn}
            <div class="dungeon-view-header">
                <h2 class="dungeon-title">Dungeons</h2>
                <span class="dungeon-public-link">DUNGEON PUBLIK →</span>
            </div>
            <div class="dungeon-list">${dungeonCards}</div>
        `;
    }

    // ---- CALIBRATION VIEW ----
    renderCalibration(npc) {
        const cal = this.game.state.calibration;
        if (!cal) return '<div class="empty-state">Calibration belum tersedia</div>';

        const funds = GameData.CALIBRATION.funds;
        const equipped = this.game.state.inventory.equipped;
        const slots = GameData.EQUIP_SLOTS;

        const fundCards = funds.map(f => {
            const progress = f.period === 'AM' ? cal.amProgress : cal.pmProgress;
            const percent = Math.floor((progress / f.maxProgress) * 100);
            return `
                <div class="calibration-fund-card">
                    <h4>${f.name}</h4>
                    <div class="calibration-progress-bar">
                        <div class="calibration-progress-fill" style="width: ${percent}%"></div>
                    </div>
                    <span class="calibration-progress-text">${progress}/${f.maxProgress} X</span>
                    <span class="calibration-rate">Rate ${f.rate}%</span>
                </div>
            `;
        }).join('');

        const slotOptions = slots.map(slot => {
            const item = equipped[slot];
            return `<option value="${slot}" ${cal.selectedSlot === slot ? 'selected' : ''}>${slot.toUpperCase()}: ${item ? item.name : 'Kosong'}</option>`;
        }).join('');

        return `
            <div class="calibration-section">
                <div class="calibration-funds">${fundCards}</div>
                <div class="calibration-select">
                    <label>Pilih Equipment:</label>
                    <select class="calibration-dropdown" onchange="game.state.calibration.selectedSlot = this.value; ui.renderAll();">
                        <option value="">-- Pilih Slot --</option>
                        ${slotOptions}
                    </select>
                </div>
                <button class="btn btn-calibrate" onclick="game.calibrateItem(game.state.calibration.selectedSlot); ui.renderAll();">KALIBRASI</button>
            </div>
        `;
    }

    // ---- CRAFTING VIEW ----
    renderCraftingView(container) {
        const cs = this.game.state.crafting;
        const expPercent = Math.floor((cs.exp / cs.maxExp) * 100);
        const recipes = GameData.CRAFTING_RECIPES;

        const backBtn = `<div class="back-nav" onclick="game.goBack()">‹ Kembali</div>`;

        container.innerHTML = `
            ${backBtn}
            <div class="crafting-header">
                <div class="section-title-box">MOLECULAR PRINT</div>
                <div class="crafting-level">
                    <span class="crafting-lvl">${cs.level}</span>
                    <span class="crafting-label">LEVEL MENCETAK</span>
                    <div class="crafting-exp-bar">
                        <div class="crafting-exp-fill" style="width: ${expPercent}%"></div>
                    </div>
                    <span class="crafting-exp-text">${Utils.formatNumber(cs.exp)}/${Utils.formatNumber(cs.maxExp)}</span>
                    <span class="crafting-percent">${expPercent}%</span>
                </div>
                <p class="crafting-note">LEVEL CETAK: ${cs.level} PERALATAN<br>Percetakan peralatan dibatakan pada peringkat pencetakanmu, tingkatkan peringkat percetakanmu dengan mencetak lebih banyak item</p>
            </div>
            <div class="recipe-list">
                ${recipes.map(recipe => {
            const reqText = recipe.requirements.map(r => {
                const mat = GameData.MATERIALS.find(m => m.id === r.itemId);
                const has = this.game.hasItem(r.itemId, r.qty);
                return `<span class="${has ? 'has-req' : 'missing-req'}">${mat ? mat.name : r.itemId} x${r.qty}</span>`;
            }).join(', ');

            return `
                        <div class="recipe-card ${recipe.highlight ? 'highlight' : ''}">
                            <div class="recipe-header">
                                <span class="recipe-icon">${recipe.icon}</span>
                                <h4>${recipe.name}</h4>
                            </div>
                            <div class="recipe-details">
                                <div class="recipe-req">
                                    <span class="req-label">Membutuhkan:</span>
                                    <span>${reqText}</span>
                                    <span>${Utils.formatNumber(recipe.costBtc)} BTC</span>
                                </div>
                                <div class="recipe-reward">
                                    <span class="req-label">Menerima:</span>
                                    <span>${recipe.name} x1</span>
                                    <span>${Utils.formatNumber(recipe.craftExp)} Level Mencetak exp</span>
                                </div>
                                <p class="recipe-note">kamu dapat molecular print ${recipe.printCount} kali</p>
                            </div>
                            <button class="btn btn-craft" onclick="game.craftItem('${recipe.id}'); ui.renderAll();">Craft</button>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    // ---- MISSION VIEW ----
    renderMissionView(container) {
        const activeMission = this.game.state.activeMission;
        const backBtn = `<div class="back-nav" onclick="game.goBack()">‹ Kembali</div>`;

        // If a specific mission is selected for detail view
        if (this.selectedMission && !activeMission) {
            this.renderMissionDetail(container, this.selectedMission);
            return;
        }

        if (activeMission) {
            const remaining = this.game.getMissionTimeRemaining();
            const totalDuration = activeMission.duration * (activeMission.qty || 1);

            // Reward type labels
            const rewardTypeLabels = {
                'mencetak': 'Level Mencetak exp',
                'amunisi': 'Level Pembuatan Amunisi exp',
                'medis': 'Level Ilmu medis exp'
            };
            const rewardLabel = rewardTypeLabels[activeMission.rewardType] || 'EXP';
            const skillExpAmount = activeMission.skillExp ? Utils.formatNumber(Utils.randomInt(activeMission.skillExp[0], activeMission.skillExp[1]) * (activeMission.qty || 1)) : '0';

            // Buff tags
            const buffTags = (GameData.BUFF_TAGS || []).map(tag => {
                const isActive = this.game.state.buffs.find(b => b.type === tag.buffType);
                return `<span class="buff-tag ${isActive ? 'enabled' : 'disabled'}">${tag.name} <small>${isActive ? '' : tag.duration || 'DIMATIKAN'}</small></span>`;
            }).join('');

            container.innerHTML = `
                ${backBtn}
                <div class="mission-active">
                    <div class="mission-timer-display" id="mission-timer">${Utils.formatTimer(remaining)}</div>
                    <div class="mission-timer-label">hh:mm:ss</div>
                    <div class="mission-details">
                        <p class="mission-req-label">Menerima:</p>
                        <p>${skillExpAmount} ${rewardLabel}</p>
                    </div>
                    <div class="buff-tags-row">${buffTags}</div>
                    <div class="buffs-section">
                        <div class="buff-card ${this.game.state.buffs.find(b => b.type === 'time_reduction') ? 'active' : ''}" onclick="game.activateBuff('time_reduction'); ui.renderAll();">
                            <span class="buff-icon">⊙</span>
                            <div>
                                <h5>Pengurangan Waktu (saat ini ${this.game.state.buffs.filter(b => b.type === 'time_reduction').length * 40}%)</h5>
                                <p>${GameData.BUFFS.time_reduction.desc}</p>
                            </div>
                            <span class="buff-status">AKTIF</span>
                        </div>
                        <div class="buff-card ${this.game.state.buffs.find(b => b.type === 'buff_exp') ? 'active' : ''}" onclick="game.activateBuff('buff_exp'); ui.renderAll();">
                            <span class="buff-icon">⊙</span>
                            <div>
                                <h5>Buff EXP (saat ini ${this.game.state.buffs.find(b => b.type === 'buff_exp') ? '80' : '0'}%)</h5>
                                <p>${GameData.BUFFS.buff_exp.desc}</p>
                            </div>
                            <span class="buff-status">AKTIF</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Mission list
            const missions = GameData.MISSIONS.filter(m => m.levelReq <= this.game.state.player.level + 5);

            container.innerHTML = `
                ${backBtn}
                <div class="section-title">MISI TERSEDIA</div>
                <div class="mission-list">
                    ${missions.map(mission => `
                        <div class="mission-card" onclick="ui.openMissionDetail('${mission.id}')">
                            <div class="mission-info">
                                <h4>${mission.name}</h4>
                                <p>${mission.desc}</p>
                                <div class="mission-meta">
                                    <span>⏱ ${Utils.formatTimer(mission.duration)}</span>
                                    <span>📊 Lv.${mission.levelReq}+</span>
                                    <span>💰 ${Utils.formatNumber(mission.rewards.btc[0])}-${Utils.formatNumber(mission.rewards.btc[1])} BTC</span>
                                </div>
                            </div>
                            <div class="mission-arrow">→</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    openMissionDetail(missionId) {
        this.selectedMission = GameData.MISSIONS.find(m => m.id === missionId);
        this.renderAll();
    }

    renderMissionDetail(container, mission) {
        const qty = this.missionQtyInput;
        const totalDuration = mission.duration * qty;
        const timeBuff = this.game.state.buffs.filter(b => b.type === 'time_reduction');
        const timeReduction = Math.min(timeBuff.length * 0.4, 0.8);
        const adjustedDuration = Math.floor(totalDuration * (1 - timeReduction));

        const rewardTypeLabels = {
            'mencetak': 'Level Mencetak exp',
            'amunisi': 'Level Pembuatan Amunisi exp',
            'medis': 'Level Ilmu medis exp'
        };
        const rewardLabel = rewardTypeLabels[mission.rewardType] || 'EXP';
        const skillExpTotal = mission.skillExp ? Utils.formatNumber(mission.skillExp[1] * qty) : '0';

        // Requirements
        const reqItems = mission.rewards.items || [];
        const hasReqItem = reqItems.length > 0 && reqItems[0].chance >= 100;
        const reqText = hasReqItem ? `${reqItems[0].itemId.replace(/_/g, ' ')} x${qty}` : '';

        // Buff tags
        const buffTags = (GameData.BUFF_TAGS || []).map(tag => {
            const isActive = this.game.state.buffs.find(b => b.type === tag.buffType);
            return `<span class="buff-tag ${isActive ? 'enabled' : 'disabled'}">${tag.name} <small>${isActive ? '' : tag.duration || 'DIMATIKAN'}</small></span>`;
        }).join('');

        const backBtn = `<div class="back-nav" onclick="ui.selectedMission = null; ui.renderAll();">‹ Kembali</div>`;

        container.innerHTML = `
            ${backBtn}
            <div class="mission-detail-page">
                <div class="mission-timer-display">${Utils.formatTimer(adjustedDuration)}</div>
                <div class="mission-timer-label">hh:mm:ss</div>

                <div class="mission-details">
                    ${reqText ? `<p class="mission-req-label">Membutuhkan:</p><p>${reqText}</p>` : ''}
                    <p class="mission-req-label">Menerima:</p>
                    <p>${skillExpTotal} ${rewardLabel}</p>
                </div>

                <div class="buff-tags-row">${buffTags}</div>

                <div class="buffs-section">
                    <div class="buff-card ${this.game.state.buffs.find(b => b.type === 'time_reduction') ? 'active' : ''}" onclick="game.activateBuff('time_reduction'); ui.renderAll();">
                        <span class="buff-icon">⊙</span>
                        <div>
                            <h5>Pengurangan Waktu (saat ini ${timeBuff.length * 40}%)</h5>
                            <p>${GameData.BUFFS.time_reduction.desc}</p>
                        </div>
                        <span class="buff-status">AKTIF</span>
                    </div>
                    <div class="buff-card ${this.game.state.buffs.find(b => b.type === 'buff_exp') ? 'active' : ''}" onclick="game.activateBuff('buff_exp'); ui.renderAll();">
                        <span class="buff-icon">⊙</span>
                        <div>
                            <h5>Buff EXP (saat ini ${this.game.state.buffs.find(b => b.type === 'buff_exp') ? '80' : '0'}%)</h5>
                            <p>${GameData.BUFFS.buff_exp.desc}</p>
                        </div>
                        <span class="buff-status">AKTIF</span>
                    </div>
                </div>

                <div class="mission-qty-enhanced">
                    <div class="qty-minmax-row">
                        <button class="btn btn-minmax" onclick="ui.setMissionQty(1)">‹ MIN</button>
                        <input type="number" class="qty-input-center" value="${qty}" min="1" max="1000" onchange="ui.setMissionQty(parseInt(this.value) || 1)">
                        <button class="btn btn-minmax" onclick="ui.setMissionQty(1000)">› MAX</button>
                    </div>
                    <div class="qty-slider-row">
                        <input type="range" class="qty-slider" min="1" max="1000" value="${qty}" oninput="ui.setMissionQty(parseInt(this.value))">
                    </div>
                    <div class="qty-quick-row">
                        <button class="btn btn-quick" onclick="ui.setMissionQty(1)">1x</button>
                        <button class="btn btn-quick" onclick="ui.adjustMissionQty(-100)">-100</button>
                        <button class="btn btn-quick" onclick="ui.adjustMissionQty(-10)">-10</button>
                        <button class="btn btn-quick" onclick="ui.adjustMissionQty(10)">+10</button>
                        <button class="btn btn-quick" onclick="ui.adjustMissionQty(100)">+100</button>
                        <button class="btn btn-quick" onclick="ui.adjustMissionQty(1000)">+1k</button>
                    </div>
                    <button class="btn btn-mission-start-full" onclick="ui.startMission('${mission.id}')">MULAI</button>
                </div>
            </div>
        `;
    }

    setMissionQty(qty) {
        this.missionQtyInput = Utils.clamp(qty, 1, 1000);
        this.renderMainPanel();
    }

    adjustMissionQty(delta) {
        this.missionQtyInput = Utils.clamp(this.missionQtyInput + delta, 1, 1000);
        this.renderMainPanel();
    }

    startMission(missionId) {
        const qty = this.missionQtyInput;
        this.game.startMission(missionId, qty);
        this.selectedMission = null;
        this.renderAll();
    }

    updateTimers() {
        const timerEl = document.getElementById('mission-timer');
        if (timerEl) {
            const remaining = this.game.getMissionTimeRemaining();
            timerEl.textContent = Utils.formatTimer(remaining);
        }
    }

    // ---- INVENTORY FULL VIEW ----
    renderInventoryFullView(container) {
        const inv = this.game.state.inventory;
        const equipped = inv.equipped;

        let equippedHtml = '';
        GameData.EQUIP_SLOTS.forEach(slot => {
            const item = equipped[slot];
            equippedHtml += `
                <div class="equip-slot ${item ? 'filled' : 'empty'}" ${item ? `onclick="game.unequipItem('${slot}'); ui.renderAll();"` : ''}>
                    <span class="equip-slot-label">${slot.toUpperCase()}</span>
                    ${item ? `
                        <span class="equip-item-icon">${item.icon}</span>
                        <span class="equip-item-name" style="color: ${Utils.rarityColor(item.rarity)}">${item.name}</span>
                    ` : '<span class="equip-empty">Kosong</span>'}
                </div>
            `;
        });

        // Player stats summary
        const p = this.game.state.player;
        const statsHtml = `
            <div class="player-stats-grid">
                <div class="stat-item"><span class="stat-label">❤️ Health</span><span class="stat-value">${Utils.formatNumber(p.health)}/${Utils.formatNumber(p.maxHealth)}</span></div>
                <div class="stat-item"><span class="stat-label">🛡️ Armor</span><span class="stat-value">${Utils.formatNumber(p.armor)}</span></div>
                <div class="stat-item"><span class="stat-label">⚔️ DMG</span><span class="stat-value">${Utils.formatNumber(p.dmg)}</span></div>
                <div class="stat-item"><span class="stat-label">🎯 Crit</span><span class="stat-value">${p.crit}</span></div>
                <div class="stat-item"><span class="stat-label">🔰 Shield</span><span class="stat-value">${Utils.formatNumber(p.shield)}</span></div>
            </div>
        `;

        container.innerHTML = `
            <div class="section-title">EQUIPMENT</div>
            <div class="equip-grid">${equippedHtml}</div>
            <div class="section-title">STATISTIK</div>
            ${statsHtml}
        `;
    }

    // ---- CHAT VIEW ----
    renderChatView(container) {
        const logs = this.game.state.gameLog.slice(0, 50);
        container.innerHTML = `
            <div class="section-title">OBROLAN / LOG</div>
            <div class="chat-full-view">
                ${logs.map(log => `
                    <div class="chat-msg ${log.type}">
                        <span class="chat-time">${new Date(log.time).toLocaleTimeString('id-ID')}</span>
                        <span class="chat-text">${log.text}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ---- ACCOUNT VIEW ----
    renderAccountView(container) {
        const p = this.game.state.player;
        const stats = this.game.state.stats;
        const hours = Math.floor(stats.playTime / 3600);
        const mins = Math.floor((stats.playTime % 3600) / 60);

        container.innerHTML = `
            <div class="account-view">
                <div class="account-header">
                    <div class="account-avatar">🧑‍💻</div>
                    <h2>${p.name}</h2>
                    <span class="account-title">${p.title}</span>
                    <span class="account-level">Level ${p.level}</span>
                </div>
                <div class="section-title">STATISTIK</div>
                <div class="stats-list">
                    <div class="stat-row"><span>Total BTC Didapatkan</span><span>${Utils.formatNumber(stats.totalBtcEarned)}</span></div>
                    <div class="stat-row"><span>Misi Selesai</span><span>${stats.totalMissionsCompleted}</span></div>
                    <div class="stat-row"><span>Item Di-craft</span><span>${stats.totalItemsCrafted}</span></div>
                    <div class="stat-row"><span>Item Dibeli</span><span>${stats.totalItemsBought}</span></div>
                    <div class="stat-row"><span>Waktu Bermain</span><span>${hours}j ${mins}m</span></div>
                </div>
                <div class="section-title">PENGATURAN</div>
                <div class="settings-list">
                    <div class="setting-row">
                        <span>Nama Karakter</span>
                        <input type="text" class="setting-input" value="${p.name}" onchange="game.state.player.name = this.value; game.saveGame(); ui.renderAll();">
                    </div>
                    <button class="btn btn-danger btn-full" onclick="if(confirm('Reset semua progress?')) { game.resetGame(); ui.renderAll(); }">🗑️ Reset Game</button>
                    <button class="btn btn-primary btn-full" onclick="game.saveGame(); game.addLog('💾 Game disimpan!', 'success'); ui.renderAll();">💾 Simpan Game</button>
                </div>
            </div>
        `;
    }

    // ==========================================
    // RIGHT PANEL - Log/Chat/Notif
    // ==========================================
    renderRightPanel() {
        this.renderRightPanelTabs();
        this.renderLog();
    }

    renderRightPanelTabs() {
        document.querySelectorAll('.right-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === this.rightPanelTab);
        });
    }

    switchRightTab(tab) {
        this.rightPanelTab = tab;
        document.querySelectorAll('.right-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        this.renderLog();
    }

    renderLog() {
        const logContainer = document.getElementById('log-content');
        if (!logContainer) return;

        const logs = this.game.state.gameLog.slice(0, 30);

        if (this.rightPanelTab === 'notif') {
            logContainer.innerHTML = logs.length > 0 ?
                logs.map(log => `
                    <div class="log-entry ${log.type}">
                        <span class="log-text">${log.text}</span>
                    </div>
                `).join('') :
                '<div class="empty-state">Tekan lama untuk menghapus</div>';
        } else {
            logContainer.innerHTML = '<div class="empty-state">Fitur dalam pengembangan</div>';
        }
    }
}

// Initialize
let ui;
document.addEventListener('DOMContentLoaded', () => {
    game.init();
    ui = new UI(game);
    ui.init();
});
