# Machine Level Programming II Control

## Control: Condition codes(Implitic Setting)

### single bit registers：条件码

**条件码**（Condition Code）是计算机处理器中的一组标志位，用于记录特定条件的结果。这是一组单个位的寄存器，常见的条件码有：

- **CF**：Carry Flag (For unsigned)

- **SF**：Sign Flag (for signed) 

- **ZF**：Zero Flag

- **OF**：Overflow Flag (for signed)

`cmpq Src2, Src1`（比较函数，相当于计算`Src1 - Src2`）：`cmpq`语句不改变寄存器值，只会根据操作数来变更条件码。包括其他操作在内，条件码的变更有如下结果：

- CF：最近的操作产生了多余的位（无符号溢出）；

- ZF：最近的操作结果为0；(`Src1 == Src2`)

- SF：最近的操作结果为负；(`Src1 - Src2 < 0`)

- OF：最近的操作（有符号）出现了溢出。(两正得负 or 两负得正)

### Explicit Setting：cmp/test语句

- **Compare**：`cmpq Src2, Src1`，相当于计算`Src1 - Src2`

- **Test**：`testq Src2, Src1`，相当于计算`Src1 & Src2`

前者用于比较两个数，后者常用于判断符号。例如：`testq %rax, %rax`，操作数一致，用来检查`%rax`是零、正数还是负数。

执行 `testq %rax, %rax` 后，以下几个关键条件码会被设置：

- **ZF (Zero Flag)**:
  如果 `%rax == 0`，则 `ZF = 1`，表示结果为零。
  如果 `%rax ≠ 0`，则 `ZF = 0`，表示结果非零。

- **SF (Sign Flag)**:
  如果 `%rax` 是负数（最高位为 1，在有符号数的情况下），则 `SF = 1`。如果 `%rax` 是正数或零（最高位为 0），则 `SF = 0`。

这两个标志位能够直接表示 `%rax` 的值为零、正数或负数：

- **零 (`%rax == 0`)**：`ZF = 1`。
- **正数 (`%rax > 0`)**：`ZF = 0` 且 `SF = 0`。
- **负数 (`%rax < 0`)**：`SF = 1`。

### Reading Condition Codes：SetX语句

`SetX`指令：通过条件码（如 ZF、SF、CF、OF）来判断对比结果，把目标寄存器的低字节（各寄存器的最低8位）设置为 0 或 1。

| **指令**     | **条件（Condition）** | **描述（Description）**                 |
| ---------- | ----------------- | ----------------------------------- |
| `sete %x`  | ZF                | Equal / Zero（等于 / 零）                |
| `setne %x` | ~ZF               | Not Equal / Not Zero（不等于 / 非零）      |
| `sets %x`  | SF                | Negative（负数）                        |
| `setns %x` | ~SF               | Nonnegative（非负数）                    |
| `setg %x`  | ~ (SF ^ OF) & ~ZF | Greater (Signed)（大于，有符号）            |
| `setge %x` | ~ (SF ^ OF)       | Greater or Equal (Signed)（大于等于，有符号） |
| `setl %x`  | (SF ^ OF)         | Less (Signed)（小于，有符号）               |
| `setle %x` | (SF ^ OF) \| ZF   | Less or Equal (Signed)（小于等于，有符号）    |
| `seta %x`  | ~CF & ~ZF         | Above (Unsigned)（高于，无符号）            |
| `setb %x`  | CF                | Below (Unsigned)（低于，无符号）            |

`movzbl %al, %eax`（零扩展，符号扩充为`movsbl`）用于将一个字节的数据拷贝到一个四字节的目的操作数中，并使用零来填充其余的位。可以用于将`SetX`操作后的结果扩展为4字节，以`bool`类型返回。例如：

```c
int gt(long x, long y){
    return x < y;
}
```

```
cmpq %rsi, %rdi  # Compare x:y
setg %al         # Set when >
movzbl %al, %eax # Zero rest of %rax
ret              # return
```

## Conditional branches

### Jumping：jX语句

