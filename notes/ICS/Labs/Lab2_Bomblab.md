# BombLab

*PKU，2025Fall，ICS，BombLab*

> ⚠️ 致各位同学：
> 
> **本笔记的目的是借鉴交流，而非仅仅提供答案，请勿抄袭，后果自负。**
> 
> 你可以参考我的想法、了解有哪些注意的地方，但是在自己实现的时候不要参考，避免抄袭。

## 写在前面

BombLab的难度相较于DataLab要高很多，不仅是因为编程语言从C变成了汇编语言，而且对逻辑推理、程序的机器表示的理解要求很高，所以完成BombLab的时间很长，每道题都需要花费1~2小时来阅读代码，还要调试程序、设置断点、分析内存。但是不可否认的是，BombLab是一个非常有创意的Lab，对你理解程序的机器级表示、知道汇编代码的功能和逻辑有很大的帮助。

#### 故事背景（到底有什么必要）

邪恶的 Gin 先生在我们的 64 位 Linux 机器上放置了一系列“二进制炸弹”。二进制炸弹是一个由多个阶段组成的程序。每个阶段都期望你在标准输入中输入特定的字符串。如果你输入了正确的字符串，那么这个阶段就会被解除，炸弹会继续进行下一阶段。否则，炸弹会打印出"BOOM!!!"然后终止。当所有阶段都被解除时，炸弹就被解除了。

我们有太多炸弹需要处理，所以我们给每个学生分配了一个炸弹来解除。你的任务，你不得不接受的任务，是在截止日期前解除你的炸弹。我们相信，就像柯南一样，你也已经在夏威夷学过炸弹拆除。祝你好运，欢迎加入炸弹拆除小队！

#### 介绍Lab

BombLab的内容很简单~~（到底哪里简单了？）~~，就是你需要对每一个Phase输入一行正确的字符串，如果输入错误则炸弹爆炸，并且**自动**向AutoLab服务器报告一次。每爆炸一次扣除0.5分，上限20分。所以，一定要小心拆弹（毕竟大家没有在夏威夷学过拆弹）。

前四个phase每个15分，最后两个各20分，而且难度递增。（难道不是指数式增长吗）

运行的时候，可以使用：

```bash
./bomb answer.txt
```

代码会从`answer.txt`读取行直到结束`EOF`，再切换到`stdin`以避免重复输入。

AutoLab会随时更新你（和你的同学）的进度。

#### 配置环境

在AutoLab上下载tar文件并上传到CLab上后，解压完成可以得到三个文件：

- `README`：这是专属于你的炸弹（为什么这还有定制化），里面有你的邮箱。

- `bomb`：二进制可执行文件（二进制炸弹）

- `bomb.c`：炸弹的基本逻辑（就是`main`函数啦）

这个Lab最常用到的工具就是`gdb`，也就是GNU调试器。你可以逐行跟踪程序，检查内存和寄存器，查看源代码和汇编代码（实际上也没有原代码），设置断点，设置内存监视点，并编写脚本。

而`objdump`是Linux下一个反汇编工具。这将帮助我们解决这些Phase。

以下是一些常用的指令（由BombLab的WriteUp提供）：

| 指令            | 全称    | 描述                       |
| ------------- | ----- | ------------------------ |
| `r`           | run   | 开始执行程序，直到下一个断点或程序结束      |
| `q`           | quit  | 退出 GDB 调试器               |
| `ni`          | nexti | 执行下一条指令，但不进入函数内部         |
| `si`          | stepi | 执行当前指令，如果是函数调用则进入函数      |
| `b`           | break | 在指定位置设置断点                |
| `c`           | cont  | 从当前位置继续执行程序，直到下一个断点或程序结束 |
| `p`           | print | 打印变量的值                   |
| `x`           |       | 打印内存中的值                  |
| `j`           | jump  | 跳转到程序指定位置                |
| `disas`       |       | 反汇编当前函数或指定的代码区域          |
| `layout asm`  |       | 显示汇编代码视图                 |
| `layout regs` |       | 显示当前的寄存器状态和它们的值          |

