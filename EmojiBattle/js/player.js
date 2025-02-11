// 玩家类
export class Player {
    constructor(id, name, avatarUrl) {
        this.id = id;
        this.name = name;
        this.avatarUrl = avatarUrl;
        
        // 初始化所有属性
        this.stats = {
            // 基础属性
            maxHp: 1000,
            currentHp: 1000,
            attack: 100,
            defense: 50,
            fourDimensions: 10,
            speed: 100,
            toughness: 50,

            // 战斗属性
            critRate: 15,        // 暴击率（%）
            penetrateRate: 15,   // 破击率（%）
            dodgeRate: 15,       // 闪避率（%）
            blockRate: 15,       // 格挡率（%）
            comboRate: 0,        // 连击率（%）

            // 伤害属性
            critDamage: 150,     // 暴击伤害（%）
            penetrateDamage: 200, // 破击伤害（%）
            blockEfficiency: 50,  // 格挡效率（%）
            damageCoefficient: 100, // 伤害系数（%）
            damageTakenCoefficient: 100 // 承伤系数（%）
        };
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
        this.updateUI();
    }

    // 计算减伤率
    calculateDamageReduction(attacker) {
        return (this.stats.defense / (this.stats.defense + attacker.stats.fourDimensions + this.stats.fourDimensions)) * 100;
    }

    // 判断是否触发连击
    checkCombo() {
        return Math.random() * 100 < this.stats.comboRate;
    }

    // 判断是否触发暴击
    checkCrit() {
        return Math.random() * 100 < this.stats.critRate;
    }

    // 判断是否触发破击
    checkPenetrate() {
        return Math.random() * 100 < this.stats.penetrateRate;
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
        let damageType = 'normal';
        let hasCombo = false;

        // 检查是否触发连击（只在非连击状态下检查）
        if (!isCombo) {
            hasCombo = attacker.checkCombo();
            // 如果触发了连击，这一击就是普通伤害
            if (hasCombo) {
                return {
                    damage: Math.max(1, Math.round(damage)),
                    type: 'normal',  // 改为normal，不显示连击标记
                    hasCombo: true
                };
            }
        }

        // 检查暴击
        if (attacker.checkCrit()) {
            damage *= attacker.stats.critDamage / 100;
            damageType = 'crit';
        }
        // 如果没有暴击，检查破击
        else if (attacker.checkPenetrate()) {
            damage *= attacker.stats.penetrateDamage / 100;
            damageType = 'penetrate';
        }

        return {
            damage: Math.max(1, Math.round(damage)),
            type: damageType,
            hasCombo: false
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
            if (statName && this.stats[statName] !== undefined) {
                input.value = this.stats[statName];
            }
        });
    }

    // 重置状态
    reset() {
        this.stats.currentHp = this.stats.maxHp;
        this.updateUI();
    }
} 