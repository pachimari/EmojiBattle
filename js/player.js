// 玩家类
export class Player {
    constructor(id, name, avatarUrl) {
        this.id = id;
        this.name = name;
        this.avatarUrl = avatarUrl;
        
        // 初始化所有属性
        this.stats = {
            // 基础属性
            maxHp: 1000000,
            currentHp: 1000000,
            attack: 100000,
            defense: 100000,
            fourDimensions: 10000,
            speed: 100,


            // 战斗属性
            critRate: 15,        // 暴击率（%）
            penetrateRate: 15,   // 破击率（%）
            dodgeRate: 15,       // 闪避率（%）
            blockRate: 15,       // 格挡率（%）
            comboRate: 0,        // 连击率（%）
            toughness: 0,        // 韧性（%）

            // 伤害属性
            critDamage: 150,     // 暴击伤害（%）
            penetrateDamage: 200, // 破击伤害（%）
            blockEfficiency: 50,  // 格挡效率（%）
            damageCoefficient: 100, // 伤害系数（%）
            damageTakenCoefficient: 100 // 承伤系数（%）
        };

        // 保存初始基础属性
        this.baseStats = { ...this.stats };
    }

    // 设置头像
    setAvatar(url) {
        this.avatarUrl = url;
        const avatarImg = document.querySelector(`#player${this.id}Avatar`);
        if (avatarImg) {
            avatarImg.src = url;
        }
    }

    // 限制属性值在合法范围内
    clampStatValue(statName, value) {
        // 需要限制在[0,100]区间的属性
        const percentageStats = [
            'critRate', 'penetrateRate', 'dodgeRate', 
            'blockRate', 'comboRate'
        ];
        
        if (percentageStats.includes(statName)) {
            return Math.max(0, Math.min(100, value));
        }
        
        // 其他属性的限制
        switch (statName) {
            case 'maxHp':
            case 'currentHp':
            case 'attack':
            case 'defense':
            case 'fourDimensions':
            case 'speed':
            case 'toughness':
                return Math.max(0, value);
            case 'critDamage':
            case 'penetrateDamage':
            case 'blockEfficiency':
            case 'damageCoefficient':
            case 'damageTakenCoefficient':
                return Math.max(0, value); // 这些属性理论上可以超过100%
            default:
                return value;
        }
    }

    // 更新属性
    updateStats(stats) {
        // 对每个属性进行范围限制
        const clampedStats = {};
        for (const [key, value] of Object.entries(stats)) {
            clampedStats[key] = this.clampStatValue(key, value);
        }
        Object.assign(this.stats, clampedStats);

        // 如果是从基础属性页签更新的，同时更新baseStats
        const baseTab = document.querySelector(`.player-${this.id} .tab-content[data-tab="base"]`);
        if (baseTab && baseTab.classList.contains('active')) {
            Object.assign(this.baseStats, clampedStats);
        }

        this.updateUI();
    }

    // 计算减伤率
    calculateDamageReduction(attacker) {
        return (this.stats.defense / (this.stats.defense + attacker.stats.fourDimensions + this.stats.fourDimensions)) * 100;
    }

    // 计算实际触发概率（考虑韧性）
    calculateActualProbability(baseProbability, targetToughness) {
        // 确保韧性在[0,100)范围内
        const clampedToughness = Math.min(99.99, Math.max(0, targetToughness));
        // 计算实际概率
        return baseProbability * (1 - clampedToughness / 100);
    }

    // 判断是否触发连击
    checkCombo(defender) {
        const actualProbability = this.calculateActualProbability(this.stats.comboRate, defender.stats.toughness);
        return Math.random() * 100 < actualProbability;
    }

    // 判断是否触发暴击
    checkCrit(defender) {
        const actualProbability = this.calculateActualProbability(this.stats.critRate, defender.stats.toughness);
        return Math.random() * 100 < actualProbability;
    }

    // 判断是否触发破击
    checkPenetrate(defender) {
        const actualProbability = this.calculateActualProbability(this.stats.penetrateRate, defender.stats.toughness);
        return Math.random() * 100 < actualProbability;
    }