其中`p`和`x`有一些更重要的用法：

```bash
p $rax  # 打印寄存器 rax 的值
p $rsp  # 打印栈指针的值
p/x $rsp  # 打印栈指针的值，以十六进制显示
p/d $rsp  # 打印栈指针的值，以十进制显示

x/2x $rsp  # 以十六进制格式查看栈指针 %rsp 指向的内存位置 M[%rsp] 开始的两个单位。
x/2d $rsp # 以十进制格式查看栈指针 %rsp 指向的内存位置 M[%rsp] 开始的两个单位。
x/2c $rsp # 以字符格式查看栈指针 %rsp 指向的内存位置 M[%rsp] 开始的两个单位。
x/s $rsp # 把栈指针指向的内存位置 M[%rsp] 当作 C 风格字符串来查看。

x/b $rsp # 检查栈指针指向的内存位置 M[%rsp] 开始的 1 字节。
x/h $rsp # 检查栈指针指向的内存位置 M[%rsp] 开始的 2 字节（半字）。
x/w $rsp # 检查栈指针指向的内存位置 M[%rsp] 开始的 4 字节（字）。
x/g $rsp # 检查栈指针指向的内存位置 M[%rsp] 开始的 8 字节（双字）。

info registers  # 打印所有寄存器的值
info breakpoints  # 打印所有断点的信息

delete breakpoints 1  # 删除第一个断点，可以简写为 d 1
```

这些命令在 `/` 后面的后缀（如 `2x`、`2d`、`s`、`g`、`20c`）指定了查看内存的方式和数量。具体来说：

- 第一个数字（如 `2`、`20`）指定要查看的单位数量。

- 第二个字母（如 `x`、`d`、`s`、`g`、`c`）指定单位类型和显示格式，其中：
  
  - `c` / `d` / `x` 分别代表以字符 / 十进制 / 十六进制格式显示内存内容。
  
  - `s` 代表以字符串格式显示内存内容。
  
  - `b` / `h` / `w` / `g` 分别代表以 1 / 2 / 4 / 8 字节为单位（`unit`）显示内存内容。
    
    当使用 `x/b`、`x/h`、`x/w`、`x/g` 时，`unit` 会保留对应改变，直到你再次使用这些命令。

阅读`bomb.c`文件，我们可以发现其逻辑非常清晰：

```c
...
input = read_line();
phase_x(input);
phase_defused(fd);
print("...");
...
```

也就是说，函数会先读取一行输入，然后传入对应的Phase。我们现在可以简单的猜测，其内部应该存在某种在一定条件下会跳转到炸弹爆炸的函数的部分，而炸弹爆炸后会向服务器发送消息。

解读这个程序，我们还需要阅读其汇编代码，所以我们先来反汇编这个二进制程序：

```bash
objdump -d bomb > bomb.asm
```

这样我们就把汇编代码全部放在了`bomb.asm`这个文件中。

`gdb`有一个很好用的东西叫`.gdbinit`，他可以避免你每次启动调试都要要重新设置断点、打开界面。我们可以通过如下方式进行配置：

```bash
# 创建当前目录下的 .gdbinit 文件
touch .gdbinit
# 创建 .config/gdb 文件夹
mkdir -p ~/.config/gdb
# 允许 gdb 预加载根目录下所有的文件
echo "set auto-load safe-path /" > ~/.config/gdb/gdbinit
```

然后，就可以在该目录下的`.gdbinit`写入：

```bash
set args answer.txt
# 将输入定向到 answer.txt 文件中
layout asm
layout regs
# 分别在终端显示汇编和寄存器的实时详细信息
# 可选
b phase_1
b phase_2
b phase_3
b phase_4
b phase_5
b phase_6
# 为每个 phase 打断点，方便调试
# 每完成一个 phase，就可以注释掉一行。
```