**跳转（jump）** 指令会导致在执行过程中切换到程序中的一个全新位置，跳转的目的地通常用一个**标号（label）** 指明。

| **指令**         | **同义名** | **跳转条件（同SetX语句）** | **描述**        |
| -------------- | ------- | ----------------- | ------------- |
| `jmp Label`    |         | 1                 | 直接跳转          |
| `jmp *Operand` |         | 1                 | 间接跳转          |
| `je`           | `jz`    | ZF                | 相等 / 零        |
| `jne`          | `jnz`   | ~ZF               | 不相等 / 非零      |
| `js`           |         | SF                | 负数            |
| `jns`          |         | ~SF               | 非负数           |
| `jg`           | `jnle`  | ~(SF ^ OF) & ~ZF  | 大于（有符号 >）     |
| `jge`          | `jnl`   | ~(SF ^ OF)        | 大于或等于（有符号 >=） |
| `jl`           | `jnge`  | SF ^ OF           | 小于（有符号 <）     |
| `jle`          | `jng`   | (SF ^ OF) \| ZF   | 小于或等于（有符号 <=） |
| `ja`           | `jnbe`  | ~CF & ~ZF         | 超过（无符号 >）     |
| `jae`          | `jnb`   | ~CF               | 超过或相等（无符号 >=） |
| `jb`           | `jnae`  | CF                | 低于（无符号 <）     |
| `jbe`          | `jna`   | CF \| ZF          | 低于或相等（无符号 <=） |

```c
long absdiff(long x, long y){
    long result;
    if (x > y)
        result = x-y;
    else
        result = y-x;
    return result;
}
```

编译为机器码即为：

```
absdiff:
    cmpq    %rsi, %rdi
    jle     .L4
    movq    %rdi, %rax
    subq    %rsi, %rax
    ret
.L4:
    movq    %rsi, %rax
    subq    %rdi, %rax
    ret
```

参考C语言中的`goto`语句。

### 条件移动指令（Conditional Move Instructions in C）

```c
if (test) Desc <- Src
```

即如果满足指定的测试条件，就将 `Src` 的值移动到 `Dest`。

则此前代码可以编译为：

```aspnet
absdiff:
    movq    %rdi, %rax
    subq    %rsi, %rax # result = x-y
    movq    %rsi, %rdx
    subq    %rdi, %rdx # eval = y-x
    cmpq    %rsi, %rdi
    cmovle  %rdx, %rax
    ret
```

#### Bad Cases?

- **Expensive（高代价计算）**
  `val = Test(x) ? Hard1(x) : Hard2(x);`中的两个分支均会被计算，造成不必要的资源开销，只有在计算非常简单时才有意义；计算较复杂时应该使用传统的条件跳转。

- **Risky（风险计算）**
  `val = p ? *p : 0;`无论 `p` 是否为非空指针，`*p` 都会被计算。因此，如果 `p` 是一个空指针，可能会引发**未定义行为**或**程序崩溃**。应优先选择传统分支方法进行显式判断。

- **Side effects（有副作用的计算）**
  `val = x > 0 ? x *= 7 : x += 3;`在这个过程中，`x`的值发生了多次改变，条件移动要求计算必须是**无副作用的**，而这段代码直接修改了变量 `x`，违背了该要求。

## Loops

（以`do-while`循环为例）

```c
do
    Body
    while (Test);
```

```c
loop:
    Body
    if (Test)
        goto loop
```

除此之外还有`while`循环和`for`循环。他们均可以相互转换（包含`goto`语句）。

`while`循环有一个**O1**优化版本：

```c
if(!Test) goto done;
loop:
    Body
    if(Test)
        goto loop
done:
    Body
```

## Switch Statements

example：

```c
long switch_eg(long x, long y, long z){
    long w = 1;
    switch(x){
    case 1:
        w = y*z; break;
    case 2:
        w = y/z;
        /* Fall Through */
    case 3:
        w += z; break;
    case 5:
    case 6:
        w -= z; break;
    default:
        w = 2;
    }
    return w;
}
```

### Jump Table（跳转表）& Jump Targets

