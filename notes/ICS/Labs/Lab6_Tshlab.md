# TshLab

*PKU，2025Fall，ICS，TshLab*

> ⚠️ 致各位同学：
> 
> **本笔记的目的是借鉴交流，而非仅仅提供答案，<font color="red">请勿抄袭，后果自负。</font>**
> 
> 你可以参考我的想法、了解有哪些注意的地方，但是在自己实现的时候不要参考，避免抄袭。

（虽然都说这个Lab是最难的，但是我做得比 Archlab 快很多）

## 写在前面

- `tsh.c`文件请在开头注明姓名学号

- 用`make`指令进行编译

你的任务是在 `tsh.c` 文件内补全 4 个函数，实现一个简单的 shell 程序。

- `eval`：解析命令行参数。

- `sigchld_handler`：捕获 `SIGCHLD` 信号。

- `sigint_handler`：捕获来自 `ctrl+C` 的 `SIGINT` 信号。

- `sigtstp_handler`：捕获来自 `ctrl+Z` 的 `SIGTETP` 信号。

编译后运行 `./tsh` 即可测试 shell。

运行 `./runtrace -h` 获取如何使用；

运行 `./runtrace` 进行测试和评分。（其他用法参考 `writeup`）

## tine shell 要求（待实现）

- 可以不支持管道 (`|`)，但是必须支持 I/O 重定向；

- > 管道符 `|` 的作用是创建两个或多个并发运行的子进程，如果不支持 `|` ，可以认为shell中的指令是顺序的，不存在并发执行多个进程的情况，即 job 的执行是串行的。
  > 
  > 在这种情况下，我们可以认为：每个 job 唯一对应一个 process。

- 能够正常处理各种指令；

- 可以回收其僵尸子进程；

## 阅读 tsh.c

`tsh.c`中已经实现了基本的框架和数据结构，只需要补全代码即可。

### job_t

```c
struct job_t {              /* The job struct */
    pid_t pid;              /* job PID */
    int jid;                /* job ID [1, 2, ...] */
    int state;              /* UNDEF, BG, FG, or ST */
    char cmdline[MAXLINE];  /* command line */
};
struct job_t job_list[MAXJOBS]; /* The job list */
```

（参考书 P529 从键盘发送信号）

- `pid_t pid`：job 内进程的 pid；

- `int jid`：job 的 ID，在这里可以看作与 pid 等同；

- `int state`：job 状态，有：`UNDEF`未定义、`BG`后台运行、`FG`前台运行、`ST`挂起。

- `char cmdline[MAXLINE]`：命令行

所有的 job 都会被存储在一个全局变量 `job_list` 中，这是一个数组，其中每个元素都是一个 `job_t` 结构体。

### cmdline_tokens

```c
struct cmdline_tokens {
    int argc;               /* Number of arguments */
    char *argv[MAXARGS];    /* The arguments list */
    char *infile;           /* The input file */
    char *outfile;          /* The output file */
    enum builtins_t {       /* Indicates if argv[0] is a builtin command */
        BUILTIN_NONE,
        BUILTIN_QUIT,
        BUILTIN_JOBS,
        BUILTIN_BG,
        BUILTIN_FG,
        BUILTIN_KILL,
        BUILTIN_NOHUP} builtins;
};
```
