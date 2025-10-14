# Machine Level Programming V Advanced Topics

## 1.Memory Layout

计算机内存主要有Stack、Heap、Data、Text/Shared Libraries。

stack一般会有8MB的大小限制，向低地址扩展（初始00007FFFFFFFFFFFF，即47个1，虽然有64为但只使用47位。）

Heap存储库函数，例如`malloc()`，`calloc()`，`new()`等；

Data存贮全局变量等数据；

Text则是“文本区”。

## 2.缓冲区溢出Buffer Overflow

当超出为数组分配的内存大小时，我们称之为**缓冲区溢出Buffer Overflow**。主要原因通常是社会工程学/用户无知。

缓冲区溢出的常见形式有：未检查字符串长度、栈上的有边界数组超出范围（有时称为栈破坏Stack smashing）等。

### Vulnerability

对于库函数，例如：`gets()`、`strcpy()`、`strcat()`、`scanf()`、`fscanf()`、`sscanf()`等，均会出现由于没有边界条件检查导致的缓冲区溢出问题。超出缓冲区的数据可能会覆盖或替换储存在其他地址的数据，导致段错误等情况。

**Code Infection Attacks代码注入攻击**：即通过缓冲区溢出使得函数的返回值被覆盖，而跳转到其他    地址执行代码。（详情见Attack Lab）

**Worms and Viruses蠕虫与病毒**：

- 蠕虫：一个计算机程序，可以自己运行自己并且可以扩散/传播/繁殖（propagate）到其他地方；

- 病毒：一串代码，无法自动运行，而是将自己加入（攻击）其他程序

### Protection

1. **Avoid Overflow Vulnerabilities in Code避免使用相关库函数**：
   `fgets->gets`、`strncpy->strcpy`、避免使用`scanf`函数和`%s`，而是使用`fgets`或使用`%ns`（`n`为`scanf`可以读取的字符串最大长度）

2. **System-Level Protections系统级保护措施？ASLP栈随机化！**
   栈随机化，表示地址空间布局随机化， 即每次程序运行时地址都是变化的，在栈上分配的空间也是随机的。
   另一种方法是**不可执行的代码段（Nonexecutable code segments）**，在x86-64架构上，相较于原有x86架构的“只读”（read-only）或“可写”（writeable），增加了“执行”（execute）权限，而栈堆被标记为不可执行（non-executable）。

3. **Stack Canaries栈金丝雀**：
   
   - 编译器在代码生成时会插入一个特殊的保护值（"金丝雀"）到栈内局部缓冲区的末尾与关键控制信息（比如返回地址）之间。
   - 当函数执行完成前，检查金丝雀值是否仍然保持不变。如果攻击者利用缓冲区溢出覆盖了栈上的数据，金丝雀值也会随之改变。
   - 如果检测到金丝雀值被破坏，程序会立即终止，而不是让攻击者获得对程序的控制权。
   
   `GCC`编译器提供了`-fstack-protector`方法来启用该方法。在现代版本，该选项是默认开启的。

#### 基于返回导向编程的攻击（Return-Oriented Programming Attacks, ROP）

**挑战（对攻击者来说）：**

- **栈随机化**：栈地址的随机化使得攻击者难以预测缓冲区的具体位置。
- **栈的不可执行性**：将栈标记为不可执行，使得攻击者难以直接插入并执行二进制代码。

**替代策略（Alternative Strategy）：**

- 利用**现有的代码**：
  
  例如，来自标准库（`stdlib`）的库代码。

- 将现有代码片段串联起来以实现所需的功能。
  
  **注意**：这种方法**不能绕过栈金丝雀（stack canaries）的保护**。    

**通过“代码小片段（gadgets）”构建程序：**

- 使用以 `ret` 指令（返回指令）结尾的一系列指令片段。（面向返回编程）
  - `ret` 指令的机器码表示为单字节 **0xC3**。
- 代码片段（gadgets）的内存位置在每次运行时保持固定。
- 代码片段是可执行的。

#### example#1：

```asm
00000000004004d0 <ab_plus_c>
  4004d0:  48 0f af fe imul %rsi,%rdi
  4004d4:  48 8d 04 17 lea (%rdi,%rdx,1),%rax
  4004d8:  c3
```

`4004d4`行代码实现了`rax <- rdi + rdx`，代码块（gadgets）从`4004d4`开始；

#### example#2：

```asm
<setval>
  4004d9:  c7 07 d4 48 89 c7  movl  $0xc78948d4,(%rdi)
  4004df:  c3
```

从`48`开始到`c3`的代码正好可以编码为：`movl  %rax,%rdi`和`ret`，代码判断片段从`0x4004dc`开始。

## 3.Unions联合体

`Union`的构造方式与`struct`很像，但相较于后者为每个数据分配内存，`union`会使用 占用空间最大的域 的大小分配内存。

例如：

```c
typedef union {
    float f;
    unsigned u;
} bit_float_t;

float bit2float(unsigned u){
    bit_float_t arg;
    arg.u = u;
    return arg.f;
}
```

在结构体`bit_float_t`中，浮点数`f`和无符号数`u`存储在同一地址。这一操作完全不同于类型转换。类型转换是将两者转换为最接近的数，而这个操作中，位没有发生变化，是相同的二进制数在不同数据类型下的数。

### **大端序和小端序**

大端序（Big Endian）和小端序（Little Endian）是计算机系统中数据在内存中的存储方式，主要针对多字节数据（例如`int`、`long`等）的排列顺序。

在大端序中，**高位字节**存储在内存的低地址位置，数据从高位到低位依次排列；而在小端序中，**低位字节**存储在内存的低地址位置，数据从低位到高位依次排列。

例如，一个32位整数`0x12345678`（占用4字节），在内存中的存储方式如下：

- **大端序**：内存地址依次存储为 `0x12 0x34 0x56 0x78`。
- **小端序**：内存地址依次存储为 `0x78 0x56 0x34 0x12`。

大端序的存储方式符合日常习惯，因为我们通常将高位放在前面，因此它常用于网络协议（如TCP/IP）。小端序则更适合计算机底层操作，读取数据时处理低地址优先，简化了硬件设计，因此像Intel x86和x64等绝大多数计算机系统都采用小端序。

要判断系统的字节序，可以通过编程实现。例如，C语言可以通过以下代码简单测试：

<C>

```c
#include <stdio.h>
int main() {
    int num = 0x12345678;
    char *ptr = (char *)&num;
    if (ptr[0] == 0x12)
        printf("大端序\n");
    else if (ptr[0] == 0x78)
        printf("小端序\n");
    return 0;
}
```

总结来说，大端序是“高字节→低地址”，而小端序是“低字节→低地址”。两种字节序各有其场景优势，在使用中必须根据硬件架构和协议标准选择合适的方式。
