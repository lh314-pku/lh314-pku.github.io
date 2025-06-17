<a id="TOP">目录</a> 

该部分是考试内容中提到的会考到的库：[BeautifulSoup](#BS)、[Pandas](#P)。

# <a id="BS">BeautifulSoup</a>

先说一嘴：`requests`、`selenium`、`pyppeteer`库均是用来“获取”网页的，而`BeautifulSoup`则是用来“分析”网页的。

另外考试会提供讲义文档参考函数，不必担心。（安心だす~）

首先，html 文档中有所谓 tag，例如该文档中用于快捷跳转我使用的`<a id="BS"> BeautifulSoup </a>`，就可以通过访问这个 tag 的`id`属性跳转。

一个完整的 tag 包括：名字（name）、属性（attr）、正文（text）。

tag 之间也可以嵌套。

```html
<div id="siteHeader" class="wrapper">
    <h1 class="logo">
        <a href="http://openjudge.cn/" title="OpenJudge首页" rel="home">
            OpenJudge<span>开放的在线程序评测平台</span>
        </a>
    </h1>
    <div id="topsearch">
        <ul id="userMenu">
            <li class="first"><a href="http://openjudge.cn/">首页</a></li>
            <li><a href="http://openjudge.cn/groups">小组</a></li>
            <li><a href="http://openjudge.cn/register">注册</a></li>
            <li><a href="http://openjudge.cn/auth/login/">登录</a></li>
        </ul>
    </div>
</div>
```

使用方法（同案例）：

- 将 html 文档装入一个 BeautifulSoup 对象 X

- 使用`find`、`find_all`等函数寻找tag

- tag 对象的 text 就是该对象里的正文（text），tag 对象也可以看作是一个字典，里面包含各种属性（attr）及其值。

安装：`pip install beautifulsoup4`

导入：`from bs4 import BeautifulSoup`or`import bs4`

创建`BeautifulSoup`对象并指定解析器：

```python
import requests        # 拿requests做个示范
from bs4 import BeautifulSoup

response = requests.get(url)
# 确保请求成功
if response.status_code == 200:
    html_content = response.text
else:
    print(f"Failed to fetch page: {response.status_code}")

soup = BeautifulSoup(html_content, 'html.parser')# 或者使用外部的 ‘lxml’
```

可以使用`find`、`find_all`、`select`查找元素：

`find`用来查找单个元素：

```python
first_div = soup.find('div')  # 查找第一个 <div> 标签
first_div_with_class = soup.find('div', class_='example')  # 查找特定类名的 <div>
```

`find_all`用来查找全体满足条件的元素：

```python
all_links = soup.find_all('a')  # 查找所有 <a> 标签
specific_links = soup.find_all('a', href=True)  # 查找所有带 href 属性的 <a> 标签
```

也可以使用 `select()` 方法通过 CSS 选择器查找元素

```python
elements = soup.select('div.example > a')
# CSS 选择器语法：查找 class 为 example 的 <div> 下的所有 <a>
# 甚至可以非常复杂
selector = f'#app > div > div > div.zsquote3l.zs_brief > div.quote3l_c > div > table > tbody > tr'
trs = soup.select(selector)
```

获取属性或文本内容：获取到的元素更加类似于字典的结构，可以通过`Tag['attribute']`或`dict = Tag.attrs`的结构获取元素；同样的，可以通过`Tag.get_text()`或`Tag.text`获取文本内容，`Tag.name`可以获取标签名称。

需要注意：`select()`和`find_ all()`均返回一个`bs4.element.Tag`对象的列表。

剩下一大堆函数考试应该会提供。

下面补充获取 html 文档的方法（考试大概率会直接提供 HTML 文档）：

直接读入（大概率）：

```python
with open("example.html", "r", encoding="utf-8") as file:
    html_content = file.read()  # 读取文件内容为字符串
# 使用 BeautifulSoup 解析 HTML 文档
soup = BeautifulSoup(html_content, "html.parser")
# 如果是长字符串直接读就行
```

`requests`：

```python
import requests

response = requests.get(url) # 确保请求成功
if response.status_code == 200:
    html_content = response.text
else:
    print(f"Failed to fetch page: {response.status_code}")

soup = BeautifulSoup(html_content, 'html.parser')# 或者使用外部的 ‘lxml’
```

`selenium`：

```python
def getHtml(url):    # 暂时适用于百度图片搜索
    from selenium import webdriver  # 需要 pip install selenium
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    options = Options()  # 浏览器选项
    # 等价于 options = webdriver.chrome.options.Options()
    options.add_argument('--headless')    # 规定 chrome 浏览器隐身模式运行
    options.add_argument('--disable-gpu') # 禁止 chrome 使用 gpu 加速，能快点
    service = Service(executable_path='./chromedriver')
    driver = webdriver.Chrome(service=service, options=options)
    #driver 就是个 chrome 浏览器 需要下载安装 chrome 驱动器 chromedriver.exe
    driver.get(url)    # 浏览器装入网页
    html = driver.page_source       # 网页源代码
    driver.close()      # 关闭浏览器
    driver.quit()       # 退出
    return html         # 返回字符串
```

`pyppeteer`：

```python
def getHtmlByPyppeteer(url):
    import asyncio
    import pyppeteer as pyp
    async def asGetHtml(url):
        browser = await pyp.launch(headless=False)
        page = await browser.newPage()
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 6.1; Win64; \
            x64) AppleWebKit/537.36 (KHTML, like Gecko) \
            Chrome/78.0.3904.70 Safari/537.36')
        await page.evaluateOnNewDocument('\
            ()=>{ Object.defineProperties(navigator, \
            { webdriver:{ get: () => false } }) }')
        await page.goto(url)
        text = await page.content()
        await browser.close()
        return text
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    return loop.run_until_complete(asGetHtml(url))
    # 返回值就是 asGetHtml(url) 的返回值
```

综上所述：爬虫应该不会是考试重点，但是一定会考。结合参考讲义，可以灵活运用。

~~这byd函数这么多不给个文档怎么好意思，我觉得前面的Python基础也应该提供函数参考~~

[BACK](#TOP)

# <a id="P">Pandas</a>

#### DataFrame的构造、访问、切片、分析统计和修改增删

#### 读写excel和csv文件

[BACK](#TOP)
