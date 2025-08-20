# Machine Level Programming I Basic

(注：使用 英特尔64位指令集，也称CISC)

**CISC**：Complex Instruction Set Computer，复杂指令集计算机

**RISC**：Reduced Instruction Set Computer，精简指令集计算机

## C，Assembly，Machine code

### Definitions

**Architecture（架构）**：也称**ISA (Instruction Set Architecture)**，是处理器设计中需要理解或编写汇编/机器代码的部分。
例如：Instruction set specification（指令集规范）、registers（寄存器）

**Microarchitecture（微架构）**：架构的具体实现。
例如：Cache sizes（缓存大小）、Core frequency（核心频率）。

**Code Form（代码形式）**：

- **Machine Code（机器码）**：处理器执行的字节级程序。

- **Assembly Code（汇编代码）**：机器码的文本表示形式。

**Example ISAs（指令集架构示例）**：

- **Intel:**  
  x86, IA32, Itanium, x86-64.
- **ARM:**  
  Used in almost all mobile phones.

### Assembly/Machine Code View

**CPU 核心组件与状态**

- **PC (Program Counter, 程序计数器)**：保存下一条指令的地址（在 x86-64 中为 RIP）。
- **寄存器 (Registers)**：快速存取的存储位置，用于存放程序运行的重要中间数据。
- **条件码 (Condition Codes)**：用于保存最近一次算术或逻辑运算的结果，支持条件分支判断。

**Memory（内存）特性**

- 是按字节可寻址（Byte addressable array）的，包含程序代码、用户数据和栈。
- 栈（Stack）用于过程调用和临时数据存储。

**CPU 和 Memory 的交互**

- CPU 通过地址（addresses）访问内存中的指令（instructions）或数据（data）。
- 将内存中的指令或数据读取到 CPU 内部计算，或计算结果写回内存。

### Turning C into Object Code

**C 程序到可执行程序的编译流程**：

- C 程序（`.c` 文件） → 汇编代码（`.s` 文件） → 目标文件（`.o` 文件） → 可执行文件（`.exe` 或无扩展名的可执行程序）。
  `C program -> Asm program -> Object Program -> Executable program`

- `.c` 文件和`.s` 文件是文本文件，`.o` 文件和可执行文件都是二进制文件。

- 经过编译（Compiler）、汇编（Assembler）和链接（Linker）三大步骤。

**关键工具与作用**：

- **编译器（gcc 或其他）**：将源代码转换成汇编代码。
- **汇编器（gcc or as）**：将汇编代码转换为二进制格式的目标文件。
- **链接器（ld or gcc）**：将目标文件与静态库或其他模块一起合并，生成最终的可执行文件。

**常用选项**：

- `-Og`：开启基本调试优化。
- `-S`：生成汇编代码文件（`.s`）。
- `-o`：指定输出文件名称。
- 例如：`gcc -Og p1.c p2.c -o p`，将原代码`p1.c`、`p2.c`编译为可执行文件`p`并开启基本调试优化。

**静态库的作用**：

- 静态库（如 `.a` 文件）被链接进可执行文件中，为程序提供必要的功能支持。

### 汇编特点

#### 1.数据类型

- 整形数据只有1，2，4，8字节大小；

- 浮点数据有4，8，10字节大小；

- 代码与普通数据并无区别，是指一段由机器指令字节序列表示的可执行程序逻辑；

- 不支持聚合类型。

#### 2.操作Operations

- **数据运算**：汇编允许直接对**寄存器**和**内存数据**进行算术运算；

- **数据传输**：汇编语言无法直接对内存中的数据进行复杂运算，因此需要将数据先加载到寄存器中进行操作，然后再存储回内存。

- **转移控制**：汇编语言通过控制流指令来转移当前程序的执行位置，可以是条件或无条件的跳转。

### 机器码示例

#### 1.C Code

```c
*dest = t
```

指针赋值，将变量`t`储存到指针`dest`指向的位置。

#### 2.Assembly

```
movq %rax, (%rbx)
```

- `movq`：move quadword，移动 8 字节数据；

- `%rax`：寄存器，保存变量`t`；

- `(%rbx)`：表示寄存器`%rbx`存储的是内存地址，`movq`会将`%rax`的值写入该地址指向的内存。

#### 3.Object Code

```objc
0x40059e:  48 89 03
```

`0x40059e`：该指令在内存的地址；

`48 89 03`：该指令的机器码（3字节）。

- `48`：表示 64 位操作数前缀（REX prefix）

- `89`：是`mov r/m64, r64`的操作码

- `03`：是 **ModR/M** 字节，表示源寄存器是`%rax`，目标内存地址由`%rbx`给出。

## Assembly Basic：Registers，operands，move

### x86-64 整数寄存器

