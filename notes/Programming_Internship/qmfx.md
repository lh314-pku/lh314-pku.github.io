[TOC]

[Part01](# Part01)

###### TOP

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

#### 一）整数类型

进制：10、2(0b)、8(0o)、16(0x)

不定长，+、-、*、%同c++，但无溢出；

/ 是浮点除法、// 是整数除法；

**是幂运算，位运算同c++。

#### 二）布尔类型

常量：`True`、`False`（对应1，0，是特殊的整数类型）

逻辑运算：and、or、not

#### 三）字符串

可以用`[]`访问其中的子串，单个字符也是子串：

```python
x = "abcdefg"
x[0]    # >>>a
x[1:3]  # [1,3)左闭右开。无声明默认为最左侧0/最右侧(n-1)
x[-1]   # {-n,...,-1}也可以作为下标
x[-3:-1]# [-3,-1)/[4, 6)
```

字符串不可以直接修改；

`+`可以直接拼接字符串，`*`可以构成重复字段；

`in`、`not in`判断子串，返回值为bool；

转换函数：`int(x)`、`float(x)`、`str(x)`、`eval(x)`

其他相关函数：

| 函数                                   | 功能                     |
| ------------------------------------ | ---------------------- |
| `len(x)`                             | 字符串长度                  |
| `str.count(x)`                       | 子串x出现次数                |
| `str.upper()`、`str.lower()`          | 转大写/小写                 |
| `str.find(x)`、`str.rfind(x)`         | 正向/反向查找子串并返回索引，未找到返回-1 |
| `str.index(x)`、`str.rindex(x)`       | 正向/反向查找子串并返回索引，未找到抛出异常 |
| `str.replace(s1, s2)`                | 替换子串s1为s2              |
| `isdigit()`、`isupper()`、`islower()`  | 是否是数字、大写、小写            |
| `startswith(x)`、`endswith(x)`        | 是否以子串x开头/结尾            |
| `strip()`、`lstrip()`、`rstrip()`      | 去除两侧、左侧、右侧空白字符         |
| `split()`                            | 字符串切割                  |
| `import re`<br/>`re.split(r_str, a)` | 多字符分隔，其中分隔串使用`\|`隔开。   |

`f-strings`：字符串格式化见下。

`r-strings`：不转义字符串。e.g.`print(r'ab\ncd') >>> ab\ncd`

#### 四）高精度浮点数decimal.Decimal

```python
import decimal
from decimal import *
a = decimal.Decimal(98765)
b = decimal.Decimal("123.223232323432424244858484096781385731294")
c = decimal.Decimal(a + b) # 精度缺省为小数点后28位
getcontext().prec = 50 # 设置精度为50位
c = decimal.Decimal(a + b) # 精度缺省为小数点后50位
```

#### 五）类型转换函数

```python
int(x[, base])# 将字符串转为整数
float(x)
str(x)
repr(x)       # 返回对象的“官方”字符串表示形式
chr(x)        # 将整数转换为字符
ord(x)        # 将字符转换为整数编码值(16位)
eval(x)       # 将字符串视为表达式
strs = ['a','b','c','d']
str = ''.join(strs)# 列表到字符串转换
```

#### 六）输入&输出

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

#### 七）语句

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

#### 八）算术表达式（略，见上）

#### 九）字符编码

- ASCII（ANSI）编码

- GB2312（GBK）编码

- Unicode 编码

- utf8 编码

字符串与字节流的互化：

```python
bs = 'ABC 好的'.encode('utf-8')
print(bs)^^I^^I  # >>>  b'ABC\xe5\xa5\xbd\xe7\x9a\x84'
print(len(bs))^^I# >>> 9
bs = 'ABC 好的'.encode('utf-8')
bs = bytes('ABC 好的', encoding = "gbk")# 不可变序列
print(bs)^^I^^I  # >>>  b'ABC\xba\xc3\xb5\xc4'
print(len(bs))   # >>> 7
s = str(bs, encoding = "gbk") # ABC 好的
print(str(b'abc\xe5\xa5\xbd\xe7\x9a\x84',encoding = "utf-8"))^^I # ABC 好的
```

python默认源程序为 utf8 编码，.py文件应该有开头的 BOM 标志。

若要运行 GBK 编码的源程序，需要在开头加`# -*- coding: GBK -*-`。

[BACK](###### TOP)

# Part 02
