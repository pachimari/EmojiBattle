import { Player } from './player.js';
import { Battle } from './battle.js';
import { UI } from './ui.js';
import { TabManager } from './tabs.js';
import { Card } from './card.js';
import { CARD_CONFIGS } from './cardConfig.js';

// 游戏主类
class Game {
    constructor() {
        // 创建玩家实例
        this.player1 = new Player(1, '玩家1', 'images/player1.png');
        this.player2 = new Player(2, '玩家2', 'images/player2.png');
        
        // 创建战斗实例
        this.battle = new Battle(this.player1, this.player2);
        
        // 创建UI管理器
        this.ui = new UI();
        
        // 创建页签管理器
        this.tabManager = new TabManager();
        
        // 初始化卡牌系统
        this.initializeCards();
        
        // 初始化游戏
        this.init();
    }

    // 初始化卡牌系统
    initializeCards() {
        // 监听配置加载完成事件
        document.addEventListener('cardConfigsLoaded', (event) => {
            const cardList = document.querySelector('.card-list');
            if (cardList) {
                // 清空现有卡牌
                cardList.innerHTML = '';
                
                // 创建卡牌
                event.detail.forEach(cardConfig => {
                    const card = new Card(cardConfig);
                    const cardElement = card.createCardElement();
                    cardList.appendChild(cardElement);
                });
            }

            // 初始化玩家区域的拖放事件
            this.initializePlayerDropZones();
        });
    }