| `%rax` | `%rsi` | `%r8`  | `%r12` |
| ------ | ------ | ------ | ------ |
| `%rbx` | `%rdi` | `%r9`  | `%r13` |
| `%rcx` | `%rsp` | `%r10` | `%r14` |
| `%rdx` | `%rbp` | `%r11` | `%r15` |

如果使用`%r`版本（如上表），则为64位；如果使用`%e`版本，则为32位。当然也可以使用其低位的 2字节/16位 和1字节/8位。

`%rsp`/`%esp`寄存器称为**栈指针/栈顶指针**。

### Moving Data

#### 代码：

```
movq Sourse, Dest
```

**`movq` 指令**用于传输数据：

- 它将“来源” (`Source`) 数据移动到“目标” (`Dest`) 中。
- “q”表示字长为**Quad Word (64 bits)**，适用于 x86-64 架构。

使用 `movq` 可以：

- 将数据从一个寄存器移到另一个寄存器。
- 从内存读取数据到寄存器。
- 将寄存器的数据写入内存。
- 将立即数直接写入寄存器或内存。

#### 操作数

在汇编指令中，操作数可以是以下三种类型：立即数、寄存器 和 内存。

**1. Immediate (立即数)**：一个常量值，通常是整型数据。

- **格式**：立即数以 `$` 开头。
  
  - 例如：
    - `$0x400` 表示十六进制值 `0x400`。
    - `$-533` 表示负数 `-533`。

- **编码方式**：
  
  - 立即数可以用 **1、2 或 4 个字节**表示，依指令需求而定。
  - 立即数直接嵌入到指令中。

**2. Register (寄存器)**：程序在运行过程中使用的处理器内部寄存器。

- **x86-64 的整数寄存器**：
  
  - 一共有 **16 个字长为 64-bit 的寄存器**，如 `%rax`、`%rbx` 等。
  
  - 常见寄存器：
    
    - `%rax`, `%rcx`, `%rdx`, `%rbx`, `%rsp`, `%rbp`, `%rsi`, `%rdi`。
    - 还有额外的寄存器如 `%r8` 到 `%r15`，提供更灵活的运算。
  
  - 特殊用途：
    
    - `%rsp`: 堆栈指针（Stack Pointer），专门用于栈操作。
    - `%rbp`: 栈基址寄存器（Base Pointer），通常用于函数调用中的栈帧管理。

- **使用案例**：
  
  - 例如，`movq %rax, %rbx` 将 `%rax` 的值复制到 `%rbx`。

**3. Memory (内存)**：程序操作的内存地址。

- **地址模式**：
  
  - 最简单的内存访问：`(%rax)` 表示使用 `%rax` 储存的地址指向的内存单元。
  - 可以进行更复杂的地址计算，例如偏移或索引。

- **内存访问规则**：
  
  - 每次访问内存会传输 **8 个连续字节**（适用于 64-bit 架构）。
  - 例如，`movq (%rbx), %rax` 会读取 `%rbx` 指向的内存内容，存入 `%rax`。

#### Combinations

我们无法将一个直接数作为目标`dest`，也不能将内存作为内存的目标（即不可以`movq Mem Mem`）。故`movq`只有 5 种格式。

| Source | Dest | Code                 | C Analog        |
| ------ | ---- | -------------------- | --------------- |
| Imm    | Reg  | `movq $0x4, %rax`    | `temp = 0x4;`   |
| Imm    | Mem  | `movq $-147, (%rax)` | `*p = -147`     |
| Reg    | Reg  | `movq $rax, %rdx`    | `temp2 = temp1` |
| Reg    | Mem  | `movq $rax, (%rax)`  | `*p = temp`     |
| Mem    | Reg  | `movq ($rax), %rdx`  | `temp = *p`     |

### 内存寻址模式(Memory Addressing Modes)

内存寻址包括**常规寻址**和**偏移寻址**：

| 模式               | 语法      | 数学公式              | 示例                   |
| ---------------- | ------- | ----------------- | -------------------- |
| **Normal**       | `(%R)`  | `Mem[Reg[R]]`     | `movq (%rcx), %rax`  |
| **Displacement** | `D(%R)` | `Mem[Reg[R] + D]` | `movq 8(%rbp), %rdx` |

#### 核心要点：

1. **Normal 寻址**是最基础的内存访问，用于访问寄存器指向地址的内存内容（C 指针解引用）。
2. **Displacement 寻址**允许灵活地操作复杂的数据结构（例如栈、数组、结构体），可以访问基址加偏移量的内存（C 栈、数组等）

#### example:

```c
void swap(long *xp, long *yp){
    long t0 = *xp;
    long t1 = *yp;
    *xp = t1;
    *yp = t0;
}
```

