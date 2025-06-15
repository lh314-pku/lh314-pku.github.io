# Part01

python中重视缩进，需要一致的缩进，类似于c++的分号。

变量无需声明，也不在乎类型。

5个标准数据类型：数字 **(int/float/complex)**、字符串 **(str)**、列表 **(list)**、元组 **(tuple)**、字典 **(dict)**。（都相当于类名）

可以使用 **isinstance** 查询数据类型：

```python
a = 123
isinstance(a, int) #>>True
b = "str"
isinstance(b, int) #>>False
```

**"is"** 和 **"=="**：前者比较地址，后者比较内容。

python中变量存储的都是地址（指针），赋值操作本质上是将变量指向某处。

#### 整数类型

进制：10、2(0b)、8(0o)、16(0x)

不定长，+、-、*、%同c++，但无溢出；

/ 是浮点除法、// 是整数除法；

**是幂运算，位运算同c++。

#### 布尔类型

常量：`True`、`False`（对应1，0，是特殊的整数类型）

逻辑运算：and、or、not

#### 高精度浮点数decimal.Decimal

```python
import decimal
from decimal import *
a = decimal.Decimal(98765)
b = decimal.Decimal("123.223232323432424244858484096781385731294")
c = decimal.Decimal(a + b) # 精度缺省为小数点后28位
getcontext().prec = 50 # 设置精度为50位
c = decimal.Decimal(a + b) # 精度缺省为小数点后50位
```

#### 类型转换函数

```python
int(x[, base])# 将字符串转为整数
float(x)
str(x)
repr(x)       # 返回对象的“官方”字符串表示形式
chr(x)        # 将整数转换为字符
ord(x)        # 将字符转换为整数编码值(16位)
strs = ['a','b','c','d']
str = ''.join(strs)# 列表到字符串转换
```

#### 输入&输出

`input()`：获取一整行的输入，类似于c++的`std::getline()`

`str.split(separator, maxsplit)`：字符串切割，前者确定切割原则，后者确定切割次数。默认为空格和无限次。返回值为list。通常用法：`lst = input().split()`

`map(function, iterable, ...)`：将一个函数作用于一个或多个可迭代对象的每个元素，并返回一个包含结果的迭代器。通常用法：`nums = list(map(int, input().split()))`

`print(*objects, sep=' ', end='\n', file=sys.stdout, flush=False)`：标准输出函数。可接受一个或多个对象，`sep`是行内分隔符，`end`是结束符，`file`可以写入文件，`flush`用于控制输出时是否立即刷新缓冲区。必须以关键字参数的形式给出。

##### 1.字符串的格式化：

- 旧式%格式化：`“I'm %s, I'm %d years old.” % ('LiHua', 10)`

- `str.format()`方法：`“I'm {}, I'm {} years old.”.format('LiHua', 10)`

- `f-strings`：如下

- ```python
  name, age = "LiHua", 10
  str = f"I'm {name}, I'm {age} years old."
  ```

##### 2.重定向

```python
import sys
f = open(in.txt, "r")
g = open(out.txt, "w")
sys.strin = f
sys.stdout = g
f.close()
g.close()
```

#### 语句

##### 1.赋值语句

特点：同步赋值

##### 2.分支语句

python只有`if-elif-else`结构的分支语句

```python
if <condition>:
    <statements>
elif <condition>:
    <statements>
else:
    <statements>
```

##### 3.循环语句

python有`while`循环语句和`for`循环语句

```python
while <condition>:
    <statements>
else:
    <statements>
```

```python
for <variable> in <sequence>:
    <statements>
else:
    <statements>
```

#### 算术表达式

# TOBE DONE
