// UI管理类
export class UI {
    constructor() {
        this.setupEventListeners();
    }

    // 设置事件监听
    setupEventListeners() {
        // 监听属性输入变化
        document.querySelectorAll('.stat-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const playerId = e.target.closest('.player').classList.contains('player-1') ? 1 : 2;
                const statName = e.target.getAttribute('data-stat');
                const value = parseInt(e.target.value);
                
                // 触发自定义事件
                const event = new CustomEvent('stat-change', {
                    detail: { playerId, statName, value }
                });
                document.dispatchEvent(event);
            });
        });
    }

    // 更新头像选择器
    setupAvatarSelector(playerId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);

        // 点击头像框时触发文件选择
        const avatarFrame = document.querySelector(`.player-${playerId} .avatar-frame`);
        if (avatarFrame) {
            avatarFrame.style.cursor = 'pointer';
            avatarFrame.addEventListener('click', () => input.click());
        }

        // 处理文件选择
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // 触发自定义事件
                    const event = new CustomEvent('avatar-change', {
                        detail: { playerId, imageUrl: e.target.result }
                    });
                    document.dispatchEvent(event);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 显示消息
    showMessage(message, type = 'info') {
        // 创建消息元素
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // 添加到页面
        document.body.appendChild(messageDiv);
        
        // 3秒后移除
        setTimeout(() => messageDiv.remove(), 3000);
    }

    // 禁用/启用输入
    toggleInputs(disabled) {
        document.querySelectorAll('.stat-input').forEach(input => {
            input.disabled = disabled;
        });
    }
} 