```sass
swap:
    movq    (%rdi), %rax
    movq    (%rsi), %rdx
    movq    %rdx, (%rdi)
    movq    %rax, (%rsi)
```

其中的对应关系为：

| Register | Value |
| -------- | ----- |
| `%rdi`   | `xp`  |
| `%rsi`   | `yp`  |
| `%rax`   | `t0`  |
| `%rdx`   | `t1`  |

#### 复杂内存寻址：

一般形式的内存寻址为：**`D(Rb,Ri,S)`**

其内存地址的计算规则是：`Mem[Reg[Rb] + S * Reg[Ri] + D]`

**`D` (Displacement)** - 偏移量

- 这是一个常量（1、2 或 4 个字节，取决于指令）。
- 用于指定地址的固定偏移量。
- 在 C 中可以联想到数组或结构体中的固定位置：
  - 比如：`array[index]` 或 `base_address + offset`。

**`Rb` (Base Register)** - 基址寄存器

- 表示内存区域的起始地址。
- x86-64中的任意整数寄存器都可以用作基址寄存器（例如 `%rax`, `%rbp` 等）。
- 这是整个地址计算的基础。

**`Ri` (Index Register)** - 索引寄存器

- 用于动态地调节地址访问，比如数组索引。
- x86-64中的任意整数寄存器都可以作为索引寄存器（**除了 `%rsp`**，因为 `%rsp` 是专用的堆栈指针）。
- 如果没有使用索引寄存器，可以省略这个字段。

**`S` (Scale)** - 比例因子/尺度

- 表示索引寄存器的倍数。
- 有效值为：`1, 2, 4, 8`。
  - **为什么 1、2、4、8？**
    - 它们对应常见数据类型的字节大小：
      - 1字节（`char`）
      - 2字节（`short`）
      - 4字节（`int`）
      - 8字节（`double` 或 `long`）
    - 这种限制使得指令更加高效，不必支持任意因子。
- 如果比例因子为 `1`，可以省略。

#### 地址计算：

假设地址：`%rdx`:`0xf000`，`%rcx`:`0x0100`

| **Expression**    | **Computation**      | **Address** |
| ----------------- | -------------------- | ----------- |
| `0x8(%rdx)`       | `0xf000 + 0x8`       | `0xf008`    |
| `(%rdx, %rcx)`    | `0xf000 + 0x100`     | `0xf100`    |
| `(%rdx, %rcx, 4)` | `0xf000 + 4 * 0x100` | `0xf400`    |
| `0x80(, %rdx, 2)` | `2 * 0xf000 + 0x80`  | `0x1e080`   |

## Arittmetic & logical operations

### 地址计算

**代码**：`leaq Src, Dst`.

- `Src`：表示地址模式的表达式（涉及偏移量、基址、索引、比例因子等）。
- `Dst`：目标寄存器，用于存储计算的地址。

#### 用途 (Uses)

1. **计算地址而不引用内存**：
   
   - 用于将某个地址计算结果存储到寄存器，而不真的读取该地址的内存内容。
   - 例如：C 代码中 `p = &x[i]` 可以通过 `leaq` 快速实现。

2. **计算算术表达式**：
   
   - 常用于计算类似如下形式的数学表达式：`x + k * y`
   
   - 其中，`k` 可能是 `1, 2, 4, 8` （常见比例因子，对应常规跨字节的数据访问）。

#### Example

```c
long m12(long x){
    return x*12;
}
```

```asm6502
leaq (%rdi, %rdi, 2), %rax  # t <- x + 2*x = 3*x
salq $2, %rax               # t <- 3*x << 2 = 12*x
```

### 常见的算术和逻辑运算指令

`[operation] Src, Dest`：

| **指令**      | **操作** | **说明**                      |
| ----------- | ------ | --------------------------- |
| `addq`      | 加法     | `Dest = Dest + Src`         |
| `subq`      | 减法     | `Dest = Dest - Src`         |
| `imulq`     | 乘法     | `Dest = Dest * Src`         |
| `salq/shlq` | 算术左移   | `Dest = Dest << Src`        |
| `sarq`      | 算术右移   | `Dest = Dest >> Src` (符号填充) |
| `shrq`      | 逻辑右移   | `Dest = Dest >> Src` (补零)   |
| `xorq`      | 按位异或   | `Dest = Dest ^ Src`         |
| `andq`      | 按位与    | `Dest = Dest & Src`         |
| `orq`       | 按位或    | `Dest = Dest \| Src`        |

`[operation] Dest`：

| 指令     | 操作   | 说明                |
| ------ | ---- | ----------------- |
| `incq` | 加1   | `Dest = Dest + 1` |
| `decq` | 减1   | `Dest = Dest - 1` |
| `negq` | 取负   | `Dest = - Dest`   |
| `notq` | 逐位取反 | `Dest = ~Dest`    |
