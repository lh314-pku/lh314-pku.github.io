// main.js

// 假设我们有这样的课程结构
const courses = {
  "课程 1": {
    "章节 1.1": "notes/IntroOfAI_2025Spring/Chapter1.md",
    "章节 1.2": "notes/course1/chapter2.md",
  },
  "课程 2": {
    "章节 2.1": "notes/course2/chapter1.md",
    "章节 2.2": "notes/course2/chapter2.md",
  },
};

// 获取 DOM 元素
const courseList = document.getElementById("course-list");
const markdownContent = document.getElementById("markdown-content");

// 根据课程结构生成左侧栏动态内容
function generateCourseList() {
  // 添加一个 "回到主页" 功能到课程目录顶部
  const homeDiv = document.createElement("div");
  homeDiv.className = "course";
  homeDiv.textContent = "主页";
  homeDiv.style.cursor = "pointer"; // 鼠标指针样式
  homeDiv.style.fontWeight = "bold"; // 突出显示
  // 点击 "主页" 显示 README.md
  homeDiv.onclick = () => {
    loadMarkdown("README.md");
  };
  courseList.appendChild(homeDiv); // 添加到课程列表
  
  for (const courseName in courses) {
    const courseDiv = document.createElement("div");
    courseDiv.className = "course";
    courseDiv.textContent = courseName;

    // 创建章节列表
    const chapterList = document.createElement("div");
    chapterList.style.marginLeft = "10px";

    for (const chapterName in courses[courseName]) {
      const chapterDiv = document.createElement("div");
      chapterDiv.className = "chapter";
      chapterDiv.textContent = chapterName;

      // 为章节添加点击事件
      chapterDiv.onclick = () => {
        const markdownPath = courses[courseName][chapterName];
        loadMarkdown(markdownPath);
      };

      chapterList.appendChild(chapterDiv);
    }

    courseDiv.appendChild(chapterList);
    courseList.appendChild(courseDiv);
  }
}

// 加载 Markdown 文件并显示
function loadMarkdown(path) {
  fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Markdown 文件加载失败");
      }
      return response.text();
    })
    .then((markdown) => {
      markdownContent.innerHTML = marked(markdown);
    })
    .catch((error) => {
      markdownContent.innerHTML = `<p style="color: red;">加载 Markdown 文件失败: ${error.message}</p>`;
    });
}
// 初始化页面时，加载 README.md 并显示
function loadInitialContent() {
  loadMarkdown("README.md"); // 假设 README.md 位于项目根目录
}
// 初始化页面
generateCourseList();
loadInitialContent();
