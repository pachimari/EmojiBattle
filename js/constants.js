// 触发类型
export const TRIGGER_TYPES = {
    PASSIVE: 1,              // 被动效果
    ON_BATTLE_START: 2,      // 战斗开始时
    ON_TURN_START: 3,        // 回合开始时
    ON_ATTACK: 4,            // 攻击时
    ON_TAKE_DAMAGE: 5,       // 受到伤害时
    ON_HEAL: 6,              // 治疗时
    ON_KILL: 7,              // 击杀时
    ON_DEFENSE: 8,           // 防守时
    ON_DODGE: 9,             // 闪避时
    ON_BLOCK: 10,            // 格挡时
    ON_PENETRATE: 11,        // 破击时
    ON_COMBO: 12,            // 连击时
    ON_LOW_HP: 13,           // 低生命时
    ON_HIGH_HP: 14,          // 高生命时
    ON_DEATH: 15,            // 死亡时
    ON_CRIT: 16             // 暴击时
};

// 数值类型
export const VALUE_TYPES = {
    NORMAL: 1,               // 普通固定值
    SPEED_DIFF: 2,          // 基于速度差
    TIMES_INCREASE: 3,      // 叠加次数
    TARGET_CURRENT_HP: 4,   // 基于目标当前生命
    TARGET_LOST_HP: 5,      // 基于目标已损失生命
    SELF_MAX_HP: 6,         // 基于自身最大生命
    SELF_ATTACK: 7          // 基于自身攻击力
};

// 属性类型映射（buff_type -> statName）
export const BUFF_TYPES = {
    ATTACK: 1,              // 攻击力
    DEFENSE: 2,             // 防御力
    HP: 3,                  // 生命值
    SPEED: 4,               // 速度
    DAMAGE_COEFF: 5,        // 伤害系数
    CRIT_RATE: 6,          // 暴击率
    PENETRATE_RATE: 7,     // 破击率
    BLOCK_RATE: 8,         // 格挡率
    DODGE_RATE: 9,         // 闪避率
    COMBO_RATE: 10,        // 连击率
    TOUGHNESS: 11,         // 韧性
    CRIT_DAMAGE: 12,       // 暴击伤害
    PENETRATE_DAMAGE: 13,  // 破击伤害
    DAMAGE: 14,            // 最终伤害
    DAMAGE_TAKEN: 15,      // 承受伤害
    MAX_HP: 16,            // 最大生命值
    CURRENT_HP: 17,        // 当前生命值
    HEAL_COEFF: 18,        // 治疗系数
    BLOCK_EFFICIENCY: 19   // 格挡效率
};

// 反向映射（用于从buff_type找到对应的属性名）
export const BUFF_TYPES_REVERSE = {
    1: 'attack',
    2: 'defense',
    3: 'currentHp',
    4: 'speed',
    5: 'damageCoefficient',
    6: 'critRate',
    7: 'penetrateRate',
    8: 'blockRate',
    9: 'dodgeRate',
    10: 'comboRate',
    11: 'toughness',
    12: 'critDamage',
    13: 'penetrateDamage',
    14: 'damage',
    15: 'damageTaken',
    16: 'maxHp',
    17: 'currentHp',
    18: 'healCoefficient',
    19: 'blockEfficiency'
};

// 触发类型反向映射
export const TRIGGER_TYPES_REVERSE = {
    1: '被动效果',
    2: '战斗开始时',
    3: '回合开始时',
    4: '攻击时',
    5: '受到伤害时',
    6: '治疗时',
    7: '击杀时',
    8: '防守时',
    9: '闪避时',
    10: '格挡时',
    11: '破击时',
    12: '连击时',
    13: '低生命时',
    14: '高生命时',
    15: '死亡时',
    16: '暴击时'
};

// 数值类型反向映射
export const VALUE_TYPES_REVERSE = {
    1: '固定值',
    2: '基于速度差',
    3: '叠加次数',
    4: '基于目标当前生命',
    5: '基于目标已损失生命',
    6: '基于自身最大生命',
    7: '基于自身攻击力'
};

// 目标类型枚举
export const TARGET_TYPES = {
    SELF: 'self',                // 自身
    ENEMY: 'enemy',              // 敌人
    ALL: 'all',                  // 所有人
    self: 'self',                // 自身（小写）
    enemy: 'enemy',              // 敌人（小写）
    all: 'all'                   // 所有人（小写）
};

// 目标类型反向映射
export const TARGET_TYPES_REVERSE = {
    'self': '自身',
    'enemy': '敌人',
    'all': '所有人'
}; 