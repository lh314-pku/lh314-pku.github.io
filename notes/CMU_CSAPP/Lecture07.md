# Machine Level Programming III Procedures

## Stack Structure(栈 in x86-64)

**栈增长方向：** 栈朝着低地址方向增长，程序通过栈传递潜在数据、控制信息和数据，以及分配本地数据。

**栈指针 `%rsp`：** 栈指针始终指向栈顶（当前最低地址），是操作栈的核心。

**关键作用：**

- 临时存储函数调用的局部变量、返回地址和寄存器内容。
- 实现函数调用的顺序关系，保证程序执行逻辑的正确性。

在绘制栈的结构时，我们将低地址放在上面称为“bottom”，高地址放在底部称为“top”（不知道为什么，反正大家都这样画），初始时栈顶指针位于最低端，数据先进后出。

### 1.Push

**`pushq Src`**（将四字压入栈）。

操作数`Src`可以是一个寄存器，立即数或一个内存地址中的值。

之后`%rsp`会减少8字节，而操作数压入了原`%rsp`的地址。

### 2.Pop

**`popq Dest`**（从栈中取出四字）

从`%rsp`当前位置取出四字存储到`Dest`，然后`%rsp`增加8字节。

## Calling Conventions(调用约定)

### 1.Passing control（call 和 ret 语句）

在 x86-64 架构中，**过程调用（function call）** 和 **返回（return）** 使用栈来管理调用的顺序和返回的地址。我们需要用到`call`和`ret`语句：

| 指令              | 描述       |
| --------------- | -------- |
| `call Label`    | 过程调用     |
| `call *Operand` | 过程调用     |
| `ret`           | 从过程调用中返回 |

在反汇编过程得到的代码中的后缀`-q`只是用来强调这是`x86-64`版本的调用和返回。

#### example：

```c
0000000000400540 <multstore>:
  // x in %rdi, y in %rsi, dest in %rdx
    ...
  400541: mov    %rdx,%rbx
  400544: callq  400550 <mult2>
  // t in %rax
  400549: mov    %rax,(%rbx)
    ...

0000000000400550 <mult2>:
  // a in rdi, b in %rsi
  400550: mov    %rdi,%rax
  400553: imul   %rsi,%rax
  // s in %rax
    ...
  400557: retq
```

我们此时假设栈顶`%rsp`位于`0x120`，`%rip=0x400544`（`%rip`是程序计数器，与rest in peace无关）表示当前指令地址位于`0x544`，即`call`指令；

之后，`call`指令将下一个指令地址`0x400549`写入栈顶，同时栈顶`%rsp`减少8为变为`0x118`，而`%rip`记录实际调用的指令地址：`0x400550`；

当到达`ret`指令时，会假定栈顶有一个可以跳转的地址，弹出该地址后使程序继续从该地址运行。

### 2.Passing data

对于程序中的**数据流(Procedure Data Flow)**，前六个参数（`Arg 1...Arg 6`）会被存放在`%rdi`，`%rsi`，`%rdx`，`%rcx`，`%r8`，`%r9`六个**寄存器**中，返回值位于寄存器`%rax`，而之后的参数会被存储在栈中。

**注意**：仅在需要时分配栈空间 (Only allocate stack space when needed)。

#### example：

前述汇编代码的源代码如下：

```c
void multstone(long x, long y, long *dest){
    long t = mult2(x, y);
    *dest = t;
}
long mult2(long, a, long b){
    long s = a * b;
    return s;
}
```

### 3.Managing local data

#### 基于栈的语言Stack-Based Languages

如`C`、`Pascal`、`Java`等支持递归的语言，其代码必须是 **可重入(Reentrant)** 的,，即允许对同一过程的多次同时实例化。于是需要某些地方存储每个实例化的状态，包括参数、局部变量以及返回指针。

栈的规则是**后进先出(LIFO)**，不论是数据还是指令（地址）。

**栈帧 (Stack Frame):**

- 栈帧是栈中的一个逻辑区块，表示**单个函数调用的执行上下文**。（即单个过程实例化的状态）
- 每次函数调用时，分配一个新栈帧；函数返回时，销毁对应的栈帧。
- 栈帧的内容包括：
  - **返回信息：** 存储函数返回时所需的地址或其他信息。
  - **局部变量：** 函数内部声明的变量。（如果需要）
  - **临时空间**：程序运行过程中临时需要的额外空间。（如果需要）
- **帧指针(Frame Pointer)**：`%rbp`其指向当前栈帧的基地址（当前栈帧的“底”部）

栈帧使用时，进入函数时会分配一部分空间，通过`call`指令进行压栈操作；返回时则会释放空间，通过`ret`代码进行出栈操作。

#### x86-64/Linux Stack Frame

![](https://lh314-pku.github.io/notes/CMU_CSAPP/photos/Stack_Frame.png)

在返回地址处，会有一个可选的帧指针`%rbp`。

## Illustration of Recursion(递归示例)