考虑`switch`的伪代码形式：

```c
switch(x) {
    case val_0: Block 0;
    case val_1: Block 1;
    ...
    case val_(n-1): Block n-1;
}
```

`switch(x)` 根据变量 `x` 的值决定跳转到哪一个 `case` 分支对应的代码块（`Block`）。

我们引入**Jump Table（跳转表）** 的概念，作为一种数据结构，通过一张表直接将变量值映射到分支代码块的目标地址，减少条件判断的操作，用于高效实现 `switch-case` 语句。

- **跳转表 (JTab)**: 表中每一项存储一个分支代码块的目标地址（如 `Targ0`, `Targ1`）。

- **跳转目标 (Jump Targets)**: 每个目标地址（如 `Targ0`, `Targ1`, `Targ2`）对应具体的代码块（`Block 0`、`Block 1`等）。

具体实现的伪代码为：

```c
goto *JTab[x];
```

| **类别**    | **优点**                                   | **缺点**                                             |
| --------- | ---------------------------------------- | -------------------------------------------------- |
| **高效性**   | 直接通过索引访问跳转目标，避免逐一比较和查找，性能优于链式 `case` 判断。 | 当 `case` 值过于稀疏时，跳转表会浪费大量内存（低效）。                    |
| **优化分支**  | 适用于分支较多的情况，尤其是分布稠密的连续整数值。                | 不适用于分支较少或值分布不连续（如 1, 10, 100）的情况，编译器可能回退到其他实现方式。   |
| **边界检查**  | 编译器可在需要时生成跳转表，大大简化大量分支代码逻辑。              | 需要额外的边界检查，防止非法索引（如 `x` 超出表的有效范围时）。                 |
| **存储效率**  | 占用的存储空间（内存）与分支数量一致，适用于分布稠密的整数值。          | 对于跨度大的分支（如 0 和 1,000,000），表会非常稀疏，无法高效存储，可能占用过多的内存。 |
| **编译器支持** | 现代编译器（如 GCC、Clang）会根据分支情况自动生成合理的跳转表实现优化。 | 编译器未必在所有情况下生成跳转表，例如分支太少或条件不适合时会选择其他实现方案（如二分查找）。    |

### 汇编？

对于上文的`switch`代码，汇编部分（Setup）写为：

```aspnet
switch_eg:
    movq    %rdx, %rcx
    cmpq    $6, %rdi       # x:6
    ja      .L8            # Use default
    jmp     *.L4(, %rdi, 8)# Goto *JTab[x]
```

而跳转表（ Jump Table）如下：

```c
.section    .rodata
    .align 8
.L4
    .quad    .L8 # x = 0
    .quad    .L3 # x = 1
    .quad    .L5 # x = 2
    .quad    .L9 # x = 3
    .quad    .L8 # x = 4
    .quad    .L7 # x = 5
    .quad    .L7 # x = 6
```

具体到每一部分则如下所示（以`case 1:`为例）：

```c
.L3:
    movq    %rsi, %rax # y
    imulq   %rdx, %rax # y*z
    ret
```

由于`case 2:`部分没有写`break;`语句，其会继续执行后续代码：

```c
.L5:                     # Case 2
    movq %rsi, %rax      # 将参数 y (%rsi) 的值加载到寄存器 %rax
    cqto                 # 将 %rax 的符号扩展到 %rdx 和 %rax，准备执行有符号除法
    idivq %rcx           # 执行 y / z，其中 z 存储在 %rcx，结果存储在 %rax
    jmp .L6              # 跳转到 merge 部分，执行合并逻辑
.L9:                     # Case 3
    movl $1, %eax        # 将 w 初始化为 1 (写入 %eax)
.L6:                     # Merge point
    addq %rcx, %rax      # 将 z (%rcx) 加到 w (%rax)，完成 w += z
    ret
```

以及剩余的情况；

```c
.L7:                # Case 5,6
    movl $1, %eax
    subq %rdx, %rax
    ret
.L8:                # Default:
    movl $2, %eax
    ret
```
