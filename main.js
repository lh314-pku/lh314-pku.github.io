// 全局变量，存储课程和章节信息
let courses = [
    { name: "课程1", path: "notes/course1.md", chapters: ["chapter1.md", "chapter2.md"] },
    { name: "课程2", path: "notes/course2.md", chapters: ["chapter1.md", "chapter2.md"] }
];

// 加载主页
function loadHome() {
    loadMarkdown('README.md');
    document.getElementById('sidebar').classList.remove('hidden');
    renderCourseList();
}

// 加载课程或章节
function loadCourse(course) {
    loadMarkdown(course.path);
    document.getElementById('sidebar').classList.remove('hidden');
    renderChapterList(course);
}

// 加载Markdown文件并渲染到主内容区域
function loadMarkdown(filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const markdownContent = document.getElementById('markdown-content');
            markdownContent.innerHTML = marked(data);
        });
}

// 渲染课程列表
function renderCourseList() {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';
    courses.forEach(course => {
        const listItem = document.createElement('li');
        const link = document.createElement('button');
        link.textContent = course.name;
        link.onclick = () => loadCourse(course);
        listItem.appendChild(link);
        courseList.appendChild(listItem);
    });
}

// 渲染章节列表
function renderChapterList(course) {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';
    const homeButton = document.createElement('button');
    homeButton.textContent = '返回主页';
    homeButton.onclick = loadHome;
    courseList.appendChild(homeButton);

    course.chapters.forEach(chapter => {
        const listItem = document.createElement('li');
        const link = document.createElement('button');
        link.textContent = chapter;
        link.onclick = () => loadMarkdown(`notes/${chapter}`);
        listItem.appendChild(link);
        courseList.appendChild(listItem);
    });
}

// 切换侧边栏显示
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
}

// 初始化页面
window.onload = () => {
    loadHome();
};
