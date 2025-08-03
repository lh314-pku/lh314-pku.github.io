# Lecture03：Bits，Bytes，and Integers cont

## Addition

对于 **Unsigned Addition**，两个`w`位的数字相加的真实结果应该是`w+1`位，而通常会舍弃前面一位变成`w`位。我们可以将其视为一种模运算：$ s = UAdd_w(u, v) = (u+v)\mod{2^w} $

对于 **Two's Complement Addition**，在位运算上存在与上述相同的行为，例如对于代码：

```c
int s, t, u, v;
s = (int)((unsigned) u + (unsigned) v);
t = u + v
```

会给出`s == t`的结果。(positive overflow & negitive overflow)有时会出现超出上限的正溢出和小于下限的负溢出（以`w=4`为例）：`7+5=-4`，`(-3)+(-6)=7`。

## Negation

本质上就是加法，同上；

## Multiplication

对于（`w`位）乘法，我们可能会需要`2w`位来存储结果：

- **Unsigned**：2w bits
  $ 0\le x*y\le(2^w-1)^2 =2^{2w}-2^{w+1}+1 $

- **Two's complement** MIN：2w-1 bits
  $ x*y\ge-2^{w-1}*(2^{w-1}-1)=-2^{2w-2}+2^{w-1} $

- **Two's complement** MIN：2w bits
  $ x*y\le(-2^{w-1})^2=2^{2w-2} $

但是实际上，我们依然会截取最后`w`位，对无符号数来说，就是模运算：$ UMult_w(u,v)=u\cdot v\mod{2^w} $。但是对于补码，我们的位运算是一致的，但是仍然由余下的最高位数决定结果符号，而不考虑原来的符号。

## Shifting
