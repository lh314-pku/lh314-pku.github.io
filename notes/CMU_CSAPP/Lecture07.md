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

#### example：

```c
long incr(long *p, long val){
    long x = *p;
    long y = x + val;
    *p = y;
    return x;
}
```

```aspnet
incr:
    movq    (%rdi),%rax   # %rdi : p
    addq    %rax,%rsi     # %rsi : val, y
    movq    %rsi,(%rdi)   # %rax : x
    ret
```

如上是函数`incr`的代码和指令。现在我们来看`call_incr`函数：

```c
long call_incr() {
    long v1 = 15213;
    long v2 = incr(&v1, 3000);
    return v1 + v2;
}
```

```asm6502
call_incr:
    subq $16, %rsp
    movq $15213, 8(%rsp)
    movl $3000, %esi
    leaq 8(%rsp), %rdi
    call incr
    addq 8(%rsp), %rax
    addq $16, %rsp
    ret
```

首先，第一行`long v1 = 15213;`生成了两条指令：

- `subq $16, %rsp`：对`%rsp`进行减法操作，在栈中分配了16字节空间；

- `movq $15213, 8(%rsp)`：将栈的前8字节分配给参数`v1`，剩余8字节（当前`%rsp`）未被使用。

`leaq 8(%rsp), %rdi`将`v1`的地址存放在`%rdi`中，作为指针（即`*p`）传入`incr`函数。

之后，通过`call incr`调用`incr`函数，并把`v1`也加到`%rax`上返回。

最后，`addq $16, %rsp`释放内存。

#### conventions

对于函数的调用关系，调用其他函数的函数称为**调用者（caller）**、被调用的函数称为被**调用者（callee）**。

管理寄存器的方法包括：**Caller Saved**和**Callee Saved**.

因此按照约定：

- `%rax`：caller-saved，存储返回值。

- `%rdi,... , %r9`：caller-saved，参数

- `%r10, %r11`：caller-saved，可以被任意函数修改的临时值

- `%rbx,%r12,%r13,%r14`：callee-saved，使用前必须存储其原值，并且在使用后恢复其值。

- `%rbp`：callee-saved，同上，也可作为帧指针。

- `%rsp`：callee-saved，`%rsp`的值在函数调用过程中可以改变（e.g. 分配栈空间或者回收栈空间），但在函数返回时，`%rsp`的值必须恢复到原始值。

## Illustration of Recursion(递归示例)

我们以`pcount`函数的递归版本为例：

```c
long pcount_r(unsigned long x){
    if (x == 0){
        return 0;
    }
    else{
        return (x & 1) + pcount_r(x >> 1);
    }
}
```

```asm6502
pcount_r:
    movl    $0, %eax
    testq   %rdi, %rdi
    je      .L6
    pushq   %rbx
    movq    %rdi, %rbx
    andl    $1, %ebx
    shrq    %rdi
    call    pcount_r
    addq    %rbx, %rax
    popq    %rbx
.L6:
    rep;    ret
```


