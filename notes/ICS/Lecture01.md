# Processor Arch: ISA & Logic Design

## Part1 Instruction Set Architecture

### 1. Y86-64架构：

- **程序寄存器** x 15，每个64位。
  按4位编号`0x0` - `0xE`，`0xF`为无寄存器（即没有x86-64的`%r15`寄存器）。

- **条件码** x 3
  ZF：Zero、SF：Negative、OF：Overflow

- **程序计数器**（PC）
  指示下一条指令的地址（绝对地址）

- **程序状态**
  表示正常操作或某种错误情况

- **内存**
  字节寻址存储数组，小端序。

- **指令集**：
  从内存读取1 - 10字节信息，代表一条指令。指令的前4位是代码位，往后4位是功能位。如果带有直接数，以64位（8字节有符号整数小端序）表示。

- **程序栈**：
  栈顶还是`%rsp`，向低地址生长。（%rsp指向地址最低的元素，非空）
  `pushq rA`：A 0  rA F，`%rsp`减8，将字从`rA`存储在%rsp处。
  `popq rA`：B 0  rA F，从`%rsp`所指内存中读字到`rA`，`%rsp`加8。

- **调用**：
  `call Dest`：8 0  Dest，将下一行指令的地址（返回地址）压栈，在目标处开始执行指令。
  `ret`：9 0，从栈中弹出返回地址并跳转。

- 其他：
  `nop`：1 0，No Operation
  `halt`：0 0，停止执行

- **状态码Stat**：
  1：AOK，正常操作；
  2：HLT，遇到`halt`指令；
  3：ADR，非法地址；
  4：INS，非法指令；

Y86-64程序框架（参考书P252，加入了一点课上讲的，PPT不予置评）：

```asm6502
init:
    .pos 0
    irmovq stack, %rsp ; 分配栈顶指针
    call Main          ; main函数入口
    halt               ; 停止

    .align 8 ; 指示向 8 字节对齐
array:
    .quad 0x000d000d000d
    .quad 0x00c000c000c0
    .quad 0x0b000b000b00
    .quad 0xa000a000a000
    .quad 0   ; 有时候会在数组后面补零作为结束符，便于统计总长度

main:
    irmovq array, %rdi ; 分配数组指针 -> %rdi
    irmovq $4, $rsi    ; 存入数组长度 -> %rsi
    call sum           ; sum(array, 4)
    ret

; long sum(long *start, long count)
; start in %rdi, count in %rsi
sum:
    irmovq $8, %r8  ; 8 -> %r8
    irmovq $1, %r9  ; 1 -> %r9
    ; Y86-64 没有立即数和寄存器的运算，只能将数存入寄存器后再运算
    xorq %rax, %rax ; %rax = 0
    andq %rsi, %rsi ; 设置条件码。
    jmp test
loop:
    mrmovq (%rdi), %r10 ; 读取数组元素
    addq %r10, %rax     ; 累加到%rax
    addq %r8, %rdi      ; 数组指针后移（向 8 字节对齐）
    subq %r9, %rsi      ; 计数器减一
test:
    jne loop   ; %rsi(count) != 0 -> loop
    ret

; 设置栈指针开始，即栈底。栈向低地址生长。
    .pos 0x200
stack:
```

将汇编语言文件`sum.ys`汇编为目标文件`sum.yo`：

```bash
unix> yas sum.ys
```

打印状态从原始的变化：

```bash
unix> yis sum.yo
```

CISC vs RISC

- CISC：对编译器简单，占用更少的代码字节

- RISC：更适合优化编译器，可以通过简单的芯片设计实现快速运行

## Part2 Logic Design

**数字信号Digital SIgnal**：使用电压阈值从连续信号中提取离散值。不易受噪声或低质量电路元件影响。可以使电路简单、小巧且快速。

### 逻辑门

![image](https://lh314-pku.github.io/notes/ICS/images/LogicGates.png)

与、或、非门。

异或门：`out = ! ((a && b) || (!a && !b))`。

将很多的逻辑门组合成一个网，就能构建**计算块**(computational block), 称为**组合电
路**(combinational circuits) 。

持续响应主要输入的变化，主要输出（在经过一段延迟后）成为主要输入的布尔函数。一个网应该是：

- 逻辑门输入只能是：主输入/系统输入、存储器单元输出、逻辑门输出

- 逻辑门输出不能直接相连

- 无环

以相等器为例：

![image](https://lh314-pku.github.io/notes/ICS/images/BitEqual.png)

推广到64位的比较：bool Eq = (A == B)

> HCL：硬件控制语言

位级/字节级多路复用器：

```hcl
int OUT = [
    s : A;
    1 : B; # 补 1 是为了保证最后总可以有一个输出
]
```

三位最小比较器(Minimum of 3 Words)：

```hcl
int Min3 = [
    A < B && A < C : A;
    B < A && B < C : B;
    1              : C;
]
```

四路多路复用器（Multiplexor）：

```hcl
int Out4 = [         // s1:s0
    !s1 && !s0 : D0; // 00
    !s1        : D1; // 01
    !s0        : D2; // 10
    1          : D3; // 11
]
```

### 算术逻辑单元ALU

输入：X、Y（操作数）、0/1/2/3（操作符）

输出：X+Y / X-Y / X&Y / X^Y（输出）、OF/ZF/CF（状态码）

（注：减法运算中是输入B减去输入A，配合`subq`指令的参数顺序）

### 寄存器Regs

硬件的寄存器和机器级编程的寄存器存在差异，前者代表电路的一部分，输入和输出直接连接到电路；后者是CPU中可以寻址的字，即寄存器ID。分别称“硬件寄存器”和“程序寄存器”。

硬件寄存器存储具体的数据（大小取决于硬件，常见64位/8字节）。结构上是一系列锁存器的集合，需要一个时钟输入。

锁存器：任何时候无论输入为何，总是保持当前输出（存储的短时数据）不变；当且仅当出现时钟上升沿，将输入存储并保持输出。

### 时钟Clock

时钟是一个周期性信号，决定什么时候要把新值加载到设备中。

### RAM

- 处理器的虚拟地址

- 寄存器文件。 在此，寄存器标识符作为地址。在 IA32 或 Y86-64 处理器中，寄存器文件有 15 个程序寄存器

（见教材）

补：对于Y86-64架构，寄存器地址是一个4位二进制数，有15个寄存器；读出/写入的数据是64位数据。

寄存器文件同样需要时钟的输入，

每次时钟上升时，输入valW上的值会被写入输入 dstW上的寄存器 ID指示的程序寄存器。

### HCL

只能表达硬件操作的有限方面 | 我们想要探索和修改的部分

#### 数据类型

bool：Boolean，小写字母

int：Word大写字母

#### 状态

#### 表达式

- 逻辑运算
  `a && b, a || b, !a`

- 整数比较
  `A == B`，`A != B`，etc

- 集合运算
  `A in { B, C, D }` -> `A == B || A == C || A == D`。

```hcl
OUT = [
    a : A;
    b : B;
    c : C;
]
```
