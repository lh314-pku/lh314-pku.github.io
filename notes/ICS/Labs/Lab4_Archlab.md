# ArchLab

*PKU，2025Fall，ICS，ArchLab*

> ⚠️ 致各位同学：
> 
> **本笔记的目的是借鉴交流，而非仅仅提供答案，<font color='red'>请勿抄袭，后果自负。</font>**
> 
> 你可以参考我的想法、了解有哪些注意的地方，但是在自己实现的时候不要参考，避免抄袭。

ArchLab主要参考了《CS:APP》第三版第4章的内容，包含三个部分：

- **Part A**：编写简单的 Y86-64 程序并熟悉 Y86-64 工具；

- **Part B**：扩展 SEQ 模拟器以支持新指令，并探索 CPU 流水线架构；

- **Part C**：结合part A 和 part B，优化 Y86-64 基准框架及其架构设计。

## 环境配置&构建项目

由于该Lab使用 `Rust` 语言编写，所以我们还需要在 Linux 环境下安装 `Rust` 的运行环境：`rustup`。（请在安装前确保通过`clabcli connect`连接到网关）

可以通过运行以下指令安装`rustup`：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

然后运行以下指令，将`$HOME/.cargo/env`文件加载到当前shell环境，用来将 Rust 和 Cargo 工具链路径添加到系统`PATH`中。

```bash
source $HOME/.cargo/env
```

最后运行：

```bash
rustup install 1.90
rustup default 1.90
```

完成安装（完成本文时最新稳定版本为 1.90）。

之后进入`archlab-project`文件夹：

```bash
cd archlab-project
```

并重新构建项目：

```bash
cargo build
```

完成构建项目后，会有一个`archlab-project/target`的文件夹，用来存放二进制文件和中间文件。在文件夹`archlab-project/target/debug/`中，有可执行文件：

- `target/debug/yas`：汇编器

- `target/debug/ydb`：调试器

- `target/debug/yis`：指令集模拟器

- `target/debug/ysim`：流水线模拟器

- `target/debug/garder`：本地评分器

release版本同样可以使用，运行`cargo build --release`可以在`target/release/`文件夹下发现上述同名文件，其性能经过了编译器优化。

具体使用方法见`archlab-project/README.md`。

