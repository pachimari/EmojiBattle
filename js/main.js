import { Player } from './player.js';
import { Battle } from './battle.js';
import { UI } from './ui.js';
import { TabManager } from './tabs.js';

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
        
        // 初始化游戏
        this.init();
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

                    // 禁用输入
                    this.ui.toggleInputs(true);
                    
                    // 切换到实时属性页签
                    document.querySelectorAll('.stats-tabs .tab-btn[data-tab="real"]').forEach(btn => {
                        btn.click();
                    });
                    
                    // 同步基础属性到实时属性
                    this.syncStatsToReal();
                    
                    // 开始战斗
                    this.battle.start();
                }
            });
        }

        // 绑定重置战斗按钮
        const resetButton = document.getElementById('resetBattle');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                // 启用输入
                this.ui.toggleInputs(false);
                
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