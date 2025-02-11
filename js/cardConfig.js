// 卡牌配置系统
import { TRIGGER_TYPES, VALUE_TYPES, BUFF_TYPES, BUFF_TYPES_REVERSE, TARGET_TYPES, TRIGGER_TYPES_REVERSE, VALUE_TYPES_REVERSE } from './constants.js';

// CSV解析函数
function parseCardConfigFromCSV(csvContent) {
    console.log('开始解析CSV内容:', csvContent);
    const lines = csvContent.trim().split('\n');
    const configs = [];
    
    // 跳过标题行
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [
            attribute_id,
            buff_type,
            trigger_type,
            value_type,
            target_type,
            buff_description,
            report_description,
            value
        ] = line.split(',').map(item => item.trim());

        // 创建配置对象
        const config = {
            attribute_id,
            buff_type: parseInt(buff_type),
            trigger_type: parseInt(trigger_type),
            value_type: parseInt(value_type),
            target_type,
            buff_description,
            report_description,
            value: parseFloat(value)
        };

        console.log(`验证第 ${i} 行配置:`, config);
        console.log('验证结果:', {
            hasId: !!config.attribute_id,
            hasBuffType: !!BUFF_TYPES_REVERSE[config.buff_type],
            hasTriggerType: !!TRIGGER_TYPES[config.trigger_type],
            hasValueType: !!VALUE_TYPES[config.value_type],
            hasTargetType: !!TARGET_TYPES[config.target_type],
            hasBuffDesc: !!config.buff_description,
            hasReportDesc: !!config.report_description,
            isValidValue: !isNaN(config.value)
        });

        // 验证配置
        if (validateCardConfig(config)) {
            configs.push(config);
            console.log('配置验证通过');
        } else {
            console.warn(`Invalid card config at line ${i + 1}:`, config);
        }
    }

    console.log('最终解析结果:', configs);
    return configs;
}

// 验证配置是否合法
function validateCardConfig(config) {
    // 检查TRIGGER_TYPES中是否存在对应的值
    const hasTriggerType = Object.entries(TRIGGER_TYPES).some(([_, value]) => value === config.trigger_type);
    // 检查VALUE_TYPES中是否存在对应的值
    const hasValueType = Object.entries(VALUE_TYPES).some(([_, value]) => value === config.value_type);

    console.log('详细验证结果:', {
        id: {
            value: config.attribute_id,
            valid: !!config.attribute_id
        },
        buffType: {
            value: config.buff_type,
            valid: !!BUFF_TYPES_REVERSE[config.buff_type],
            mapping: BUFF_TYPES_REVERSE[config.buff_type]
        },
        triggerType: {
            value: config.trigger_type,
            valid: hasTriggerType,
            mapping: TRIGGER_TYPES_REVERSE[config.trigger_type]
        },
        valueType: {
            value: config.value_type,
            valid: hasValueType,
            mapping: VALUE_TYPES_REVERSE[config.value_type]
        },
        targetType: {
            value: config.target_type,
            valid: !!TARGET_TYPES[config.target_type],
            mapping: TARGET_TYPES[config.target_type]
        },
        buffDesc: {
            value: config.buff_description,
            valid: !!config.buff_description
        },
        reportDesc: {
            value: config.report_description,
            valid: !!config.report_description
        },
        value: {
            value: config.value,
            valid: !isNaN(config.value)
        }
    });

    const isValid = (
        config.attribute_id &&
        BUFF_TYPES_REVERSE[config.buff_type] &&
        hasTriggerType &&
        hasValueType &&
        TARGET_TYPES[config.target_type] &&
        config.buff_description &&
        config.report_description &&
        !isNaN(config.value)
    );

    console.log('配置验证结果:', isValid);
    return isValid;
}

// 从CSV文件加载配置
async function loadCardConfigs() {
    try {
        console.log('开始加载 cards.csv');
        const response = await fetch('./cards.csv');
        if (!response.ok) {
            throw new Error(`加载 cards.csv 失败: ${response.status} ${response.statusText}`);
        }
        const csvContent = await response.text();
        console.log('CSV文件内容:', csvContent);
        return parseCardConfigFromCSV(csvContent);
    } catch (error) {
        console.error('加载卡牌配置出错:', error);
        return [];
    }
}

// 导出卡牌配置
let CARD_CONFIGS = [];

// 初始化配置
loadCardConfigs().then(configs => {
    console.log('配置加载完成:', configs);
    CARD_CONFIGS = configs;
    // 触发一个自定义事件，通知配置已加载完成
    document.dispatchEvent(new CustomEvent('cardConfigsLoaded', { detail: configs }));
}).catch(error => {
    console.error('Failed to initialize card configs:', error);
});

export { CARD_CONFIGS }; 