    // 初始化玩家区域的拖放事件
    initializePlayerDropZones() {
        const playerAreas = document.querySelectorAll('.player');
        
        playerAreas.forEach(area => {
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('drag-over');
            });

            area.addEventListener('dragleave', () => {
                area.classList.remove('drag-over');
            });

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('drag-over');

                const cardId = e.dataTransfer.getData('text/plain');
                // 从CARD_CONFIGS中找到对应的配置
                const cardConfig = CARD_CONFIGS.find(config => config.attribute_id === cardId);
                
                if (cardConfig) {
                    // 获取目标玩家
                    const playerId = area.classList.contains('player-1') ? 1 : 2;
                    const player = playerId === 1 ? this.player1 : this.player2;

                    // 获取卡牌页签内容
                    const cardTab = area.querySelector('.tab-content[data-tab="card"] .stats-section');
                    if (cardTab) {
                        // 检查是否已存在相同的卡牌效果
                        const existingEffect = cardTab.querySelector(`.card-effect[data-card-id="${cardId}"]`);
                        if (existingEffect) {
                            // 更新现有卡牌的计数
                            const card = new Card(cardConfig);
                            card.count = parseInt(existingEffect.querySelector('h4').textContent.match(/×(\d+)$/)?.[1] || 1) + 1;
                            existingEffect.replaceWith(card.createEffectElement(playerId));
                        } else {
                            // 创建新卡牌效果
                            const card = new Card(cardConfig);
                            cardTab.appendChild(card.createEffectElement(playerId));
                        }

                        // 为删除按钮添加事件监听器
                        this.setupDeleteEffectListeners(cardTab, player);
                    }

                    // 应用卡牌效果
                    const card = new Card(cardConfig);
                    card.applyEffect(player);
                }
            });
        });
    }

    // 设置卡牌效果删除按钮的事件监听器
    setupDeleteEffectListeners(cardTab, player) {
        const deleteButtons = cardTab.querySelectorAll('.delete-effect');
        deleteButtons.forEach(button => {
            if (!button.hasListener) {
                button.addEventListener('click', () => {
                    const effectDiv = button.closest('.card-effect');
                    if (effectDiv) {
                        // 移除卡牌效果显示
                        effectDiv.remove();

                        // 使用battle实例的方法重置属性并重新应用效果
                        this.battle.resetPlayerRealStats(player);
                        this.battle.reapplyAllCardEffects(player);
                    }
                });
                button.hasListener = true;
            }
        });
    }

    // 重置玩家的实时属性为基础属性
    resetPlayerRealStats(player) {
        const baseStats = document.querySelector(`.player-${player.id} .tab-content[data-tab="base"]`);
        const realStats = document.querySelector(`.player-${player.id} .tab-content[data-tab="real"]`);
        
        if (baseStats && realStats) {
            const statInputs = baseStats.querySelectorAll('.stat-input');
            statInputs.forEach(input => {
                const statName = input.dataset.stat;
                const realInput = realStats.querySelector(`.stat-input[data-stat="${statName}"]`);
                if (realInput) {
                    realInput.value = input.value;
                    player.stats[statName] = parseInt(input.value);
                }
            });
        }
    }


    // 初始化
    init() {
        // 设置头像选择器
        this.ui.setupAvatarSelector(1);
        this.ui.setupAvatarSelector(2);

        // 监听属性变化
        document.addEventListener('stat-change', (e) => {
            const { playerId, statName, value } = e.detail;
            const player = playerId === 1 ? this.player1 : this.player2;
            player.updateStats({ [statName]: value });
        });

        // 监听头像变化
        document.addEventListener('avatar-change', (e) => {
            const { playerId, imageUrl } = e.detail;
            const player = playerId === 1 ? this.player1 : this.player2;
            player.setAvatar(imageUrl);
        });

        // 监听玩家名称变化
        const player1NameInput = document.getElementById('player1Name');
        const player2NameInput = document.getElementById('player2Name');
        
        if (player1NameInput) {
            player1NameInput.addEventListener('change', (e) => {
                this.player1.name = e.target.value || '玩家1';
            });
        }
        
        if (player2NameInput) {
            player2NameInput.addEventListener('change', (e) => {
                this.player2.name = e.target.value || '玩家2';
            });
        }

        // 监听减伤率显示选项
        const showDamageReductionCheckbox = document.getElementById('showDamageReduction');
        if (showDamageReductionCheckbox) {
            showDamageReductionCheckbox.addEventListener('change', (e) => {
                this.battle.showDamageReduction = e.target.checked;
            });
        }

        // 监听批量模式复选框
        const batchModeCheckbox = document.getElementById('batchMode');
        const batchOptions = document.querySelector('.batch-options');
        if (batchModeCheckbox && batchOptions) {
            batchModeCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    batchOptions.classList.add('show');
                    // 添加一个小延迟以确保过渡效果正常显示
                    requestAnimationFrame(() => {
                        batchOptions.style.display = 'flex';
                    });
                } else {
                    batchOptions.classList.remove('show');
                    // 等待过渡效果完成后再隐藏元素
                    setTimeout(() => {
                        if (!batchModeCheckbox.checked) {
                            batchOptions.style.display = 'none';
                        }
                    }, 300);
                }
            });
        }

        // 绑定开始战斗按钮
        const startButton = document.getElementById('startBattle');
        if (startButton) {
            startButton.addEventListener('click', () => {
                if (!this.battle.isOngoing) {
                    // 设置回合限制
                    const maxTurnsInput = document.getElementById('maxTurns');
                    if (maxTurnsInput) {
                        this.battle.maxTurns = parseInt(maxTurnsInput.value) || 0;
                    }

                    // 同步玩家名字
                    const player1NameInput = document.getElementById('player1Name');
                    const player2NameInput = document.getElementById('player2Name');
                    if (player1NameInput) {
                        this.player1.name = player1NameInput.value || '玩家1';
                    }
                    if (player2NameInput) {
                        this.player2.name = player2NameInput.value || '玩家2';
                    }

                    // 检查是否为批量模式
                    const batchModeCheckbox = document.getElementById('batchMode');
                    if (batchModeCheckbox && batchModeCheckbox.checked) {
                        // 获取批量战斗次数
                        const batchTimesInput = document.getElementById('batchTimes');
                        const times = batchTimesInput ? Math.min(Math.max(parseInt(batchTimesInput.value) || 1000, 1), 10000) : 1000;
                        
                        // 设置为批量模式
                        this.battle.isBatchMode = true;
                        
                        // 禁用输入并切换到实时属性页签
                        this.ui.toggleInputs(true);
                        document.querySelectorAll('.stats-tabs .tab-btn[data-tab="real"]').forEach(btn => {
                            btn.click();
                        });
                        
                        // 禁用基础属性和卡牌页签
                        document.querySelectorAll('.stats-tabs .tab-btn[data-tab="base"], .stats-tabs .tab-btn[data-tab="card"]').forEach(btn => {
                            btn.disabled = true;
                        });
                        
                        // 同步基础属性到实时属性
                        this.syncStatsToReal();
                        
                        // 开始批量战斗
                        this.battle.startBatchBattle(times);
                    } else {
                        // 单次战斗模式
                        this.battle.isBatchMode = false;
                        
                        // 禁用输入并切换到实时属性页签
                        this.ui.toggleInputs(true);
                        document.querySelectorAll('.stats-tabs .tab-btn[data-tab="real"]').forEach(btn => {
                            btn.click();
                        });
                        
                        // 禁用基础属性和卡牌页签
                        document.querySelectorAll('.stats-tabs .tab-btn[data-tab="base"], .stats-tabs .tab-btn[data-tab="card"]').forEach(btn => {
                            btn.disabled = true;
                        });
                        
                        // 同步基础属性到实时属性
                        this.syncStatsToReal();
                        
                        // 开始单次战斗
                        this.battle.start();
                    }
                }
            });
        }

        // 绑定重置战斗按钮
        const resetButton = document.getElementById('resetBattle');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                // 启用输入
                this.ui.toggleInputs(false);
                
                // 启用所有页签
                document.querySelectorAll('.stats-tabs .tab-btn').forEach(btn => {
                    btn.disabled = false;
                });
                
                // 切换到基础属性页签
                document.querySelectorAll('.stats-tabs .tab-btn[data-tab="base"]').forEach(btn => {
                    btn.click();
                });
                
                // 重置战斗
                this.battle.reset();
            });
        }

        // 为属性输入框添加data-stat属性
        this.setupStatInputs();
    }

    // 同步基础属性到实时属性
    syncStatsToReal() {
        const players = [this.player1, this.player2];
        players.forEach(player => {
            const baseInputs = document.querySelectorAll(`.player-${player.id} .tab-content[data-tab="base"] .stat-input`);
            baseInputs.forEach(input => {
                const statName = input.getAttribute('data-stat');
                const value = input.value;
                const realInput = document.querySelector(`.player-${player.id} .tab-content[data-tab="real"] .stat-input[data-stat="${statName}"]`);
                if (realInput) {
                    realInput.value = value;
                }
            });
        });
    }

    // 设置属性输入框
    setupStatInputs() {
        const statNames = ['attack', 'defense', 'maxHp', 'fourDimensions', 'speed', 'toughness',
                          'critRate', 'penetrateRate', 'dodgeRate', 'blockRate',
                          'critDamage', 'penetrateDamage', 'blockEfficiency'];
        
        document.querySelectorAll('.stat-group').forEach(group => {
            const input = group.querySelector('.stat-input');
            const statName = input.getAttribute('data-stat');
            if (statName && this.player1.stats[statName] !== undefined) {
                input.value = this.player1.stats[statName];
            }
        });
    }
}

// 当页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 