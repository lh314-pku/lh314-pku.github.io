const canvas = document.querySelector("#memeCanvas");
const ctx = canvas.getContext("2d");
const textInput = document.querySelector("#memeText");
const fontSizeInput = document.querySelector("#fontSize");
const colorInput = document.querySelector("#textColor");
const clearButton = document.querySelector("#clearButton");
const downloadButton = document.querySelector("#downloadButton");

const image = new Image();
image.src = "meme-8.png";

const bubble = {
  x: 54,
  y: 76,
  width: 252,
  height: 110
};

const defaultText = "我宣布：今天也要快乐摸鱼";

function splitByGrapheme(text) {
  if ("Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("zh-CN", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), item => item.segment);
  }

  return Array.from(text);
}

function wrapText(text, maxWidth) {
  const paragraphs = text.trim().split(/\n+/);
  const lines = [];

  for (const paragraph of paragraphs) {
    let line = "";
    const units = splitByGrapheme(paragraph);

    for (const unit of units) {
      const testLine = line + unit;
      if (line && ctx.measureText(testLine).width > maxWidth) {
        lines.push(line);
        line = unit;
      } else {
        line = testLine;
      }
    }

    if (line) {
      lines.push(line);
    }
  }

  return lines;
}

function fitText(text, requestedSize) {
  let size = requestedSize;
  let lines = [];
  let lineHeight = 0;

  while (size >= 18) {
    ctx.font = `700 ${size}px "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif`;
    lineHeight = Math.round(size * 1.18);
    lines = wrapText(text, bubble.width);

    if (lines.length * lineHeight <= bubble.height) {
      break;
    }

    size -= 2;
  }

  return { size, lines, lineHeight };
}

function drawMeme() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const text = textInput.value.trim();
  if (!text) {
    return;
  }

  const requestedSize = Number(fontSizeInput.value);
  const { size, lines, lineHeight } = fitText(text, requestedSize);
  const totalHeight = lines.length * lineHeight;
  const startY = bubble.y + (bubble.height - totalHeight) / 2 + size * 0.86;

  ctx.font = `700 ${size}px "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif`;
  ctx.fillStyle = colorInput.value;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, bubble.x + bubble.width / 2, startY + index * lineHeight);
  });
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "meme-with-text.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

image.addEventListener("load", drawMeme);
textInput.addEventListener("input", drawMeme);
fontSizeInput.addEventListener("input", drawMeme);
colorInput.addEventListener("input", drawMeme);
downloadButton.addEventListener("click", downloadImage);
clearButton.addEventListener("click", () => {
  textInput.value = "";
  drawMeme();
  textInput.focus();
});

textInput.value = defaultText;
