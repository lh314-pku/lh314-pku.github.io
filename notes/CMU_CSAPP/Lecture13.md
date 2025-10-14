# Lecture13：Linking

## Linking

考虑如下两个文件：

```c
/* main.c */
int sum(int *a, int n);
int array[2] = {1, 2};
int main(){
    int val = sum(array, 2);
    return val;
}
```

```c
/* sum.c */
int sum(int *a, int n){
    int i, s = 0;
    for (i = 0; i < n; i++){
        s += a[i];
    }
    return s;
}
```

### Static Linking

```bash
linux> gcc -Og -o prog main.c sum.c
linux> ./prog
```

GCC会调用一系列翻译器（预处理器`cpp`将`main.c`翻译为ASCII中间文件`main.i`，编译器`cc1`将`main.i`翻译为ASCII汇编语言文件`main.s`，汇编程序`as`将`main.s`翻译为目标文件`main.o`），得到`main.o`和`sum.o`。

链接器`ld`的作用就是将`.o`文件和一些必要的系统文件放在一起，链接起来并创建一个单个的可执行文件`prog`。

`.c`文件称为源文件，`.o`被分开编译，称为**relocatable object files可重定位目标文件**，而最后的可执行文件称为**Fully linked executable object file完全链接的可执行目标文件**。

#### 为什么分开编译最后链接？

- **Modularity模块化**
  这可以让代码分为更小的部分，而不是一个包含全部代码的文件，同时还可以定义函数库（C标准库、Math库）。

- **Efficiency效率**
  时间效率上，更改一个源文件只需要重新编译它而不需要重新编译其他源文件；空间效率上，可以将常用函数打包/聚合到一个文件中，实际编译并链接到程序中的是实际调用和函数

#### 链接器做了什么？

**Step1：Symbol resolution符号解析**

链接器会定义/引用**Symbol**（全局变量和函数），并（被汇编器）存储在 *Symbol table* 中。*Symbol table* 是一个struct的数组，每个结构体包含符号的名字、大小、所在位置。链接器会将每个符号引用与定义相关联。

**Step2：Relocation重定位**

- 将分离的代码段和数据段合并为单一段。

- 将符号从 `.o` 文件中的相对位置（函数地址为其在模块中的偏移量）重新定位到可执行文件中的最终绝对内存位置。

- 更新对这些符号的所有引用以反映它们的新位置。

More details：

#### 三种Object file（模块）

- **可重定位目标文件relocatable object file**（`.o`文件）
  汇编器的输出（不是二进制文件），不能以任何形式加载到内存中，实际使用前需要链接器对其操作。每个 `.o` 文件都由一个源文件（`.c` 文件）生成。

- **可执行目标文件executable object file**（`a.out`）
  包含代码和数据，格式允许直接复制到内存中并执行。

- **共享目标文件Shared object file**（`.so`文件）
  特殊类型的可重定位目标文件，可以加载到内存并动态链接，在加载时或运行时使用。在Windows中被称为 **Dynamic Link Libraries静态链接库**（DLLs）。

#### 可执行与可链接格式（ELF）

**ELF**（Executable and Linkable Format）是一种标准二进制文件格式，用于存储和表示程序的代码和数据。它提供了一种通用的格式，使用于上述的三种文件，无论是目标文件、可执行文件，还是共享库文件，它们都是 ELF 的子类型。**通用名称**：ELF 二进制文件。内部结构：

- **ELF header**（ELF头部）
  
  - 字长、字节序、文件类型（`.o`、`exec`、`.so`）、机器类型等。

- **Segment header table**（段头表）
  
  - 页大小、虚拟地址、内存段（sections，段）、段大小。

- `.text` section（代码段）
  
  - 存放代码。

- `.rodata` section（只读数据段）
  
  - 存放只读数据：如跳转表等。

- `.data` section（数据段）
  
  - 存放已初始化的全局变量。

- `.bss` section（未初始化数据段）
  
  - 存放未初始化的全局变量。
  - **Block Started by Symbol**（符号开始的块）。
  - **Better Save Space**（更好地节省空间）。
  - 有段头，但实际不占用空间。

- `.symtab` section（符号表段）
  
  - 符号表。
  - 存放过程（函数）和静态变量的名称。
  - 段的名称与位置。

- `.rel.text` section（.text 段的重定位信息）
  
  - `.text section`的重定位信息。
  - 可执行文件中需要修改的指令地址。
  - 修改指令所需的信息。

- `.rel.data` section（.data 段的重定位信息）
  
  - `.data section`的重定位信息。
  - 合并后的可执行文件中需要修改的指针数据的地址。

- `.debug` section（调试段）
  
  - 保存符号调试信息（用于 `gcc -g` 选项）。
  - 即将源代码中行号与机器代码中行号相关联的信息。

- **Section header table**（段头表）
  
  - 每个段的偏移量和大小。

#### Linker Symbols

链接器有三种符号：

**Global symbols**（全局符号）

- 由模块 **`m`** 定义的，可被其他模块引用的符号。
- 例如：非 **static** 的 C 函数和非 **static** 的全局变量。

**External symbols**（外部符号）

- 由模块 **`m`** 引用但由其他模块定义的全局符号。

**Local symbols**（本地符号）

- 由模块 **`m`** 定义并仅供模块 **`m`** 引用的符号。
- 例如：用 **static** 属性定义的 C 函数和全局变量。
- 本地链接符号**不是**本地程序变量。

## Case study: Library interpositioning库打桩

Library interpositioning库打桩：允许使用链接实际拦截如C标准库中函数的调用。