（或者阅读中文版[README](https://lh314-pku.github.io/notes/ICS/Labs/Lab4_README)）

最后可以分别运行一下三个指令对三个阶段评分：

```bash
./target/debug/grader part-a
```

```bash
./target/debug/grader part-b
```

```bash
./target/debug/grader part-c
```

以及最后你可以运行以下指令来为整个项目评分：

```bash
./target/debug/grader autolab
```

## Part A（5 * 3 = 15 pts）

在`archlab-project/misc`目录下工作，编写三个 Y86-64 程序。

## Part B（4 + 3 * 7 = 25 pts）

在`archlab-project/sim/src/architectures/extra`目录下工作，完成两个阶段任务~~（助教gg太肝了，求求你下次不要更新这么多任务了）~~。

### B.1（4 pts）

在 SEQ 架构下添加 IOPQ 指令，参考 OPQ 和 IRMOVQ 即可。

### B.2（3 * 7 pts）

以 `pipe-s2` 为基础架构，依次实现`pipe-s3a`、`pipe-s3b`、`pipe-s3c`、`pipe-s3d`、`pipe-s4a`、`pipe-s4b`、`pipe-s4c`多个层级的流水线架构，实现数据转发、暂停Stall、气泡Bubble 的逻辑实现（load-use冒险、数据冒险、跳转预测错误等），并优化其架构。

有一说一，做起来真的很痛苦。网络上没有答案，AI 也得不到正确的答案，每天啃书、调试、做笔记……最后一个人做完整个Lab。但是有一说一，现在确实对流水线的原理理解更加深入了。

另外，做完才发现可以参考`archlab-project/sim/src/architectures/builtin/pipe_std.rs`作为参考（）

## Part C（60 pts）

### 任务

工作目录就是前两个任务的文件夹：`archlab-project/misc`和`archlab-project/sim/src/architectures/extra`。

你需要操作并提交的文件：

- `archlab-project/misc/ncopy.ys`：函数`ncopy`的 Y86-64 汇编文件；

- `archlab-project/sim/src/architectures/extra/ncopy.rs`：`ncopy`函数运行的 CPU 架构。

`ncopy`函数将`len`个元素整数数组`src`复制到不重叠的`dst`，返回计数
`src`中包含的正整数的数量。`ncopy` 的 C 描述在 `misc/ncopy.c` 中。

你的任务就是想尽一切办法，让ncopy函数运行的更快。但是有以下约束：

- 你的 ncopy 函数必须适用于任意数组大小。你可能会想通过简单地编写 64 条复制指令来为 64 元素数组硬编码解决方案，但这会是一个坏主意，因为我们将根据你的解决方案在任意数组上的性能来评分。

- 你的 ncopy 函数必须与 yis 正确运行。我们所说的正确运行是指它必须正确复制 src 块，并通过 (%rax) 返回正确的正整数数量。

- ncopy 组装版本的尺寸加上栈大小限制在 4Kb。（实际上略小于 4Kb，你可以查看评分器代码以获取确切值）我们将在调用你的 ncopy 之前设置好栈寄存器和参数寄存器。

除此之外，如果你认为其他指令会更有帮助，你可以自由地实现它们。你可以对 ncopy 函数进行任何保持语义的转换，例如重新排序指令、用单个指令替换指令组、删除某些指令以及添加其他指令。

### 评分

Part C 的评分将基于实现的 CPE 和 AC 来评估性能。

- CPE：cycles per element，如果代码需要 C 个周期来复制一个包含 N 个元素的块，则 CPE = C / N。

- AC：architecture cost，即ncopy函数和架构的关键路径长度。形式上 CPU 架构的 AC 等于其时钟元件之间组合逻辑的最长长度。本实验中简化为：1 + 架构中路径上排列的最大硬件设备（单元）数量。

由于一些周期用于设置 ncopy 的调用和设置 ncopy 内的循环，你会发现对于不同的块长度，你会得到不同的 cpe 值（通常随着 N 的增加，cpe 会下降）。因此，我们将通过计算从 1 到 64 个元素的范围内的 cpe 的平均值来评估你的函数的性能。

你可以运行以下指令来获得CPE：

```bash
cd archlab-project
cargo run --bin grader -- part-c
```

以及如下指令来来检查架构的关键路径长度和设备执行顺序。此命令还会生成一个可视化架构依赖图的 HTML 文件。（该HTML文件的解读参考树洞6835391）

未优化：

```bash
Part C: all tests passed, cpe: 12.816715740854239, arch cost: 8, score: 0.0000
```

### Test1：引入 IOPQ

```bash
Part C: all tests passed, cpe: 10.278974347279133, arch cost: 8, score: 0.0000
```

难绷删掉`xorq %rax,%rax`还快了一点

```bash
Part C: all tests passed, cpe: 10.20485105190873, arch cost: 8, score: 0.0000
```

### Test2：更换流水线架构

使用`pipe_s4c`架构（cost变少了，但是CPE上升了难绷）：

```bash
Part C: all tests passed, cpe: 12.94744349739257, arch cost: 4, score: 0.0000
```

使用`pipe_s3d`架构：

```bash
Part C: all tests passed, cpe: 11.11320892233585, arch cost: 6, score: 0.0000
```

使用`pipe_s2`架构：

```bash
Part C: all tests passed, cpe: 10.278974347279133, arch cost: 7, score: 0.0000
```

暂时考虑使用pipe_s2。

### Test3：循环展开+三叉树

使用7重循环展开，并用三叉树分治查找处理：

（代码位于test.txt）

```bash
Part C: all tests passed, cpe: 8.285855145597921, arch cost: 4, score: 51.5688
```

由于在`pipe_s4c`下可以得到最小的 AC = 4，想要优化只有两个方向：

- 在`pipe_s4c`基础上加入W寄存器，将 AC 降到3；

- 继续优化程序直到 cpe <= 7。

将ncopy中的rmmovq移动到遍历前：

```bash
cpe: 8.17039042028987, arch cost: 4, score: 53.7626
```

去除一些不必要的跳转：

```bash
cpe: 8.115253726514984, arch cost: 4, score: 54.8102
```

提前一些MOV指令：

```bash
cpe: 8.027731840398008, arch cost: 4, score: 56.4731
```

其他想法：8重展开？跳转表？

在pipe_std架构上，将 reg_cc 和 cond 的计算并行，将 ac 降到 3。

```bash
Part C: all tests passed, cpe: 8.175978431138818, arch cost: 3, score: 60.0000
```
