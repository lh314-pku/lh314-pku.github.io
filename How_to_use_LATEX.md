## 关于如何在不使用css和html文件的情况下，让GitHub Pages渲染Markdown时接受Latex公式：

### Step1：\_config.yml

添加：

```yaml
# 使用 kramdown 引擎
markdown: kramdown
kramdown:
  math_engine: mathjax
  syntax_highlighter: rouge
  # 关键设置：禁用单词内下划线转义
  no_intra_emphasis: true
```

### Step2：[filename].md

在文件前添加`html`块：

```htm
<head>
   <script>
  MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']]
    }
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" async></script>
</head>
```

### Step3：在编写代码（块）时，在`_`前加`\`。

目的是防止`_..._`在`html`中被识别为`<em></em>`。
