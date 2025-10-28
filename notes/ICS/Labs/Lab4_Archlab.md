# ArchLab

*PKU，2025Fall，ICS，ArchLab*

> ⚠️ 致各位同学：
> 
> **本笔记的目的是借鉴交流，而非仅仅提供答案，请勿抄袭，后果自负。**
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

## Part A（5 * 3 = 15 pts）

在`archlab-project/misc`目录下工作，编写三个 Y86-64 程序。

## Part B（4 + 3 * 7 = 25 pts）

在`archlab-project/sim/src/architectures/extra`目录下工作，完成两个阶段任务~~（助教gg太肝了，求求你下次不要更新这么多任务了）~~。

### B.1（4 pts）

在 SEQ 架构下添加 IOPQ 指令，参考 OPQ 和 IRMOVQ 即可。

### B.2（3 * 7 pts）

以 `pipe-s2` 为基础架构，依次实现`pipe-s3a`、`pipe-s3b`、`pipe-s3c`、`pipe-s3d`、`pipe-s4a`、`pipe-s4b`、`pipe-s4c`多个层级的流水线架构，实现数据转发、暂停Stall、气泡Bubble 的逻辑实现（load-use冒险、数据冒险、跳转预测错误等），并优化其架构。

有一说一，做起来真的很痛苦。网络上没有答案，AI 也得不到正确的答案，每天啃书、调试、做笔记……最后一个人做完整个Lab。但是有一说一，现在确实对流水线的原理理解更加深入了。

## Part C（60 pts）

工作目录就是前两个任务的文件夹：`archlab-project/misc`和`archlab-project/sim/src/architectures/extra`。

你需要操作并提交的文件：

- `archlab-project/misc/ncopy.ys`：函数`ncopy`的 Y86-64 汇编文件；

- `archlab-project/sim/src/architectures/extra/ncopy.rs`：`ncopy`函数运行的 CPU 架构。

`ncopy`函数将`len`个元素整数数组`src`复制到不重叠的`dst`，返回计数
`src`中包含的正整数的数量。`ncopy` 的 C 描述在 `misc/ncopy.c` 中。
