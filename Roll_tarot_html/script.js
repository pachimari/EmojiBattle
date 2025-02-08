// 塔罗牌数据
const tarotCards = [
    // 大阿尔卡纳牌
    {
        name: "愚者",
        image: "images/RWS_Tarot_00_Fool.jpg",
        meaning: "新的开始，冒险，纯真，自发性，自由精神",
        reversedMeaning: "鲁莽，不负责任，过度冒险，不成熟"
    },
    {
        name: "魔术师",
        image: "images/RWS_Tarot_01_Magician.jpg",
        meaning: "创造力，技能，意志力，自信，专注",
        reversedMeaning: "欺骗，技能不足，意志力薄弱，自我怀疑"
    },
    {
        name: "女祭司",
        image: "images/RWS_Tarot_02_High_Priestess.jpg",
        meaning: "直觉，神秘，内在知识，精神力量",
        reversedMeaning: "直觉受阻，表面化，隐藏的真相，混乱的思绪"
    },
    {
        name: "女皇",
        image: "images/RWS_Tarot_03_Empress.jpg",
        meaning: "丰盛，创造力，滋养，母性，自然",
        reversedMeaning: "创造力受阻，依赖，过度保护，空虚"
    },
    {
        name: "皇帝",
        image: "images/RWS_Tarot_04_Emperor.jpg",
        meaning: "权威，领导力，稳定，控制，规则",
        reversedMeaning: "专制，固执，缺乏领导力，权力滥用"
    },
    {
        name: "教皇",
        image: "images/RWS_Tarot_05_Hierophant.jpg",
        meaning: "传统，精神指引，教育，信仰，道德",
        reversedMeaning: "叛逆，不守规矩，虚伪，教条主义"
    },
    {
        name: "恋人",
        image: "images/RWS_Tarot_06_Lovers.jpg",
        meaning: "爱情，关系，选择，和谐，价值观",
        reversedMeaning: "不和谐，分离，错误的选择，价值观冲突"
    },
    {
        name: "战车",
        image: "images/RWS_Tarot_07_Chariot.jpg",
        meaning: "胜利，意志力，决心，自控，进步",
        reversedMeaning: "失控，方向迷失，意志消沉，失败"
    },
    {
        name: "力量",
        image: "images/RWS_Tarot_08_Strength.jpg",
        meaning: "内在力量，勇气，耐心，温和，自信",
        reversedMeaning: "自我怀疑，软弱，冲动，缺乏信心"
    },
    {
        name: "隐士",
        image: "images/RWS_Tarot_09_Hermit.jpg",
        meaning: "内省，寻找智慧，独处，指引，灵性",
        reversedMeaning: "孤独，封闭，迷失方向，拒绝建议"
    },
    {
        name: "命运之轮",
        image: "images/RWS_Tarot_10_Wheel_of_Fortune.jpg",
        meaning: "命运，转折点，机会，变化，周期",
        reversedMeaning: "厄运，阻碍，计划受阻，不利变化"
    },
    {
        name: "正义",
        image: "images/RWS_Tarot_11_Justice.jpg",
        meaning: "正义，平衡，真理，诚实，因果",
        reversedMeaning: "不公，失衡，欺骗，逃避责任"
    },
    {
        name: "倒吊人",
        image: "images/RWS_Tarot_12_Hanged_Man.jpg",
        meaning: "牺牲，放下，新视角，等待，顿悟",
        reversedMeaning: "停滞，抗拒改变，无谓牺牲，固执"
    },
    {
        name: "死神",
        image: "images/RWS_Tarot_13_Death.jpg",
        meaning: "结束，转变，新生，释放，蜕变",
        reversedMeaning: "拒绝改变，停滞，衰退，无法放下"
    },
    {
        name: "节制",
        image: "images/RWS_Tarot_14_Temperance.jpg",
        meaning: "平衡，节制，调和，耐心，适度",
        reversedMeaning: "失衡，过度，冲突，缺乏耐心"
    },
    {
        name: "恶魔",
        image: "images/RWS_Tarot_15_Devil.jpg",
        meaning: "执着，欲望，束缚，诱惑，阴暗面",
        reversedMeaning: "释放，觉醒，摆脱束缚，克服诱惑"
    },
    {
        name: "塔",
        image: "images/RWS_Tarot_16_Tower.jpg",
        meaning: "突变，崩塌，启示，解放，意外",
        reversedMeaning: "避免灾难，渐进改变，恐惧改变"
    },
    {
        name: "星星",
        image: "images/RWS_Tarot_17_Star.jpg",
        meaning: "希望，启发，宁静，引导，信心",
        reversedMeaning: "失望，丧失信心，迷失方向，消极"
    },
    {
        name: "月亮",
        image: "images/RWS_Tarot_18_Moon.jpg",
        meaning: "直觉，幻想，恐惧，潜意识，不确定",
        reversedMeaning: "摆脱恐惧，真相显现，克服困难"
    },
    {
        name: "太阳",
        image: "images/RWS_Tarot_19_Sun.jpg",
        meaning: "快乐，活力，成功，正面能量，清晰",
        reversedMeaning: "暂时的阴霾，过度乐观，虚假的快乐"
    },
    {
        name: "审判",
        image: "images/RWS_Tarot_20_Judgement.jpg",
        meaning: "觉醒，重生，召唤，评估，宽恕",
        reversedMeaning: "自我怀疑，拒绝改变，后悔，错失机会"
    },
    {
        name: "世界",
        image: "images/RWS_Tarot_21_World.jpg",
        meaning: "圆满，完成，整合，成功，旅程",
        reversedMeaning: "未完成，停滞，目标受阻，缺乏成就"
    },
    
    // 权杖
    ...Array.from({length: 14}, (_, i) => {
        let name;
        if (i + 1 <= 10) {
            name = `权杖${i + 1}`;
        } else if (i + 1 === 11) {
            name = "权杖侍从";
        } else if (i + 1 === 12) {
            name = "权杖骑士";
        } else if (i + 1 === 13) {
            name = "权杖皇后";
        } else {
            name = "权杖国王";
        }
        return {
            name,
            image: `images/Wands${String(i + 1).padStart(2, '0')}.jpg`,
            meaning: getWandsMeaning(i + 1, false),
            reversedMeaning: getWandsMeaning(i + 1, true)
        };
    }),
    
    // 圣杯
    ...Array.from({length: 14}, (_, i) => {
        let name;
        if (i + 1 <= 10) {
            name = `圣杯${i + 1}`;
        } else if (i + 1 === 11) {
            name = "圣杯侍从";
        } else if (i + 1 === 12) {
            name = "圣杯骑士";
        } else if (i + 1 === 13) {
            name = "圣杯皇后";
        } else {
            name = "圣杯国王";
        }
        return {
            name,
            image: `images/Cups${String(i + 1).padStart(2, '0')}.jpg`,
            meaning: getCupsMeaning(i + 1, false),
            reversedMeaning: getCupsMeaning(i + 1, true)
        };
    }),
    
    // 宝剑
    ...Array.from({length: 14}, (_, i) => {
        let name;
        if (i + 1 <= 10) {
            name = `宝剑${i + 1}`;
        } else if (i + 1 === 11) {
            name = "宝剑侍从";
        } else if (i + 1 === 12) {
            name = "宝剑骑士";
        } else if (i + 1 === 13) {
            name = "宝剑皇后";
        } else {
            name = "宝剑国王";
        }
        return {
            name,
            image: `images/Swords${String(i + 1).padStart(2, '0')}.jpg`,
            meaning: getSwordsMeaning(i + 1, false),
            reversedMeaning: getSwordsMeaning(i + 1, true)
        };
    }),
    
    // 钱币
    ...Array.from({length: 14}, (_, i) => {
        let name;
        if (i + 1 <= 10) {
            name = `钱币${i + 1}`;
        } else if (i + 1 === 11) {
            name = "钱币侍从";
        } else if (i + 1 === 12) {
            name = "钱币骑士";
        } else if (i + 1 === 13) {
            name = "钱币皇后";
        } else {
            name = "钱币国王";
        }
        return {
            name,
            image: `images/Pents${String(i + 1).padStart(2, '0')}.jpg`,
            meaning: getPentsMeaning(i + 1, false),
            reversedMeaning: getPentsMeaning(i + 1, true)
        };
    })
];