    // 判断是否触发格挡
    checkBlock() {
        return Math.random() * 100 < this.stats.blockRate;
    }

    // 判断是否触发闪避
    checkDodge() {
        return Math.random() * 100 < this.stats.dodgeRate;
    }

    // 计算实际伤害
    calculateDamage(attacker) {
        const damageReduction = this.calculateDamageReduction(attacker);
        
        // 基础伤害计算
        let damage = attacker.stats.attack * 
            (1 - damageReduction * 0.01) * 
            (1 + (attacker.stats.damageCoefficient - 100) * 0.01) * 
            (1 + (this.stats.damageTakenCoefficient - 100) * 0.01);
            
        return Math.max(1, Math.round(damage));
    }

    // 计算最终伤害（包含暴击、破击效果）
    calculateFinalDamage(attacker, isCombo = false) {
        let damage = this.calculateDamage(attacker);
        let effects = [];
        let hasCombo = false;

        // 检查是否触发连击（只在非连击状态下检查）
        if (!isCombo) {
            hasCombo = attacker.checkCombo(this);
            if (hasCombo) {
                return {
                    damage: Math.max(1, Math.round(damage)),
                    type: 'normal',
                    hasCombo: true,
                    effects: ['combo']
                };
            }
        }

        // 检查防守效果（闪避优先于格挡）
        const isDodged = this.checkDodge();
        const isBlocked = !isDodged && this.checkBlock(); // 只有在没有闪避时才检查格挡

        // 检查攻击效果（暴击优先于破击）
        const isCrit = attacker.checkCrit(this);
        const isPenetrate = !isCrit && attacker.checkPenetrate(this);

        // 应用防守效果
        if (isDodged) {
            damage = 0;
            effects.push('dodge');
        } else if (isBlocked) { // 使用else if确保互斥
            const blockEfficiency = Math.min(99.99, Math.max(0, this.stats.blockEfficiency));
            damage *= (1 - blockEfficiency / 100);
            effects.push('block');
        }
        
        // 应用攻击效果（只有在没有闪避时才应用）
        if (!isDodged) {
            if (isCrit) {
                damage *= attacker.stats.critDamage / 100;
                effects.push('crit');
            } else if (isPenetrate) {
                damage *= attacker.stats.penetrateDamage / 100;
                effects.push('penetrate');
            }
        }

        // 确保最小伤害为1（除非被闪避）
        damage = isDodged ? 0 : Math.max(1, Math.round(damage));

        return {
            damage: damage,
            type: effects[0] || 'normal',
            hasCombo: false,
            effects: effects
        };
    }

    // 受到伤害
    takeDamage(damage) {
        this.stats.currentHp = Math.max(0, this.stats.currentHp - damage);
        this.updateUI();
        return damage;
    }

    // 更新UI显示
    updateUI() {
        const healthPercent = (this.stats.currentHp / this.stats.maxHp) * 100;
        const healthBar = document.querySelector(`.player-${this.id} .health-bar-fill`);
        const healthText = document.querySelector(`.player-${this.id} .health-text`);
        
        if (healthBar) {
            healthBar.style.width = `${healthPercent}%`;
        }
        if (healthText) {
            healthText.textContent = `${this.stats.currentHp}/${this.stats.maxHp}`;
        }

        // 更新所有属性输入框
        document.querySelectorAll(`.player-${this.id} .stat-input`).forEach(input => {
            const statName = input.getAttribute('data-stat');
            const tabType = input.closest('.tab-content').getAttribute('data-tab');
            
            if (statName && this.stats[statName] !== undefined) {
                if (tabType === 'base') {
                    input.value = this.baseStats[statName];
                } else {
                    input.value = this.stats[statName];
                }
            }
        });
    }

    // 重置状态
    reset() {
        // 重置为初始基础属性
        this.stats = { ...this.baseStats };
        this.stats.currentHp = this.stats.maxHp;
        this.updateUI();
    }

    // 重置为基础属性
    resetToBase() {
        this.stats = { ...this.baseStats };
        this.updateUI();
    }
} 