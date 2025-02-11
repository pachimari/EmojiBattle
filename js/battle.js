import { Card } from './card.js';
import { CARD_CONFIGS } from './cardConfig.js';
import { TRIGGER_TYPES, VALUE_TYPES, BUFF_TYPES, BUFF_TYPES_REVERSE } from './constants.js';

// 战斗管理类
export class Battle {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.battleLog = [];
        this.isOngoing = false;
        this.turnDelay = 300; // 回合延迟时间（毫秒）
        this.currentTurn = 0;
        this.maxTurns = 0;
        this.showDamageReduction = false; // 默认不显示减伤率
        this.skipNextTurn = null; // 记录下一回合需要跳过出手的玩家
    }

    // 开始战斗
    start() {
        this.isOngoing = true;
        this.battleLog = [];
        this.currentTurn = 0;

        // 重置玩家状态但保留卡牌效果
        this.resetWithCardEffects(this.player1);
        this.resetWithCardEffects(this.player2);

        // 应用战斗开始时的效果
        this.applyBattleStartEffects(this.player1, this.player2);
        this.applyBattleStartEffects(this.player2, this.player1);

        this.addLog('战斗开始！');
        this.processTurn();
    }

    // 重置玩家状态但保留卡牌效果
    resetWithCardEffects(player) {
        // 先重置为基础属性
        player.resetToBase();
        
        // 重新应用所有卡牌效果
        this.reapplyAllCardEffects(player);
        
        // 确保当前生命值等于最大生命值
        player.stats.currentHp = player.stats.maxHp;
        
        // 更新UI显示
        player.updateUI();
    }

    // 重置战斗
    reset() {
        this.isOngoing = false;
        this.battleLog = [];
        this.currentTurn = 0;
        
        // 重置玩家状态
        this.player1.reset();
        this.player2.reset();

        // 先重置所有属性为基础属性
        this.resetPlayerRealStats(this.player1);
        this.resetPlayerRealStats(this.player2);

        // 然后重新应用所有卡牌效果
        this.reapplyAllCardEffects(this.player1);
        this.reapplyAllCardEffects(this.player2);
        
        // 清空战斗日志
        const battleText = document.getElementById('battleText');
        if (battleText) {
            battleText.innerHTML = '<p class="battle-message">等待战斗开始...</p>';
        }
    }

    // 重置玩家的实时属性为基础属性
    resetPlayerRealStats(player) {
        // 使用Player类的resetToBase方法重置为基础属性
        player.resetToBase();
        
        // 更新UI显示
        const realStats = document.querySelector(`.player-${player.id} .tab-content[data-tab="real"]`);
        if (realStats) {
            const statInputs = realStats.querySelectorAll('.stat-input');
            statInputs.forEach(input => {
                const statName = input.dataset.stat;
                if (statName) {
                    input.value = player.stats[statName];
                }
            });
        }
    }

    // 重新应用所有卡牌效果
    reapplyAllCardEffects(player) {
        const cardTab = document.querySelector(`.player-${player.id} .tab-content[data-tab="card"] .stats-section`);
        if (cardTab) {
            const effects = cardTab.querySelectorAll('.card-effect');
            effects.forEach(effect => {
                const cardId = effect.dataset.cardId;
                const cardConfig = CARD_CONFIGS.find(config => config.attribute_id === cardId);
                if (cardConfig) {
                    const count = parseInt(effect.querySelector('h4').textContent.match(/×(\d+)$/)?.[1] || 1);
                    for (let i = 0; i < count; i++) {
                        const card = new Card(cardConfig);
                        card.applyEffect(player);
                    }
                }
            });
        }
    }

    // 应用战斗开始时的效果
    applyBattleStartEffects(player, opponent) {
        const cardTab = document.querySelector(`.player-${player.id} .tab-content[data-tab="card"] .stats-section`);
        if (!cardTab) return;

        const effects = cardTab.querySelectorAll('.card-effect');
        effects.forEach(effect => {
            const cardId = effect.dataset.cardId;
            const cardConfig = CARD_CONFIGS.find(config => config.attribute_id === cardId);
            if (!cardConfig) return;

            const count = parseInt(effect.querySelector('h4').textContent.match(/×(\d+)$/)?.[1] || 1);
            
            // 处理战斗开始时触发的效果
            if (cardConfig.trigger_type === TRIGGER_TYPES.ON_BATTLE_START) {
                this.applyCardEffect(player, opponent, cardConfig, count);
            }
        });
    }

    // 应用攻击前的效果
    applyPreAttackEffects(attacker, defender) {
        const cardTab = document.querySelector(`.player-${attacker.id} .tab-content[data-tab="card"] .stats-section`);
        if (!cardTab) return;

        const effects = cardTab.querySelectorAll('.card-effect');
        effects.forEach(effect => {
            const cardId = effect.dataset.cardId;
            const cardConfig = CARD_CONFIGS.find(config => config.attribute_id === cardId);
            if (!cardConfig) return;

            const count = parseInt(effect.querySelector('h4').textContent.match(/×(\d+)$/)?.[1] || 1);
            
            // 处理攻击时触发的效果
            if (cardConfig.trigger_type === TRIGGER_TYPES.ON_ATTACK) {
                this.applyCardEffect(attacker, defender, cardConfig, count);
            }
        });
    }

    // 应用防守效果
    applyDefenseEffects(defender, attacker) {
        const cardTab = document.querySelector(`.player-${defender.id} .tab-content[data-tab="card"] .stats-section`);
        if (!cardTab) return;

        const effects = cardTab.querySelectorAll('.card-effect');
        effects.forEach(effect => {
            const cardId = effect.dataset.cardId;
            const cardConfig = CARD_CONFIGS.find(config => config.attribute_id === cardId);
            if (!cardConfig) return;

            const count = parseInt(effect.querySelector('h4').textContent.match(/×(\d+)$/)?.[1] || 1);
            
            // 处理防守时触发的效果
            if (cardConfig.trigger_type === TRIGGER_TYPES.ON_DEFENSE) {
                this.applyCardEffect(defender, attacker, cardConfig, count);
            }
        });
    }

    // 应用攻击后的效果
    applyPostAttackEffects(attacker, defender, result) {
        const cardTab = document.querySelector(`.player-${attacker.id} .tab-content[data-tab="card"] .stats-section`);
        if (!cardTab) return;

        const effects = cardTab.querySelectorAll('.card-effect');
        effects.forEach(effect => {
            const cardId = effect.dataset.cardId;
            const cardConfig = CARD_CONFIGS.find(config => config.attribute_id === cardId);
            if (!cardConfig) return;

            const count = parseInt(effect.querySelector('h4').textContent.match(/×(\d+)$/)?.[1] || 1);
            
            // 处理暴击时触发的效果
            if (cardConfig.trigger_type === TRIGGER_TYPES.ON_CRIT && result.effects.includes('crit')) {
                this.applyCardEffect(attacker, defender, cardConfig, count);
            }
        });
    }

    // 统一的卡牌效果应用方法
    applyCardEffect(player, opponent, cardConfig, count = 1) {
        const { buff_type, value_type, target_type, value } = cardConfig;
        const targetPlayer = target_type === 'enemy' ? opponent : player;
        const statName = BUFF_TYPES_REVERSE[buff_type];
        
        if (!statName) return;

        // 计算效果值
        let effectValue = this.calculateEffectValue(player, opponent, value_type, value, count);
        
        // 应用效果
        if (targetPlayer.stats[statName] !== undefined) {
            const originalValue = targetPlayer.stats[statName];
            targetPlayer.stats[statName] = this.clampStatValue(statName, originalValue + effectValue);
            
            // 添加日志
            const description = cardConfig.report_description.replace('{player}', player.name);
            this.addLog(description);
        }
    }

    // 计算效果值
    calculateEffectValue(player, opponent, valueType, baseValue, count = 1) {
        switch (valueType) {
            case VALUE_TYPES.NORMAL:
                return baseValue * count;
                
            case VALUE_TYPES.SPEED_DIFF:
                const speedDiff = Math.max(0, player.stats.speed - opponent.stats.speed);
                return speedDiff * baseValue * count;
                
            case VALUE_TYPES.TIMES_INCREASE:
                return baseValue * count;
                
            case VALUE_TYPES.TARGET_CURRENT_HP:
                return (opponent.stats.currentHp / opponent.stats.maxHp) * 100 * baseValue * count;
                
            case VALUE_TYPES.TARGET_LOST_HP:
                return ((opponent.stats.maxHp - opponent.stats.currentHp) / opponent.stats.maxHp) * 100 * baseValue * count;
                
            case VALUE_TYPES.SELF_MAX_HP:
                return (player.stats.maxHp / 100) * baseValue * count;
                
            case VALUE_TYPES.SELF_ATTACK:
                return (player.stats.attack / 100) * baseValue * count;
                
            default:
                return baseValue * count;
        }
    }

    // 限制属性值
    clampStatValue(statName, value) {
        // 百分比属性（0-100%）
        const percentageStats = ['critRate', 'penetrateRate', 'dodgeRate', 'blockRate', 'comboRate'];
        if (percentageStats.includes(statName)) {
            return Math.max(0, Math.min(100, value));
        }
        
        // 其他属性（最小值为0）
        return Math.max(0, value);
    }

    // 处理单次攻击
    processAttack(attacker, defender, isCombo = false) {
        // 应用攻击前的效果
        this.applyPreAttackEffects(attacker, defender);
        
        // 应用防守效果
        this.applyDefenseEffects(defender, attacker);
        
        // 计算伤害和伤害类型
        const result = defender.calculateFinalDamage(attacker, isCombo);
        
        // 应用攻击后的效果
        this.applyPostAttackEffects(attacker, defender, result);
        
        const actualDamage = defender.takeDamage(result.damage);

        // 构建战报消息
        let message = `${attacker.name} 攻击 ${defender.name}`;
        
        // 添加攻击方效果
        const attackerEffects = result.effects.filter(effect => ['crit', 'penetrate', 'combo'].includes(effect));
        if (attackerEffects.length > 0) {
            message += '（';
            message += attackerEffects.map(effect => {
                switch (effect) {
                    case 'crit': return '暴击💥';
                    case 'penetrate': return '破击🤯';
                    case 'combo': return '连击⚔';
                }
            }).join('，');
            message += '）';
        }

        // 添加防守方效果
        const defenderEffects = result.effects.filter(effect => ['dodge', 'block'].includes(effect));
        if (defenderEffects.length > 0) {
            message += `，${defender.name}（`;
            message += defenderEffects.map(effect => {
                switch (effect) {
                    case 'dodge': return '闪避💨';
                    case 'block': return '格挡🛡';
                }
            }).join('，');
            message += '）';
        }

        message += `，造成 ${actualDamage} 点伤害！`;
        this.addLog(message);

        if (this.showDamageReduction) {
            this.addLog(`减伤率：${defender.calculateDamageReduction(attacker).toFixed(2)}%`);
        }

        // 返回包含是否触发连击的信息
        return {
            isDefeated: defender.stats.currentHp <= 0,
            hasCombo: result.hasCombo
        };
    }

    // 处理回合
    processTurn() {
        if (!this.isOngoing) return;

        this.currentTurn++;
        this.addLog(`第 ${this.currentTurn} 回合`);

        // 确定先后手
        const firstPlayer = this.player1.stats.speed >= this.player2.stats.speed ? this.player1 : this.player2;
        const secondPlayer = firstPlayer === this.player1 ? this.player2 : this.player1;

        // 先手玩家的攻击回合
        if (this.skipNextTurn === firstPlayer) {
            this.skipNextTurn = null; // 重置跳过标记
        } else {
            let result = this.processAttack(firstPlayer, secondPlayer, false);

            // 检查后手玩家是否失败
            if (result.isDefeated) {
                this.endBattle(firstPlayer);
                return;
            }

            // 检查是否触发连击
            if (result.hasCombo) {
                this.addLog(`${firstPlayer.name} 触发连击⚔！`);
                this.addLog(`${secondPlayer.name} 的攻击被跳过`);
                // 标记后手玩家需要跳过当前回合的出手
                // 在跳过对手回合后，检查回合限制
                if (this.maxTurns > 0 && this.currentTurn >= this.maxTurns) {
                    this.checkTurnLimit();
                    return;
                }
                setTimeout(() => this.processTurn(), this.turnDelay);
                return;
            }
        }

        // 后手玩家的攻击回合
        if (this.skipNextTurn === secondPlayer) {
            this.skipNextTurn = null; // 重置跳过标记
            // 在跳过后手玩家的回合后，检查回合限制
            if (this.maxTurns > 0 && this.currentTurn >= this.maxTurns) {
                this.checkTurnLimit();
                return;
            }
        } else {
            let result = this.processAttack(secondPlayer, firstPlayer, false);
            
            // 检查先手玩家是否失败
            if (result.isDefeated) {
                this.endBattle(secondPlayer);
                return;
            }

            // 检查是否触发连击
            if (result.hasCombo) {
                this.addLog(`${secondPlayer.name} 触发连击⚔！`);
                this.addLog(`${firstPlayer.name} 的攻击被跳过`);
                // 标记先手玩家需要跳过下一回合的出手
                this.skipNextTurn = firstPlayer;
                // 在触发连击后，检查回合限制
                if (this.maxTurns > 0 && this.currentTurn >= this.maxTurns) {
                    this.checkTurnLimit();
                    return;
                }
                setTimeout(() => this.processTurn(), this.turnDelay);
                return;
            }
        }

        // 在双方都完成行动后，检查回合限制
        if (this.maxTurns > 0 && this.currentTurn >= this.maxTurns) {
            this.checkTurnLimit();
            return;
        }

        // 继续下一回合
        setTimeout(() => this.processTurn(), this.turnDelay);
    }

    // 检查回合数限制
    checkTurnLimit() {
        // 比较剩余生命百分比来决定胜者
        const hp1Percent = (this.player1.stats.currentHp / this.player1.stats.maxHp) * 100;
        const hp2Percent = (this.player2.stats.currentHp / this.player2.stats.maxHp) * 100;
        
        if (hp1Percent > hp2Percent) {
            this.endBattle(this.player1, true);
        } else if (hp2Percent > hp1Percent) {
            this.endBattle(this.player2, true);
        } else {
            this.endBattle(null, true); // 平局
        }
    }

    // 添加战斗日志
    addLog(message) {
        this.battleLog.push(message);
        const battleText = document.getElementById('battleText');
        if (battleText) {
            const p = document.createElement('p');
            p.className = 'battle-message';
            p.textContent = message;
            battleText.appendChild(p);
            battleText.scrollTop = battleText.scrollHeight;
        }
    }

    // 结束战斗
    endBattle(winner, byTurns = false) {
        this.isOngoing = false;
        if (winner === null) {
            this.addLog(`战斗结束！双方平局！`);
        } else if (byTurns) {
            this.addLog(`达到回合数限制！${winner.name} 获胜！`);
            this.addLog(`剩余生命值比例 - ${this.player1.name}: ${((this.player1.stats.currentHp / this.player1.stats.maxHp) * 100).toFixed(1)}%, ${this.player2.name}: ${((this.player2.stats.currentHp / this.player2.stats.maxHp) * 100).toFixed(1)}%`);
        } else {
            this.addLog(`战斗结束！${winner.name} 获胜！`);
        }
    }
} 