// 小阿尔卡纳牌含义
function getWandsMeaning(num, isReversed = false) {
    const meanings = {
        1: {
            upright: "创造力的开始，灵感，新机会",
            reversed: "创意受阻，计划延迟，缺乏动力"
        },
        2: {
            upright: "规划，决策，平衡选择",
            reversed: "犹豫不决，拖延，选择困难"
        },
        3: {
            upright: "团队合作，扩展，成长",
            reversed: "合作受阻，团队冲突，发展停滞"
        },
        4: {
            upright: "稳定，休息，庆祝成果",
            reversed: "不安定，过度劳累，虚假的成功"
        },
        5: {
            upright: "竞争，挑战，冲突",
            reversed: "避免冲突，内部竞争，无谓争斗"
        },
        6: {
            upright: "胜利，成功，好消息",
            reversed: "失败，骄傲自满，虚假的胜利"
        },
        7: {
            upright: "防御，坚持，毅力",
            reversed: "防御过度，固执己见，缺乏耐心"
        },
        8: {
            upright: "快速行动，变化，消息",
            reversed: "行动受阻，方向错误，坏消息"
        },
        9: {
            upright: "力量，准备，持续",
            reversed: "力不从心，准备不足，难以持续"
        },
        10: {
            upright: "压力，负担，责任",
            reversed: "压力过大，逃避责任，负担过重"
        },
        11: {
            upright: "侍从：热情的信使，新的开始，冒险精神，创意火花",
            reversed: "侍从逆位：鲁莽，缺乏耐心，行动力不足，创意受阻"
        },
        12: {
            upright: "骑士：充满活力，勇往直前，追求理想，富有魅力",
            reversed: "骑士逆位：鲁莽冲动，自大，缺乏方向，过于激进"
        },
        13: {
            upright: "皇后：热情似火，充满魅力，领导力，创造力",
            reversed: "皇后逆位：专制，情绪化，缺乏耐心，过度支配"
        },
        14: {
            upright: "国王：有远见，富有魅力，领导才能，创造力",
            reversed: "国王逆位：专制，傲慢，脾气暴躁，缺乏同理心"
        }
    };
    return isReversed ? meanings[num]?.reversed : meanings[num]?.upright || meanings[num];
}

