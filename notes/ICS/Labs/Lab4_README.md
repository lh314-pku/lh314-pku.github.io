# y86-pipe-rs: Y86-64 Processor Simulator written in Rust

This document describes the processor simulators that accompany the presentation of the Y86-64 processor architectures in Chapter 4 of _Computer Systems: A Programmer’s Perspective, Third Edition_.

The original (official) simulator, written in C has difficulty adapting to too many modifications on the seq, seq+ and pipe HCL, leading to a limited range of lab assignments. This project aims to provide a more flexible and extensible simulator for the Y86-64 processor, and is employed in Peking U's _ICS: Introduction to Computer System_ in 2024.

本文档描述了第4章《计算机系统：程序员视角（第三版）》中介绍的Y86-64处理器架构所附的处理器模拟器。

原始（官方）模拟器是用C语言编写的，但在seq、seq+和pipe HCL上进行大量修改时适应性较差，导致实验任务范围有限。该项目旨在为Y86-64处理器提供一个更灵活且可扩展的模拟器，并将在2024年北京大学的《计算机系统导论（ICS）》课程中使用。

## Installation

This project is written in Rust, so you'd have your Rust toolchain installed. If you haven't, please execute the following command to install [rustup](https://rustup.rs/):

这个项目由 Rust 编写，所以你需要先安装 Rust 工具链。如果没有，请运行如下命令来安装[rustup](https://rustup.rs/)：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

You can verify the installation by executing the command `rustup`.

Install and the Rust toolchain by executing the following command (by the time of writing, the latest stable version is 1.90):

您可以通过执行命令 `rustup` 来验证安装。

通过执行以下命令安装 Rust 工具链（在撰写本文时，最新的稳定版本是 1.90）：

```bash
rustup install 1.90
rustup default 1.90
```

## Build the Project 构建项目

Simply execute `cargo build` to build all the binaries in the project. After running this command, a folder named `target` will be created to store the output binaries and other intermediate files. The output executables are

只需执行 `cargo build` 即可构建项目中的所有二进制文件。运行此命令后，将创建一个名为 `target` 的文件夹，用于存储输出的二进制文件和其他中间文件。输出的可执行文件是

- `target/debug/yas`: Y86-64 Assembler 汇编器
- `target/debug/yis`: Y86-64 ISA Simulator Y86-64指令集架构模拟器
- `target/debug/ysim`: Y86-64 Pipline Simulator 流水线模拟器
- `target/debug/ydb`: Y86-64 Debugger Server 调试器

To build the release version, execute `cargo build --release`. The release version is optimized for performance. The released version executables locate in the `target/release` folder (`target/release/{yas,yis,ysim,ydb}`).

要构建发布版本，请执行 `cargo build --release`。发布版本经过性能优化。发布版本的可执行文件位于 `target/release` 文件夹中（`target/release/{yas,yis,ysim,ydb}`）。

## Assembler Usage 汇编器使用方法

To assemble a Y86-64 assembly file, execute the following command:

要汇编一个 Y86-64 汇编文件，运行如下命令：

```bash
./target/debug/yas [input_file].ys
```

The default output filename is `[input_file].yo`. You can specify the output filename by adding the `-o` option. For example, given the following y86 assembly file `swap.ys`:

默认的输出文件名是 `[input_file].yo`。您可以通过添加 `-o` 选项来指定输出文件名。例如，给定以下 y86 汇编文件 `swap.ys`：

```asm
# Swap nums if the former one >= the latter one
    .pos 0
    irmovq stack, %rsp

    irmovq nums, %rdi
    mrmovq (%rdi), %rdx
    mrmovq 8(%rdi), %rcx
    rrmovq %rdx, %rbp
    subq %rcx, %rbp # $rbp <= $rcx ?
    # if so, then do not swap
    jle done
    rmmovq %rdx, 8(%rdi)
    rmmovq %rcx, (%rdi)
done:
    halt
    nop
    nop
    nop

    .align 8
nums:
    .quad 0xcba
    .quad 0xbca

    .pos 0x200
stack:
```

By running `./target/debug/yas swap.ys`, the assembler will generate a binary file `swap.yo`:

通过运行`./target/debug/yas swap.ys`，汇编器会生成二进制文件`swap.yo`:

```asm
                             | # Swap nums if the former one >= the latter one
0x0000:                      |     .pos 0
0x0000: 30f40002000000000000 |     irmovq stack, %rsp
                             | 
0x000a: 30f75000000000000000 |     irmovq nums, %rdi
0x0014: 50270000000000000000 |     mrmovq (%rdi), %rdx
0x001e: 50170800000000000000 |     mrmovq 8(%rdi), %rcx
0x0028: 2025                 |     rrmovq %rdx, %rbp
0x002a: 6115                 |     subq %rcx, %rbp # $rbp <= $rcx ?
                             |     # if so, then do not swap
0x002c: 714900000000000000   |     jle done
0x0035: 40270800000000000000 |     rmmovq %rdx, 8(%rdi)
0x003f: 40170000000000000000 |     rmmovq %rcx, (%rdi)
0x0049:                      | done:
0x0049: 00                   |     halt
0x004a: 10                   |     nop
0x004b: 10                   |     nop
0x004c: 10                   |     nop
                             | 
0x0050:                      |     .align 8
0x0050:                      | nums:
0x0050: ba0c000000000000     |     .quad 0xcba
0x0058: ca0b000000000000     |     .quad 0xbca
                             |     
0x0200:                      |     .pos 0x200
0x0200:                      | stack:
                             | 
```

## ISA Simulator Usage ISA模拟器使用方法

To simulate a Y86-64 assembly file w.r.t. the Y86 ISA specification, you can execute the following command:

要模拟符合 Y86 指令集规范的 Y86-64 汇编文件，你可以执行以下命令：

```bash
./target/debug/yis [input_file].yo
```

For example, by running `./target/debug/yis swap.yo`, the simulator will print the following information:

例如，通过运行 `./target/debug/yis swap.yo`，模拟器将打印以下信息：

```
0x0000  icode: 0x3 (IRMOVQ), ifun: 0, rA: RNONE, rB: RSP, V: 0x200
0x000a  icode: 0x3 (IRMOVQ), ifun: 0, rA: RNONE, rB: RDI, V: 0x50
0x0014  icode: 0x5 (MRMOVQ), ifun: 0, rA: RDX, rB: RDI
0x001e  icode: 0x5 (MRMOVQ), ifun: 0, rA: RCX, rB: RDI
0x0028  icode: 0x2 (CMOVX), ifun: 0, rA: RDX, rB: RBP
0x002a  icode: 0x6 (OPQ), ifun: 1, rA: RCX, rB: RBP
0x002c  icode: 0x7 (JX), ifun: 1, V: 0x49
0x0035  icode: 0x4 (RMMOVQ), ifun: 0, rA: RDX, rB: RDI
0x003f  icode: 0x4 (RMMOVQ), ifun: 0, rA: RCX, rB: RDI
0x0049  icode: 0x0 (HALT), ifun: 0

total instructions: 10
ax 0000000000000000 bx 0000000000000000 cx 0000000000000bca dx 0000000000000cba
si 0000000000000000 di 0000000000000050 sp 0000000000000200 bp 00000000000000f0
0x0050: ba0c000000000000 -> ca0b000000000000
0x0058: ca0b000000000000 -> ba0c000000000000
```

## Pipeline Simulator Usage 流水线模拟器使用方法

To simulate a Y86-64 assembly file over the default architecture (`seq_std`), execute the following command:

要在默认架构（`seq_std`）上模拟 Y86-64 汇编文件，执行以下命令：

```bash
./target/debug/ysim [input_file].ys
```

This will print the state of the processor at each cycle to the standard output. If you want to read tht output from start to end, you can pipe a `less` command to the output (To quit `less`, press `q`):

这会将处理器在每个周期的状态打印到标准输出。如果你想从头到尾读取输出，可以将一个 `less` 命令管道到输出（要退出 `less`，按 `q`）：

```bash
./target/debug/ysim [input_file].ys | less
```

To print more information you can use the `-v` option, which will display the value of each signal in each stage of the cycle:

要打印更多信息，您可以使用`-v`选项，它将显示每个阶段中每个信号值：

```bash
./target/debug/ysim [input_file].ys -v
```

We provide different architectures for the simulator. To view available architectures, you can run

我们为模拟器提供了不同架构。想要知道支持的架构，可以运行：

```bash
./target/debug/ysim --help
```

To specify an architecture, you can use the `--arch` option. For example, to run the simulator with the `seq_plus_std` architecture, you can run:

要指定架构，您可以使用 `--arch` 选项。例如，要使用 `seq_plus_std` 架构运行模拟器，您可以运行：

```bash
./target/debug/ysim [input_file].ys --arch seq_plus_std
```

You can also inspect an architecture via `-I` option:

您也可以通过 `-I` 选项检查架构：

```bash
./target/debug/ysim --arch seq_plus_std -I
```

Its output will be like:

输出内容belike：

```
propagate order:
lv.1: pc
lv.2: imem align icode ifun instr_valid mem_read mem_write need_regids need_valC set_cc alufun
lv.3: ialign pc_inc dstM srcA srcB valC valP
lv.4: reg_read aluA mem_data aluB
lv.5: alu valE mem_addr
lv.6: reg_cc dmem cc valM stat prog_term
lv.7: cond cnd dstE
lv.8: reg_write
dependency graph visualization is generated at: seq_plus_std_dependency_graph.html
```

Here an HTML file is generated to visualize the dependency graph of the architecture. You can open the HTML file in a browser to view the dependency graph. In the graph, blue blocks are hardware components, and red blocks are signals. You can drag each block to change its position.

这里生成了一个 HTML 文件来可视化架构的依赖关系图。您可以在浏览器中打开 HTML 文件来查看依赖关系图。在图中，蓝色块代表硬件组件，红色块代表信号。您可以拖动每个块来改变它的位置。

![](assets/visualization-screenshot.png)

## Debugger Usage 调试器使用方法

To provide a friendly coding experience, we develop a debugger server for the Y86 assembly language. This debugger server is used along with the `y86-debugger` VSCode extension.

为了提供友好的编程体验，我们为 Y86 汇编语言开发了一个调试器服务器。该调试器服务器与`y86-debugger` VSCode 扩展一起使用。

First you should install `y86-debugger` extension from `assets/y86-debugger-0.2.0.vsix` (choose "Install from VSIX..."). To install the extension on SSH remote servers, you can first install it on your local machine, then open a remote host VSCode window and choose "Install in SSH:..." to install the extension on the remote server.

首先，您需要从`assets/y86-debugger-0.2.0.vsix`安装`y86-debugger`扩展（选择"从 VSIX 安装..."）。要在 SSH 远程服务器上安装扩展，您可以先在本地计算机上安装它，然后打开远程主机的 VSCode 窗口，并选择"在 SSH 中安装..."来在远程服务器上安装扩展。

Then you should start the debugger server:

然后，您应该启动调试器服务器：

```bash
./target/debug/ydb -p 2345 # -p specifies the port number
```

After that you can start debugging in VSCode. You can set breakpoints, step through the code, and inspect the registers and memory. Click the debug icon at the right side of the menu bar to start debugging.

之后你可以在 VSCode 中开始调试。你可以设置断点、逐行执行代码，并检查寄存器和内存。点击菜单栏右侧的调试图标来开始调试。

By default, your assembly file is simulated with the `seq_std` architecture. If you want to change the architecture, you may use the `--arch` option:

默认情况下，您的汇编文件使用 `seq_std` 架构进行模拟。如果您想更改架构，可以使用 `--arch` 选项：

```bash
# specify another architecture to debug
# both builtin and extra architectures are supported
./target/debug/ydb -p 2345 --arch seq_plus_std
```

Refer to [y86-debugger](https://github.com/sshwy/y86-debugger) for more information.

![](assets/debugger-screenshot.png)

## HCL-rs Specification

Please refer to this [attachment](assets/hcl-rs.pdf) for detailed description of the HCL-rs syntax.