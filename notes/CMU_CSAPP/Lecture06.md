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

## Loops

## Switch Statements
