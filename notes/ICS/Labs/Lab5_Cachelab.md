# CacheLab

*PKU，2025Fall，ICS，CacheLab*

> ⚠️ 致各位同学：
> 
> **本笔记的目的是借鉴交流，而非仅仅提供答案，<font color='red'>请勿抄袭，后果自负。</font>**
> 
> 你可以参考我的想法、了解有哪些注意的地方，但是在自己实现的时候不要参考，避免抄袭。

## 预处理（

实验开始前，请确保安装了 Python3 和 valgrind。运行如下指令安装 valgrind。

```bash
sudo apt-get install valgrind
```

Python3 已经在 Class Machine 上安装完成。

实验包含两个阶段：

在第一部分，你需要编写一个小的 C 程序（大约 200-300 行），模拟硬件缓存内存的行为。

在第二部分，你需要优化一个小型的矩阵转置函数，目标是减少缓存未命中的次数。

## Trace Files

Valgrind 内存跟踪有如下形式：

```textile
I 0400f7d4, 8
 M 0421c7f0, 4
 L 04f6b868, 8
 S 7ff0005c8, 8
```

格式为：操作类型 地址, 大小

上述指令分别表示：指令加载、数据加载、数据存储、数据修改

## PartA

需要在`csim.c`内编写一个缓存模拟器，以 `valgrind` 内存跟踪作为输入，模拟缓存内存在此跟踪上的命中/未命中行为，并输出总命中数、未命中数和驱逐次数。当选择要驱逐的缓存行时，它使用 LRU（最近最少使用）替换策略。

该模拟器接受如下参数：

```bash
./csim-ref [-hv] -e <s> -E <E> -b <b> -t <tracefile>
```

- `-h`：可选，输出使用信息

- `-v`：可选：显示跟踪信息

- `-s <s>`：索引位数（S = 2 ^ s，number of sets）

- `-E <E>`：结合数（number of lines per set）

- `-b <b>`：块的位数（B = 2 ^ b，block size）

- `-t <tracefile>`：valgrind文件名

最后运行：

```bash
./test-csim
```

即可评分：

```bash
                        Your simulator     Reference simulator
Points (s,E,b)    Hits  Misses  Evicts    Hits  Misses  Evicts
     3 (1,1,1)      11       8       6      11       8       6  traces/yi2.trace
     3 (4,2,4)       4       5       2       4       5       2  traces/yi.trace
     3 (2,1,4)       2       3       1       2       3       1  traces/dave.trace
     3 (2,1,3)     694     453     449     694     453     449  traces/mem.trace
     3 (2,2,3)     201      37      29     201      37      29  traces/trans.trace
     3 (2,4,3)     212      26      10     212      26      10  traces/trans.trace
     3 (5,1,5)     231       7       0     231       7       0  traces/trans.trace
     6 (5,1,5)  265189   21777   21745  265189   21777   21745  traces/long.trace
    27

TEST_CSIM_RESULTS=27
```

## PartB

需要我们优化32x32、64x64、60x68的矩阵转置函数，以减少miss的次数。

所用到的参数：$(s = 5, E = 1, b = 5)$，即有32个set、每个set只有1个line，每个line有32字节的**直接映射高速缓存**，一共1024个字节，可以存储32 * 8 = 256个`int`。

在这个Lab中，我们会发现：每个矩阵相差8的行序号内连续的 8k ~ 8k+7 个元素会映射到同一个Line，而A、B矩阵的相同位置元素也会映射到同一Line。 

### 32x32

理论最优解256misses：

### 64x64

理论最优解1024misses：[CSAPP - Cache Lab的更(最)优秀的解法 - 知乎](https://zhuanlan.zhihu.com/p/387662272)

### 60x68

## 最终结果

运行：

```bash
python3 ./driver.py
```

```bash
Cache Lab summary:
                        Points   Max pts      Misses
Csim correctness          27.0        27
Trans perf 32x32           8.0         8         260
Trans perf 64x64           8.0         8        1196
Trans perf 60x68          10.0        10        1575
          Total points    53.0        53
          Final points    88.0        88
```
