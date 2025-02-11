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
        this.player1.reset();
        this.player2.reset();
        this.addLog('战斗开始！');
        this.processTurn();
    }

    // 重置战斗
    reset() {
        this.isOngoing = false;
        this.battleLog = [];
        this.currentTurn = 0;
        this.player1.reset();
        this.player2.reset();
        
        // 清空战斗日志
        const battleText = document.getElementById('battleText');
        if (battleText) {
            battleText.innerHTML = '<p class="battle-message">等待战斗开始...</p>';
        }
    }

    // 处理单次攻击
    processAttack(attacker, defender, isCombo = false) {
        // 计算伤害和伤害类型
        const result = defender.calculateFinalDamage(attacker, isCombo);
        const actualDamage = defender.takeDamage(result.damage);

        // 根据伤害类型显示不同消息
        let message = `${attacker.name} 攻击 ${defender.name}`;
        switch (result.type) {
            case 'combo':
                message += `（连击⚔）`;
                break;
            case 'crit':
                message += `（暴击💥）`;
                break;
            case 'penetrate':
                message += `（破击🤯）`;
                break;
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

        // 玩家1的攻击回合
        if (this.skipNextTurn === this.player1) {
            this.skipNextTurn = null; // 重置跳过标记
        } else {
            let result = this.processAttack(this.player1, this.player2, false);

            // 检查玩家2是否失败
            if (result.isDefeated) {
                this.endBattle(this.player1);
                return;
            }

            // 检查是否触发连击
            if (result.hasCombo) {
                this.addLog(`${this.player1.name} 触发连击⚔！`);
                this.addLog(`${this.player2.name} 的攻击被跳过`);
                // 标记玩家2需要跳过当前回合的出手
                // 在跳过对手回合后，检查回合限制
                if (this.maxTurns > 0 && this.currentTurn >= this.maxTurns) {
                    this.checkTurnLimit();
                    return;
                }
                setTimeout(() => this.processTurn(), this.turnDelay);
                return;
            }
        }

        // 玩家2的攻击回合
        if (this.skipNextTurn === this.player2) {
            this.skipNextTurn = null; // 重置跳过标记
            // 在跳过玩家2的回合后，检查回合限制
            if (this.maxTurns > 0 && this.currentTurn >= this.maxTurns) {
                this.checkTurnLimit();
                return;
            }
        } else {
            let result = this.processAttack(this.player2, this.player1, false);
            
            // 检查玩家1是否失败
            if (result.isDefeated) {
                this.endBattle(this.player2);
                return;
            }

            // 检查是否触发连击
            if (result.hasCombo) {
                this.addLog(`${this.player2.name} 触发连击⚔！`);
                this.addLog(`${this.player1.name} 的攻击被跳过`);
                // 标记玩家1需要跳过下一回合的出手
                this.skipNextTurn = this.player1;
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