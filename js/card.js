import { CARD_CONFIGS } from './cardConfig.js';
import { TRIGGER_TYPES, VALUE_TYPES, BUFF_TYPES, BUFF_TYPES_REVERSE, TARGET_TYPES, TRIGGER_TYPES_REVERSE, VALUE_TYPES_REVERSE } from './constants.js';

// 卡牌管理类
export class Card {
    constructor(config) {
        this.id = config.attribute_id;
        this.config = config;
        this.count = 1;
        this.triggerType = parseInt(config.trigger_type);
        this.valueType = parseInt(config.value_type);
    }

    // 应用卡牌效果到玩家
    applyEffect(player) {
        const realStats = document.querySelector(`.player-${player.id} .tab-content[data-tab="real"]`);
        if (realStats) {
            // 根据配置应用效果
            this._applyBuffEffect(player, realStats);
        }
    }

    // 移除卡牌效果
    removeEffect(player) {
        const realStats = document.querySelector(`.player-${player.id} .tab-content[data-tab="real"]`);
        if (realStats) {
            // 获取基础属性值并重置
            const baseStats = document.querySelector(`.player-${player.id} .tab-content[data-tab="base"]`);
            if (baseStats) {
                this._removeBuffEffect(player, baseStats, realStats);
            }
        }
    }

    // 计算实际效果值
    calculateEffectValue(player, opponent = null) {
        const { value } = this.config;
        
        switch (this.valueType) {
            case VALUE_TYPES.NORMAL:
                return value;
                
            case VALUE_TYPES.SPEED_DIFF:
                if (!opponent) return value;
                const speedDiff = player.stats.speed - opponent.stats.speed;
                return value * (speedDiff > 0 ? speedDiff : 0);
                
            case VALUE_TYPES.TIMES_INCREASE:
                return value * this.count;
                
            case VALUE_TYPES.TARGET_CURRENT_HP:
                if (!opponent) return value;
                return value * (opponent.stats.currentHp / 100);
                
            case VALUE_TYPES.TARGET_LOST_HP:
                if (!opponent) return value;
                return value * ((opponent.stats.maxHp - opponent.stats.currentHp) / 100);
                
            case VALUE_TYPES.SELF_MAX_HP:
                return value * (player.stats.maxHp / 100);
                
            case VALUE_TYPES.SELF_ATTACK:
                return value * (player.stats.attack / 100);
                
            default:
                return value;
        }
    }

    // 内部方法：应用buff效果
    _applyBuffEffect(player, realStats) {
        const { buff_type } = this.config;
        const statName = BUFF_TYPES_REVERSE[buff_type];
        const statInput = realStats.querySelector(`.stat-input[data-stat="${statName}"]`);
        
        if (statInput) {
            let currentValue = parseInt(statInput.value);
            let effectValue = this.calculateEffectValue(player);
            let newValue = currentValue + effectValue;

            // 根据属性类型限制值的范围
            newValue = this._clampStatValue(statName, newValue);

            // 更新显示和玩家状态
            statInput.value = newValue;
            player.stats[statName] = newValue;
        }
    }

    // 内部方法：限制属性值范围
    _clampStatValue(statName, value) {
        // 百分比类属性（限制在0-100%之间）
        const percentageStats = [
            'critRate', 'penetrateRate', 'dodgeRate', 
            'blockRate', 'comboRate', 'toughness'
        ];
        if (percentageStats.includes(statName)) {
            return Math.max(0, Math.min(100, value));
        }

        // 伤害系数类属性（限制最小值为0%）
        const coefficientStats = [
            'critDamage', 'penetrateDamage', 'blockEfficiency',
            'damageCoefficient', 'damageTakenCoefficient'
        ];
        if (coefficientStats.includes(statName)) {
            return Math.max(0, value);
        }

        // 基础属性（限制最小值为0）
        const baseStats = [
            'maxHp', 'currentHp', 'attack', 'defense',
            'fourDimensions', 'speed'
        ];
        if (baseStats.includes(statName)) {
            return Math.max(0, value);
        }

        return value;
    }

    // 内部方法：移除buff效果
    _removeBuffEffect(player, baseStats, realStats) {
        const { buff_type } = this.config;
        const statName = BUFF_TYPES_REVERSE[buff_type];
        const baseInput = baseStats.querySelector(`.stat-input[data-stat="${statName}"]`);
        const realInput = realStats.querySelector(`.stat-input[data-stat="${statName}"]`);
        
        if (baseInput && realInput) {
            const baseValue = parseInt(baseInput.value);
            realInput.value = baseValue;
            player.stats[statName] = baseValue;
        }
    }

    // 创建卡牌效果显示元素
    createEffectElement(playerId) {
        const effectDiv = document.createElement('div');
        effectDiv.className = 'card-effect';
        effectDiv.dataset.cardId = this.id;
        
        const content = document.createElement('div');
        content.className = 'card-effect-content';
        
        // 获取触发类型和值类型的描述
        const triggerTypeDesc = TRIGGER_TYPES_REVERSE[this.triggerType] || '未知触发类型';
        const valueTypeDesc = VALUE_TYPES_REVERSE[this.valueType] || '未知值类型';
        
        content.innerHTML = `
            <h4>${this.config.attribute_id}${this.count > 1 ? ` ×${this.count}` : ''}</h4>
            <p class="trigger-type">[${triggerTypeDesc}]</p>
            <p class="value-type">[${valueTypeDesc}]</p>
            <p>${this.config.buff_description}</p>
        `;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-effect';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = '删除效果';

        effectDiv.appendChild(content);
        effectDiv.appendChild(deleteBtn);

        return effectDiv;
    }

    // 创建卡牌DOM元素
    createCardElement() {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.dataset.cardId = this.id;

        const content = document.createElement('div');
        content.className = 'card-content';

        const title = document.createElement('h4');
        title.textContent = this.config.attribute_id;

        // 获取触发类型和值类型的描述
        const triggerTypeDesc = TRIGGER_TYPES_REVERSE[this.triggerType] || '未知触发类型';
        const valueTypeDesc = VALUE_TYPES_REVERSE[this.valueType] || '未知值类型';
        
        const triggerType = document.createElement('p');
        triggerType.className = 'trigger-type';
        triggerType.textContent = `[${triggerTypeDesc}]`;

        const valueType = document.createElement('p');
        valueType.className = 'value-type';
        valueType.textContent = `[${valueTypeDesc}]`;

        const desc = document.createElement('p');
        desc.textContent = this.config.buff_description;

        content.appendChild(title);
        content.appendChild(triggerType);
        content.appendChild(valueType);
        content.appendChild(desc);
        card.appendChild(content);

        // 添加拖拽事件监听器
        this.addDragListeners(card);

        return card;
    }

    // 添加拖拽事件监听器
    addDragListeners(card) {
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', this.id);
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
    }
} 