function getCupsMeaning(num, isReversed = false) {
    const meanings = {
        1: {
            upright: "新的感情，创意，直觉",
            reversed: "情感枯竭，创意受阻，直觉失准"
        },
        2: {
            upright: "伙伴关系，选择，结合",
            reversed: "分离，不和谐，错误的选择"
        },
        3: {
            upright: "庆祝，欢乐，社交",
            reversed: "过度放纵，虚假的快乐，社交障碍"
        },
        4: {
            upright: "倦怠，沉思，不满",
            reversed: "新的希望，走出低谷，重获动力"
        },
        5: {
            upright: "失望，遗憾，悲伤",
            reversed: "重获希望，接受现实，走出悲伤"
        },
        6: {
            upright: "怀旧，重聚，回忆",
            reversed: "沉溺过去，无法前进，错过机会"
        },
        7: {
            upright: "选择，幻想，方向",
            reversed: "错误选择，不切实际，迷失方向"
        },
        8: {
            upright: "离开，寻找，改变",
            reversed: "害怕改变，无法放手，停滞不前"
        },
        9: {
            upright: "满足，愿望，成功",
            reversed: "物质主义，空虚，表面满足"
        },
        10: {
            upright: "和谐，幸福，圆满",
            reversed: "家庭矛盾，不和谐，假象幸福"
        },
        11: {
            upright: "侍从：感性的信使，新的感情，浪漫的开始，艺术灵感",
            reversed: "侍从逆位：情感不成熟，幻想过度，缺乏创意"
        },
        12: {
            upright: "骑士：富有魅力，浪漫多情，追求理想，艺术气质",
            reversed: "骑士逆位：情感欺骗，虚伪，不切实际的幻想"
        },
        13: {
            upright: "皇后：富有同情心，温柔体贴，情感丰富，直觉敏锐",
            reversed: "皇后逆位：情感操控，过度敏感，情绪不稳定"
        },
        14: {
            upright: "国王：情感成熟，富有同理心，艺术才能，智慧长者",
            reversed: "国王逆位：情感冷漠，操控欲强，缺乏同理心"
        }
    };
    return isReversed ? meanings[num]?.reversed : meanings[num]?.upright || meanings[num];
}

