document.addEventListener('DOMContentLoaded', () => {
    // 主题切换
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.textContent = document.body.classList.contains('dark-theme') ? 
            '切换浅色模式' : '切换深色模式';
    });

    // 移动端侧边栏切换
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }

    // 获取课程名称参数
    const params = new URLSearchParams(window.location.search);
    const courseName = params.get('course') || '课程未选择';
    
    // 设置课程标题
    document.getElementById('course-title').textContent = courseName;
    
    // 模拟API获取章节列表（实际需从服务器获取）
    setTimeout(() => {
        loadCourseContent(courseName);
    }, 300);
});

async function loadCourseContent(courseName) {
    try {
        // 模拟获取章节列表（实际应用中需通过服务器API获取）
        const chapters = [
            { title: "课程主页", fileName: "课程主页.md" },
            { title: "第一章：基础知识", fileName: "chapter1.md" },
            { title: "第二章：核心概念", fileName: "chapter2.md" },
            { title: "第三章：高级主题", fileName: "chapter3.md" },
            { title: "第四章：项目实战", fileName: "chapter4.md" },
            { title: "第五章：补充资料", fileName: "chapter5.md" }
        ];
        
        // 渲染章节列表
        const chaptersList = document.getElementById('chapters-list');
        chaptersList.innerHTML = '';
        
        chapters.forEach((chapter, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a href="#" class="chapter-link" data-file="${chapter.fileName}">
                    ${chapter.title}
                </a>
            `;
            if (index === 0) {
                listItem.querySelector('.chapter-link').classList.add('active');
            }
            chaptersList.appendChild(listItem);
        });
        
        // 加载默认章节（课程主页）
        await loadNoteContent(courseName, chapters[0].fileName);
        
        // 添加章节点击事件
        document.querySelectorAll('.chapter-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 更新激活状态
                document.querySelectorAll('.chapter-link').forEach(el => {
                    el.classList.remove('active');
                });
                link.classList.add('active');
                
                // 加载内容
                loadNoteContent(courseName, link.dataset.file);
                
                // 移动端点击后收起侧边栏
                if (window.innerWidth < 768) {
                    sidebar.classList.add('hidden');
                }
            });
        });
    } catch (error) {
        console.error('加载课程内容失败:', error);
        document.getElementById('note-content').innerHTML = `
            <div class="error">
                <h2>加载失败</h2>
                <p>无法加载课程内容: ${error.message}</p>
                <a href="index.html">返回首页</a>
            </div>
        `;
    }
}

async function loadNoteContent(courseName, fileName) {
    const contentDiv = document.getElementById('note-content');
    contentDiv.classList.remove('fade-in');
    contentDiv.innerHTML = '<div class="loading">加载中...</div>';
    
    try {
        // 实际应用中应通过服务器API获取笔记文件内容
        // 这里提供示例数据代替实际文件读取
        const fakeContent = {
            "课程主页.md": `# ${courseName}

欢迎学习${courseName}！这是本课程的主页。

## 课程介绍
本课程将深入探讨相关主题的知识和技能。

## 主要内容
- 基础知识
- 核心概念
- 项目实践
- 常见问题

## 学习资源
1. 推荐阅读：《专业书籍》
2. 在线教程：[链接](https://example.com)
3. 视频课程：[链接](https://example.com)

> 温馨提示：合理规划学习时间，每天进步一点点！
`,
            "chapter1.md": `# 第一章：基础知识

## 什么是Markdown？
Markdown是一种轻量级标记语言，用于格式化纯文本。

## 基本语法
1. **标题**：使用 # 号
2. *斜体*：使用一个 * 或 _
3. **粗体**：使用两个 * 或 _
4. 列表：使用 - 或 * 
5. 链接：[文字](链接)
6. 图片：![描述](图片链接)

\`\`\`js
// 代码块示例
const message = 'Hello Markdown!';
console.log(message);
\`\`\`
`,
            "chapter2.md": `# 第二章：核心概念

## 响应式设计
响应式网页设计让你的应用在各种设备上都能良好显示。

### CSS媒体查询
\`\`\`css
@media (max-width: 768px) {
    .sidebar {
        width: 100%;
    }
}
\`\`\`

## Flexbox布局
Flexbox是一种高效的布局方式。

### 示例：
\`\`\`html
<div class="container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
</div>
\`\`\`

\`\`\`css
.container {
    display: flex;
    justify-content: space-between;
}
\`\`\`
`,
            "chapter3.md": `# 第三章：高级主题`,
            "chapter4.md": `# 第四章：项目实战`,
            "chapter5.md": `# 第五章：补充资料`
        };
        
        // 模拟延迟加载
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 获取笔记内容
        if (fakeContent[fileName]) {
            contentDiv.innerHTML = `
                <div class="markdown-body fade-in">
                    ${marked.parse(fakeContent[fileName])}
                </div>
            `;
        } else {
            throw new Error(`找不到笔记文件: ${fileName}`);
        }
    } catch (error) {
        console.error('加载笔记内容失败:', error);
        contentDiv.innerHTML = `
            <div class="error fade-in">
                <h2>加载失败</h2>
                <p>无法加载笔记内容: ${error.message}</p>
            </div>
        `;
    }
}