#### 安全化炸弹

我在25年做这个Lab时，有一个同学的炸弹爆炸了50+次，非常的骇人（骇死我力），所以我们可以考虑，怎么让炸弹先安全化，再去拆弹？

有两种方法：

- 找到相关代码，再利用 `hexedit` 工具修改二进制码，替换条件跳转指令或者使用 `nop` 无义指令替换危险指令。（有点像AttackLab）

- 另一种则简单得多，就是在对应函数处设置断点，并且跳过向服务器发送消息的函数。

下面展示第二种方法：

阅读`bomb.asm`文件，我们可以找到两个函数：`explore_bomb`和`send_msg`。从函数名我们可以猜测这是炸弹爆炸和发送信息的函数，而且在`explore_bomb`函数中的：

```asm6502
    217c:    e8 55 fe ff ff           call   1fd6 <send_msg>
```

让我们确定`send_msg`是在`explore_bomb`内调用。所以，我们可以在`.gdbinit`中继续写入：

```bash
# 为 explode_bomb 中触发 send_msg 函数的地方设置断点
b *(explode_bomb + 0x44)
# 为此断点编程
command
# 直接跳到 exit 退出函数处，跳过发送信息流程
j *(explode_bomb + 0x81)
end
# 炸弹已经安全化，可以放心地拆弹了，开始运行程序
r
```

切记不可轻易将这段代码注释！

现在我们来一次解决这些炸弹：

## Phase1

在`bomb.asm`中我们可以找到`phase_1`到`phase_6`的函数。先来看看`phase_1`：

```asm6502
0000000000001784 <phase_1>:
    1784:    f3 0f 1e fa              endbr64
    1788:    48 83 ec 08              sub    $0x8,%rsp
    178c:    48 8d 35 45 2a 00 00     lea    0x2a45(%rip),%rsi        # 41d8 <_IO_stdin_used+0x1d8>
    1793:    e8 8b 06 00 00           call   1e23 <strings_not_equal>
    1798:    85 c0                    test   %eax,%eax
    179a:    75 05                    jne    17a1 <phase_1+0x1d>
    179c:    48 83 c4 08              add    $0x8,%rsp
    17a0:    c3                       ret
    17a1:    e8 92 09 00 00           call   2138 <explode_bomb>
    17a6:    eb f4                    jmp    179c <phase_1+0x18>
```

（其实`main`函数也有一部分，不过我觉得不影响，毕竟我打算做的时候都不知道`main`函数里面还有东西。）接下来我们可以逐行解读一下代码：

`endbr64`：无关紧要；

`sub $0x8,%rsp`：将栈指针`%rsp`减`0x8`，即为函数`phase_1`分配栈空间。

`lea 0x2a45(%rip),%rsi`：将`(%rip + 0x2a45)`处存储的值提取到`%rsi`中。

`call 1e23 <strings_not_equal>`：调用`strings_not_equal`函数，比对字符串是否相等。（从`strings_not_equal`可以知道传入的参数在`%rdi`和`%rsi`中）而`%rdi`寄存器在`phase_1`中一直没有修改，也就是在`main`函数中的`%rdi`：保存`read_line`函数的传入值。

`test %eax,%eax`：将 `%eax` 寄存器的值与其自身进行与运算，然后将结果存入 `%eax`。并且同时设置条件码（Condition Code），其中有一个叫做 `ZF` 的标志位，如果 `%eax` 的值为 0，则 `ZF` 为 1，否则为 0。

`jne 17a1 <phase_1+0x1d>`：条件跳转指令，`jne`指令的跳转条件的`~ZF`，如果`%eax`为1（即`strings_not_equal`函数返回`True`，函数返回值均存储在`%rax` / `%eax`中），则`ZF`为 0，程序进行跳转。跳转目标则是位于`17a1`的代码，也就是调用`explode_bomb`函数的地方。

