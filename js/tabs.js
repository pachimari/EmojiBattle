// 页签管理类
export class TabManager {
    constructor() {
        this.setupTabs();
    }

    // 设置页签切换功能
    setupTabs() {
        document.querySelectorAll('.stats-tabs').forEach(tabGroup => {
            const buttons = tabGroup.querySelectorAll('.tab-btn');
            const contents = tabGroup.parentElement.querySelectorAll('.tab-content');

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetTab = button.getAttribute('data-tab');

                    // 更新按钮状态
                    buttons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    // 更新内容显示
                    contents.forEach(content => {
                        if (content.getAttribute('data-tab') === targetTab) {
                            content.classList.add('active');
                        } else {
                            content.classList.remove('active');
                        }
                    });
                });
            });
        });
    }
} 