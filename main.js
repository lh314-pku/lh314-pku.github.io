// 主题切换
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    themeToggle.textContent = document.body.classList.contains('dark-theme') ? 
        '切换浅色模式' : '切换深色模式';
});

// 加载并渲染README.md
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('README.md');
        if (!response.ok) throw new Error('README.md 加载失败');
        
        const markdown = await response.text();
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = marked.parse(markdown);
        
        // 为课程链接添加点击处理
        document.querySelectorAll('a').forEach(link => {
            if (link.href.includes('notes')) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const courseName = this.closest('li').dataset.course;
                    window.location.href = `course.html?course=${encodeURIComponent(courseName)}`;
                });
            }
        });
        
        if (window.location.search) {
            const params = new URLSearchParams(window.location.search);
            const message = params.get('message');
            if (message) {
                alert(message);
            }
        }
    } catch (error) {
        console.error('Error loading README.md', error);
        document.getElementById('content').innerHTML = `
            <div class="error">
                <h2>无法加载内容</h2>
                <p>${error.message}</p>
                <a href="index.html">返回首页</a>
            </div>
        `;
    }
});
