# Lecture01：Course Overview

注：课程与书：《CSAPP》（《Computer Systems A Programmer's perspective》，中文译名《深入理解计算机系统》）在教学进度上没有关联，二者为一个整体。该笔记为课堂笔记，而非对教材的学习笔记。

## Course Theme

> Abstraction Is Good But Don't Forget Reality.

课程目的是为了让我们知道代码运行时，计算机系统发生了什么，计算机如何支持代码运行，了解工具、技巧和方法。同时也是其他学科的基础。

## Five realities

1. **Ints are not Integers, Floats are not Reals.**
   计算机中数字的表示？数值溢出 or 浮点数误差？交换律和结合律？
   （使用的工具在Linux系统叫`GDB`，在MacOS叫`LLDB`）
2. **You've Given to Know Assembly**
   通常不会用汇编语言编写程序，但是我们会学习C语言代码是如何变成机器码、如何运行等。
   我们研究x86-64指令集（64位）。
3. **Memory Matters**（Random Access Memory Is an Unphysical Abstraction）
   内存系统是现代计算机系统的重要组成部分。（随机存取内存）
   分层存储可以提供高性能的表现和较大的储存容量。
   对内存不进行边界检查~~（论为什么不要用C/C++）~~
4. **There's more to performance than asymptotic complexity.**
   从算法、数据表示、过程、以及循环来优化程序，提高性能。
5. **Computer do more than execute programs.**
   计算机系统还包括数据输入/输出（I/O系统）、网络通信等问题，不是一个孤立的系统。

## How the course fits into the CS/ECE curriculum

Programs and Data：Lab1：datalab，Lab2：bomblab，Lab3：attacklab

The Memory Hierarchy：Lab4：cachelab

Exceptional Contral Flow：Lab5：tshlab

Virtual Memory：Lab6：mallolab

Networking，and Concurrency：Lab7：proxylab

## Academic integrity

北京大学同样注重学术诚信！（虽然我也不知道逻辑查重是怎么判断以及是否具有可信性）
