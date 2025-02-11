// 获取DOM元素
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startSimulation');
const resultText = document.getElementById('resultText');

// 设置canvas尺寸
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// 初始化
function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 绑定开始模拟按钮事件
    startButton.addEventListener('click', startSimulation);
    
    // 初始绘制
    drawInitialState();
}

// 绘制初始状态
function drawInitialState() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#666';
    ctx.font = '20px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.fillText('点击"开始模拟"按钮开始测试', canvas.width/2, canvas.height/2);
}

// 开始模拟
function startSimulation() {
    const param1 = parseFloat(document.getElementById('param1').value);
    const param2 = parseFloat(document.getElementById('param2').value);
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 这里添加您的模拟逻辑
    // 示例：绘制简单的数值对比图
    drawComparison(param1, param2);
    
    // 更新结果文本
    updateResults(param1, param2);
}

// 绘制对比图表
function drawComparison(param1, param2) {
    const maxHeight = canvas.height - 40;
    const barWidth = 60;
    const spacing = 40;
    
    // 绘制第一个参数柱状图
    ctx.fillStyle = '#007bff';
    const height1 = (param1 / Math.max(param1, param2)) * maxHeight;
    const x1 = canvas.width/2 - barWidth - spacing;
    ctx.fillRect(x1, canvas.height - height1, barWidth, height1);
    
    // 绘制第二个参数柱状图
    ctx.fillStyle = '#28a745';
    const height2 = (param2 / Math.max(param1, param2)) * maxHeight;
    const x2 = canvas.width/2 + spacing;
    ctx.fillRect(x2, canvas.height - height2, barWidth, height2);
    
    // 添加标签
    ctx.fillStyle = '#333';
    ctx.font = '14px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.fillText(param1, x1 + barWidth/2, canvas.height - height1 - 10);
    ctx.fillText(param2, x2 + barWidth/2, canvas.height - height2 - 10);
    ctx.fillText('参数1', x1 + barWidth/2, canvas.height - 5);
    ctx.fillText('参数2', x2 + barWidth/2, canvas.height - 5);
}

// 更新结果文本
function updateResults(param1, param2) {
    const ratio = (param1 / param2).toFixed(2);
    resultText.innerHTML = `
        <h3>模拟结果分析</h3>
        <p>参数1: ${param1}</p>
        <p>参数2: ${param2}</p>
        <p>比值: ${ratio}</p>
        <p>分析: ${analyzeResults(param1, param2)}</p>
    `;
}

// 分析结果
function analyzeResults(param1, param2) {
    if (param1 > param2) {
        return `参数1比参数2高${((param1/param2 - 1) * 100).toFixed(1)}%`;
    } else if (param1 < param2) {
        return `参数1比参数2低${((1 - param1/param2) * 100).toFixed(1)}%`;
    } else {
        return '两个参数相等';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 