function getSwordsMeaning(num, isReversed = false) {
    const meanings = {
        1: {
            upright: "清晰，真理，突破",
            reversed: "混乱，虚假，停滞"
        },
        2: {
            upright: "平衡，决策，和平",
            reversed: "不平衡，优柔寡断，内心冲突"
        },
        3: {
            upright: "心痛，分离，困难",
            reversed: "恢复，化解，走出困境"
        },
        4: {
            upright: "休息，恢复，冥想",
            reversed: "焦虑，无法休息，内心不安"
        },
        5: {
            upright: "失败，损失，冲突",
            reversed: "克服困难，重获信心，化解冲突"
        },
        6: {
            upright: "转变，旅程，改变",
            reversed: "停滞不前，拒绝改变，无法突破"
        },
        7: {
            upright: "策略，计划，谨慎",
            reversed: "计划失败，策略不当，过度谨慎"
        },
        8: {
            upright: "困境，限制，障碍",
            reversed: "突破限制，摆脱束缚，走出困境"
        },
        9: {
            upright: "担忧，焦虑，恐惧",
            reversed: "克服恐惧，走出阴霾，重获平静"
        },
        10: {
            upright: "结束，痛苦，释放",
            reversed: "持续痛苦，无法释放，拒绝结束"
        },
        11: {
            upright: "侍从：敏锐的观察者，新的想法，求知欲强，聪明伶俐",
            reversed: "侍从逆位：轻率，缺乏判断力，言语伤人"
        },
        12: {
            upright: "骑士：勇敢果断，智慧机敏，追求真理，正义感强",
            reversed: "骑士逆位：好斗，傲慢，鲁莽行事，缺乏策略"
        },
        13: {
            upright: "皇后：独立自主，思维敏锐，判断力强，智慧清晰",
            reversed: "皇后逆位：刻薄尖酸，过度批评，思维混乱"
        },
        14: {
            upright: "国王：理性智慧，公正无私，决策果断，领导才能",
            reversed: "国王逆位：暴君，残酷无情，滥用权力，独断专行"
        }
    };
    return isReversed ? meanings[num]?.reversed : meanings[num]?.upright || meanings[num];
}

function getPentsMeaning(num, isReversed = false) {
    const meanings = {
        1: {
            upright: "机会，繁荣，物质",
            reversed: "错失机会，物质损失，贪婪"
        },
        2: {
            upright: "平衡，适应，变化",
            reversed: "失衡，固执，抗拒变化"
        },
        3: {
            upright: "技能，团队，学习",
            reversed: "学习困难，团队矛盾，技能不足"
        },
        4: {
            upright: "安全，保守，控制",
            reversed: "过度控制，冒险，不安全感"
        },
        5: {
            upright: "困难，贫困，担忧",
            reversed: "改善，转机，走出困境"
        },
        6: {
            upright: "给予，接受，分享",
            reversed: "吝啬，自私，不懂分享"
        },
        7: {
            upright: "耐心，投资，等待",
            reversed: "错误投资，急躁，机会流失"
        },
        8: {
            upright: "技能，专注，进步",
            reversed: "缺乏专注，技能停滞，进步缓慢"
        },
        9: {
            upright: "独立，享受，满足",
            reversed: "依赖，不满足，奢侈浪费"
        },
        10: {
            upright: "财富，家庭，传统",
            reversed: "家庭问题，财务损失，背离传统"
        },
        11: {
            upright: "侍从：务实的学习者，新的机会，认真负责，精益求精",
            reversed: "侍从逆位：懒惰，缺乏规划，错失机会"
        },
        12: {
            upright: "骑士：勤奋可靠，脚踏实地，追求实际，责任心强",
            reversed: "骑士逆位：懒散，缺乏毅力，半途而废"
        },
        13: {
            upright: "皇后：富足丰盛，实用主义，经商才能，慷慨大方",
            reversed: "皇后逆位：物质主义，吝啬，奢侈浪费"
        },
        14: {
            upright: "国王：财富管理，商业头脑，稳重可靠，实践智慧",
            reversed: "国王逆位：贪婪，物质主义，固执己见，滥用权力"
        }
    };
    return isReversed ? meanings[num]?.reversed : meanings[num]?.upright || meanings[num];
}

// DOM元素
const singleModeBtn = document.getElementById('singleMode');
const tripleModeBtn = document.getElementById('tripleMode');
const cardsContainer = document.getElementById('cardsContainer');
const cardsInfo = document.querySelector('.cards-info');
const rerollButton = document.getElementById('rerollButton');

// 状态变量
let isTripleMode = false;
let drawnCards = [];

// 创建卡片HTML
function createCardHTML(index) {
    return `
        <div class="card-area">
            <div class="card" id="tarotCard${index}">
                <div class="card-back">
                    <img src="images/card-back.jpg" alt="塔罗牌背面">
                </div>
                <div class="card-front hidden">
                    <img src="" alt="塔罗牌正面">
                </div>
            </div>
        </div>
    `;
}