`add $0x8,%rsp`：如果上一条没有跳转，即字符串匹配成功，则回复栈指针的位置，答案通过。

`ret`：返回，退出函数。

`add  $0x8,%rsp`：同上。

综上，我们可以得到`phase_1`的基本逻辑：输入一个字符串并存储在`%rdi`中，并与`(%rip + 0x2a45)`处存储的值对比。两者匹配则不会爆炸，炸弹解除。

那么，解决的办法也就很清晰了：找到`(%rip + 0x2a45)`处存储的值。

我们在`answer.txt`中随便写一行：

```textile
pku is better than thu
```

然后在终端输入：

```bash
gdb bomb
```

之后终端会有如下内容：

```bash
Reading symbols from bomb...
Breakpoint 1 at 0x1784
Breakpoint 2 at 0x17a8
Breakpoint 3 at 0x181a
Breakpoint 4 at 0x19da
Breakpoint 5 at 0x1a59
Breakpoint 6 at 0x1aec
Breakpoint 7 at 0x217c
...
Welcome to Mr.Gin's little bomb. You have 6 phases with
which to blow yourself up. Have a nice day! Mua ha ha ha!

Breakpoint 1, 0x0000555555555784 in phase_1 ()
(gdb) 
```

此时，程序停止在了我们设置的第一个断点处，也就是`phase_1`的第一行。而我们需要查询的值在第三行，所以我们继续输入：

```bash
ni
ni
ni
x/s $rip + 0x2a45
# 以C风格字符串打印(%rip + 0x2a45)处存储的值
```

然后我们可以看到：

```bash
(gdb) x/s $rip + 0x2a45
0x5555555581d8: "A secret makes a woman a woman"
```

所以我们就可以确定我们的答案就是`A secret makes a woman a woman`。

先输入`q`退出调试，然后在`answer.txt`中写入这个字符串，再次打开`gdb`，运行：

```bash
c
Breakpoint 1, 0x0000555555555784 in phase_1 ()
(gdb) c
Continuing.
Phase 1 defused. How about the next one?

Breakpoint 2, 0x00005555555557a8 in phase_2 ()
(gdb) 
```

我们就完成了`phase_1`。（可喜可贺，可喜可贺~）

## Phase2

```asm6502
00000000000017a8 <phase_2>:
    17a8:	f3 0f 1e fa          	endbr64
    17ac:	53                   	push   %rbx
    17ad:	48 83 ec 20          	sub    $0x20,%rsp
    17b1:	64 48 8b 04 25 28 00 	mov    %fs:0x28,%rax
    17b8:	00 00 
    17ba:	48 89 44 24 18       	mov    %rax,0x18(%rsp)
    17bf:	31 c0                	xor    %eax,%eax
    17c1:	48 89 e6             	mov    %rsp,%rsi
    17c4:	e8 f5 09 00 00       	call   21be <read_six_numbers>
    17c9:	83 3c 24 00          	cmpl   $0x0,(%rsp)
    17cd:	78 07                	js     17d6 <phase_2+0x2e>
    17cf:	bb 01 00 00 00       	mov    $0x1,%ebx
    17d4:	eb 0a                	jmp    17e0 <phase_2+0x38>
    17d6:	e8 5d 09 00 00       	call   2138 <explode_bomb>
    17db:	eb f2                	jmp    17cf <phase_2+0x27>
    17dd:	83 c3 01             	add    $0x1,%ebx
    17e0:	83 fb 05             	cmp    $0x5,%ebx
    17e3:	7f 1a                	jg     17ff <phase_2+0x57>
    17e5:	48 63 c3             	movslq %ebx,%rax
    17e8:	8d 53 ff             	lea    -0x1(%rbx),%edx
    17eb:	48 63 d2             	movslq %edx,%rdx
    17ee:	89 d9                	mov    %ebx,%ecx
    17f0:	03 0c 94             	add    (%rsp,%rdx,4),%ecx
    17f3:	39 0c 84             	cmp    %ecx,(%rsp,%rax,4)
    17f6:	74 e5                	je     17dd <phase_2+0x35>
    17f8:	e8 3b 09 00 00       	call   2138 <explode_bomb>
    17fd:	eb de                	jmp    17dd <phase_2+0x35>
    17ff:	48 8b 44 24 18       	mov    0x18(%rsp),%rax
    1804:	64 48 2b 04 25 28 00 	sub    %fs:0x28,%rax
    180b:	00 00 
    180d:	75 06                	jne    1815 <phase_2+0x6d>
    180f:	48 83 c4 20          	add    $0x20,%rsp
    1813:	5b                   	pop    %rbx
    1814:	c3                   	ret
    1815:	e8 86 fa ff ff       	call   12a0 <__stack_chk_fail@plt>
```

