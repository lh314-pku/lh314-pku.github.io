# MallocLab

*PKU，2025Fall，ICS，MallocLab*

> ⚠️ 致各位同学：
> 
> **本笔记的目的是借鉴交流，而非仅仅提供答案，<font color='red'>请勿抄袭，后果自负</font>。**
> 
> 你可以参考我的想法、了解有哪些注意的地方，但是在自己实现的时候不要参考，避免抄袭。

MallocLab也是好评如潮啊：

> 这是北大计算机系统导论(ICS)课程经典的MallocLab(动态内存分配器实验)的完整翻译。这个实验**非常硬核**，被称为是该课程中**最具挑战性**但也**最能提升能力**的实验之一。

以及来自 A 神的“好评”：

> malloc lab 堪称 ics 课程**最难**的 Lab，没有之一。
> 
> 作为参考，我的整体实现时间达到了 15 小时，还有额外 7 个小时的代码阅读、本文撰写。总计完成用时达到了 **23 小时**。

---

MallocLab的目标是实现一个通用的动态内存分配器（Dynamic Storage Allocator），需要在`mm.c`中实现相关的 6 个函数：

- `int mm_init(void)`
- `void *malloc(size_t, size)`
- `void free(size_t *ptr)`
- `void *realloc(void *ptr, size_t size)`
- `void *calloc(size_t nmemb, size_t size)`
- `void mm_checkheap(int)`

- - - - - 

## Write Up

  先来读一下 Writeup，看看有哪些有用信息：

### 支持例程

  可以调用`memlib.c`包中的一些函数：

- `void *mem_sbrk(int incr)`：通过`incr`字节扩展堆，并返回指向一个新分配区域第一个字节的通用指针，语义与`sbrk`函数相同。

- `void *mem_heap_lo(void)`：返回堆中第一个字节的通用指针；

- `void *mem_heap_high(void)`：返回堆中最后一个字节的通用指针；

- `size_t mem_heapsize(void)`：返回当前堆大小；

- `size_t mem_pagesize(void)`：返回系统页大小（Linux为4KB）。
  
  ### 追踪驱动的驱动程序
  
  `mdriver.c`驱动程序，用于测试`mm.c`的正确性。详细使用方法去看WriteUp。
  
  ### 编程规则
  
  略。不过格外需要注意的是不能使用`libc`的`malloc`、`calloc`、`free`、`realloc`、`sbrk`、`brk`等任何与内存管理的包，也不能在`mm.c`中定义任何全局数据结构，例如数组、树或列表。但是可以声明结构体和标量变量。
  
  ### 评分细则
  
  评分总分 100，基于分配器的表现、堆检查器的质量和代码风格，其中性能分占80分。

评分通过两个指标来评估程序性能：**空间利用率**和**吞吐量**。

- 空间利用率：*Space utilization*，即驱动程序使用的总内存量与分配器使用的堆大小之间的比值。分配过程中难免出现碎片（fragmentation），优化的目的就是尽可能使碎片最小化，让空间利用率接近 1；

- 吞吐量：*Throughput*，每秒完成的平均操作数。
  评分函数是一个加权函数：
  
  $$
  P(U, T)=80(w\cdot\min(1,\frac{U-0.7}{0.9-0.7})+(1-w)\cdot\min(1, \frac{3000}{12000-3000}))
  $$
  
  也就是说，要想获得满分，我们需要超过 90% 的空间利用率和大于 12000 Kops/s 的吞吐量，加权的计算方式鼓励我们同时优化空间利用率和吞吐量。

（每年的参数可能变化，请仔细阅读Writeup。）

以及有些测试样例并不计入 U 和 T，计入成绩的测试样例用`*`标记。另外有 2 个只计入 U 的测试样例通过`u`标记，1 个只计入 T 的测试样例通过`p`标记。

另外有10分是堆一致性检查器，即考察 `mm_checkheap` 函数实现的质量。检查越彻底，作为调试工具越有质量。即你应该检查：

- 检查堆（显式列表、隐式列表、分离列表）
  - 检查每个块的地址对齐
  - 检查堆的边界
  - 检查每个块的头部/尾部的一致性：大小、前一个/后一个分配/释放位的一致性、头尾匹配的一致性
  - 检查合并：堆中没有连续的空闲块
- 检查空闲列表（显式列表、分离列表）
  - 所有 `next/prev` 指针是一致的
  - 所有空闲列表指针在 `mem_heap_lo()` 和 `mem_heap_high()` 之间
  - 通过遍历每个块并通过指针遍历空闲列表来计算空闲块，并查看它们是否匹配。
  - 每个列表桶中的所有块都落在桶的大小范围内（分离列表）。

另外还有10分属于代码风格。更加详细的要求去看Writeup。

（另外强烈建议阅读参考代码：`mm-naive.c`和`mm-textbook.c`）

## 实验过程

先用现成的`mm-textbook.c`测试：

```bash
Using default tracefiles in ./traces/
Measuring performance with a cycle counter.
Processor clock rate ~= 2000.0 MHz
...................
Results for mm malloc:
  valid  util   ops    secs     Kops  trace
   yes    86%  100000  0.005094 19629 ./traces/alaska.rep
 * yes    99%    4805  0.007150   672 ./traces/amptjp.rep
 * yes    83%    4162  0.002547  1634 ./traces/bash.rep
 * yes    56%   57716  1.286829    45 ./traces/boat.rep
 u yes    73%      --        --    -- ./traces/binary2-bal.rep
 * yes    99%    5032  0.006626   759 ./traces/cccp.rep
 * yes    74%   11991  0.025020   479 ./traces/chrome.rep
 * yes    99%   20000  0.001507 13272 ./traces/coalesce-big.rep
   yes    66%   14400  0.000094152397 ./traces/coalescing-bal.rep
   yes   100%      15  0.000006  2311 ./traces/corners.rep
 * yes    99%    5683  0.010395   547 ./traces/cp-decl.rep
 u yes    71%      --        --    -- ./traces/exhaust.rep
 * yes   100%    5380  0.008263   651 ./traces/expr-bal.rep
 * yes    91%   55092  0.363691   151 ./traces/freeciv.rep
 * yes    88%     372  0.000079  4720 ./traces/ls.rep
   yes    34%      10  0.000004  2674 ./traces/malloc.rep
   yes    28%      17  0.000004  4441 ./traces/malloc-free.rep
 p yes     --    1494  0.001146  1304 ./traces/perl.rep
   yes    27%   14401  0.050526   285 ./traces/realloc.rep
12 11     86%  171727  1.713254   100

Perf index = 39 (util) & 0 (thru) = 39/80
```