// 创建卡片信息HTML
function createCardInfoHTML(index) {
    return `
        <div class="card-info hidden" id="cardInfo${index}">
            <h2 class="cardName"></h2>
            <p class="cardMeaning"></p>
        </div>
    `;
}

// 抽取卡牌
function drawCard(index) {
    if (drawnCards[index-1] !== null && !isTripleMode) {
        // 单张模式下允许翻回
        const cardElement = document.getElementById(`tarotCard${index}`);
        const cardInfo = document.getElementById(`cardInfo${index}`);
        
        cardElement.classList.remove('flipped');
        setTimeout(() => {
            cardElement.querySelector('.card-front').classList.add('hidden');
            cardInfo.classList.add('hidden');
            cardElement.querySelector('.card-front img').style.transform = 'rotate(0deg)';
            drawnCards[index-1] = null;
            checkAllCardsDrawn();
        }, 300);
        return;
    } else if (drawnCards[index-1] !== null && isTripleMode) {
        // 三张模式下不允许翻回
        return;
    }
    
    const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const isReversed = Math.random() < 0.5;
    
    const cardElement = document.getElementById(`tarotCard${index}`);
    const frontImage = cardElement.querySelector('.card-front img');
    const cardInfo = document.getElementById(`cardInfo${index}`);
    
    frontImage.src = card.image;
    frontImage.style.transform = isReversed ? 'rotate(180deg)' : 'rotate(0deg)';
    
    cardElement.classList.add('flipped');
    setTimeout(() => {
        cardElement.querySelector('.card-front').classList.remove('hidden');
        cardInfo.classList.remove('hidden');
    }, 300);
    
    cardInfo.querySelector('.cardName').textContent = card.name + (isReversed ? '（逆位）' : '');
    cardInfo.querySelector('.cardMeaning').textContent = isReversed ? card.reversedMeaning : card.meaning;
    
    drawnCards[index-1] = { card, isReversed };
    
    checkAllCardsDrawn();
}

// 检查是否所有卡牌都已翻开
function checkAllCardsDrawn() {
    if (isTripleMode) {
        const allDrawn = drawnCards.every(card => card !== null);
        rerollButton.classList.toggle('hidden', !allDrawn);
    } else {
        rerollButton.classList.add('hidden');
    }
}

// 重置所有卡牌
function rerollCards() {
    const cardCount = isTripleMode ? 3 : 1;
    for (let i = 1; i <= cardCount; i++) {
        const cardElement = document.getElementById(`tarotCard${i}`);
        const cardInfo = document.getElementById(`cardInfo${i}`);
        
        cardElement.classList.remove('flipped');
        setTimeout(() => {
            cardElement.querySelector('.card-front').classList.add('hidden');
            cardInfo.classList.add('hidden');
            cardElement.querySelector('.card-front img').style.transform = 'rotate(0deg)';
        }, 300);
    }
    drawnCards = new Array(cardCount).fill(null);
    rerollButton.classList.add('hidden');
}

// 更新界面
function updateInterface() {
    // 清空容器
    cardsContainer.innerHTML = '';
    cardsInfo.innerHTML = '';
    
    // 生成卡片
    const cardCount = isTripleMode ? 3 : 1;
    for (let i = 1; i <= cardCount; i++) {
        cardsContainer.innerHTML += createCardHTML(i);
        cardsInfo.innerHTML += createCardInfoHTML(i);
    }
    
    // 重新添加事件监听
    for (let i = 1; i <= cardCount; i++) {
        document.getElementById(`tarotCard${i}`).addEventListener('click', () => drawCard(i));
    }
    
    // 重置抽牌状态
    drawnCards = new Array(cardCount).fill(null);
    rerollButton.classList.add('hidden');
}

// 模式切换
function switchMode(isTriple) {
    isTripleMode = isTriple;
    singleModeBtn.classList.toggle('active', !isTriple);
    tripleModeBtn.classList.toggle('active', isTriple);
    document.querySelector('.container').classList.toggle('mode-triple', isTriple);
    updateInterface();
}

// 事件监听
singleModeBtn.addEventListener('click', () => switchMode(false));
tripleModeBtn.addEventListener('click', () => switchMode(true));
rerollButton.addEventListener('click', rerollCards);

// 初始化
switchMode(false); 