## Phase3

## Phase4

## Phase5

## Phase6

```asm6502
000000000001aec <phase_6>:
    1aec:    f3 0f 1e fa              endbr64
    1af0:    41 54                    push   %r12
    1af2:    55                       push   %rbp
    1af3:    53                       push   %rbx
    1af4:    48 83 ec 60              sub    $0x60,%rsp
    1af8:    64 48 8b 04 25 28 00     mov    %fs:0x28,%rax
    1aff:    00 00 
    1b01:    48 89 44 24 58           mov    %rax,0x58(%rsp)
    1b06:    31 c0                    xor    %eax,%eax
    1b08:    48 89 e6                 mov    %rsp,%rsi
    1b0b:    e8 ae 06 00 00           call   21be <read_six_numbers>
    1b10:    bd 00 00 00 00           mov    $0x0,%ebp
    1b15:    eb 27                    jmp    1b3e <phase_6+0x52>
    1b17:    e8 1c 06 00 00           call   2138 <explode_bomb>
    1b1c:    eb 33                    jmp    1b51 <phase_6+0x65>
    1b1e:    83 c3 01                 add    $0x1,%ebx
    1b21:    83 fb 05                 cmp    $0n'hx5,%ebx
    1b24:    7f 15                    jg     1b3b <phase_6+0x4f>
    1b26:    48 63 c5                 movslq %ebp,%rax
    1b29:    48 63 d3                 movslq %ebx,%rdx
    1b2c:    8b 3c 94                 mov    (%rsp,%rdx,4),%edi
    1b2f:    39 3c 84                 cmp    %edi,(%rsp,%rax,4)
    1b32:    75 ea                    jne    1b1e <phase_6+0x32>
    1b34:    e8 ff 05 00 00           call   2138 <explode_bomb>
    1b39:    eb e3                    jmp    1b1e <phase_6+0x32>
    1b3b:    44 89 e5                 mov    %r12d,%ebp
    1b3e:    83 fd 05                 cmp    $0x5,%ebp
    1b41:    7f 17                    jg     1b5a <phase_6+0x6e>
    1b43:    48 63 c5                 movslq %ebp,%rax
    1b46:    8b 04 84                 mov    (%rsp,%rax,4),%eax
    1b49:    83 e8 01                 sub    $0x1,%eax
    1b4c:    83 f8 05                 cmp    $0x5,%eax
    1b4f:    77 c6                    ja     1b17 <phase_6+0x2b>
    1b51:    44 8d 65 01              lea    0x1(%rbp),%r12d
    1b55:    44 89 e3                 mov    %r12d,%ebx
    1b58:    eb c7                    jmp    1b21 <phase_6+0x35>
    1b5a:    b8 00 00 00 00           mov    $0x0,%eax
    1b5f:    eb 11                    jmp    1b72 <phase_6+0x86>
    1b61:    48 63 c8                 movslq %eax,%rcx
    1b64:    ba 07 00 00 00           mov    $0x7,%edx
    1b69:    2b 14 8c                 sub    (%rsp,%rcx,4),%edx
    1b6c:    89 14 8c                 mov    %edx,(%rsp,%rcx,4)
    1b6f:    83 c0 01                 add    $0x1,%eax
    1b72:    83 f8 05                 cmp    $0x5,%eax
    1b75:    7e ea                    jle    1b61 <phase_6+0x75>
    1b77:    be 00 00 00 00           mov    $0x0,%esi
    1b7c:    eb 17                    jmp    1b95 <phase_6+0xa9>
    1b7e:    48 8b 52 08              mov    0x8(%rdx),%rdx
    1b82:    83 c0 01                 add    $0x1,%eax
    1b85:    48 63 ce                 movslq %esi,%rcx
    1b88:    39 04 8c                 cmp    %eax,(%rsp,%rcx,4)
    1b8b:    7f f1                    jg     1b7e <phase_6+0x92>
    1b8d:    48 89 54 cc 20           mov    %rdx,0x20(%rsp,%rcx,8)
    1b92:    83 c6 01                 add    $0x1,%esi
    1b95:    83 fe 05                 cmp    $0x5,%esi
    1b98:    7f 0e                    jg     1ba8 <phase_6+0xbc>
    1b9a:    b8 01 00 00 00           mov    $0x1,%eax
    1b9f:    48 8d 15 aa 64 00 00     lea    0x64aa(%rip),%rdx        # 8050 <node1>
    1ba6:    eb dd                    jmp    1b85 <phase_6+0x99>
    1ba8:    48 8b 5c 24 20           mov    0x20(%rsp),%rbx
    1bad:    48 89 d9                 mov    %rbx,%rcx
    1bb0:    b8 01 00 00 00           mov    $0x1,%eax
    1bb5:    eb 12                    jmp    1bc9 <phase_6+0xdd>
    1bb7:    48 63 d0                 movslq %eax,%rdx
    1bba:    48 8b 54 d4 20           mov    0x20(%rsp,%rdx,8),%rdx
    1bbf:    48 89 51 08              mov    %rdx,0x8(%rcx)
    1bc3:    83 c0 01                 add    $0x1,%eax
    1bc6:    48 89 d1                 mov    %rdx,%rcx
    1bc9:    83 f8 05                 cmp    $0x5,%eax
    1bcc:    7e e9                    jle    1bb7 <phase_6+0xcb>
    1bce:    48 c7 41 08 00 00 00     movq   $0x0,0x8(%rcx)
    1bd5:    00 
    1bd6:    bd 00 00 00 00           mov    $0x0,%ebp
    1bdb:    eb 07                    jmp    1be4 <phase_6+0xf8>
    1bdd:    48 8b 5b 08              mov    0x8(%rbx),%rbx
    1be1:    83 c5 01                 add    $0x1,%ebp
    1be4:    83 fd 04                 cmp    $0x4,%ebp
    1be7:    7f 11                    jg     1bfa <phase_6+0x10e>
    1be9:    48 8b 43 08              mov    0x8(%rbx),%rax
    1bed:    8b 00                    mov    (%rax),%eax
    1bef:    39 03                    cmp    %eax,(%rbx)
    1bf1:    7d ea                    jge    1bdd <phase_6+0xf1>
    1bf3:    e8 40 05 00 00           call   2138 <explode_bomb>
    1bf8:    eb e3                    jmp    1bdd <phase_6+0xf1>
    1bfa:    48 8b 44 24 58           mov    0x58(%rsp),%rax
    1bff:    64 48 2b 04 25 28 00     sub    %fs:0x28,%rax
    1c06:    00 00 
    1c08:    75 09                    jne    1c13 <phase_6+0x127>
    1c0a:    48 83 c4 60              add    $0x60,%rsp
    1c0e:    5b                       pop    %rbx
    1c0f:    5d                       pop    %rbp
    1c10:    41 5c                    pop    %r12
    1c12:    c3                       ret
    1c13:    e8 88 f6 ff ff           call   12a0 <__stack_chk_fail@plt>
```

## Secret Phase
