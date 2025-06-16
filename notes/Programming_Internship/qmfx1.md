###### <a id="TOP">目录</a>

[Part01](#1)……[Part02](#2)……[Part03](#3)……[Part04](#4)

# <a id="1">Part01</a>

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

[BACK](#TOP)

# <a id="2">Part 02</a>

#### 一）split 函数

`x.split()`的值是一个列表，包含字符串 x 经空格、制表符、换行符分隔得到的所有子串。

也应该区分`x.split()`和`x.split('\t')`等结果。

#### 二）lambda 表达式

形式：`lambda arguments: expression`其中参数可以缺省。例如：

```python
k = lambda x, y: x + y
print(k(4,5)) # >>> 9
```

#### 三）元组tuple

元组由数个逗号分隔的值组成，前后可加括号。

元组的元素引用不可改变，但是元素本身（例如列表等）可以修改。

```python
empty = ()    # 空元组
a = ‘hello',  # 单元素元组，注意加逗号
b = ('hello',)# 同上，不加逗号则为字符串
```

可以通过下标访问元组`x[a]`，也可以类似字符串进行分隔`x[a:b]`。

可以通过`+`拼接元组，通过`*`构造重复元组。（完全和字符串一样啊喂）

比大小？逐项相比。如果其一为另一的前缀，则较短者小。

元组不可以使用`sort`函数排序（引用不可修改），只能通过`sorted`函数获得排序后结果。

```python
print((1,'ok') < (2, 'a', 'ok'))    # >>>True
print((1,'ok') < (1, 'ok', 56))     # >>>True
print((1,'ok', 199) < (1, 'ok', 56))# >>>False
```

#### 四）列表list

列表可以有 0 到任意多个元素，元素可以通过下标访问。

可以使用`in`判断列表是否包含某个元素。

列表同样可以类似于元组和字符串进行切片`x[a:b]`，返回新的列表。

列表的元素是可以修改的，可以直接在原列表上修改。

对于列表来说，`+=`和`+`是不同的。前者是在原地添加，后者则创建了新的列表。

```python
a = [1,2,3,4]
b = a    # a 和 b 是同一列表
c = a[:] # c 和 a 不是同一列表，c 是 a 的拷贝
a[0] = 5 # [5,2,3,4]
b += [10]# [5,2,3,4,10]
print(c) # >>> [1,2,3,4]
```

拷贝的实质是将每个元素的引用重复构建了一遍，并非同一个列表。

对于拷贝来说，原始列表的变化也会反映到拷贝列表上，例如：

```python
a = [1, [2]]
b = a[:]
b.append(4)   
# b = [1, [2], 4], a = [1, [2]]
a[1].append(3)
# b = [1, [2, 3], 4], a = [1, [2, 3]]
```

若想两者完全独立，需要**深拷贝**：

```python
import copy
a = [1, [2]]
b = copy.deepcopy(a)
b.append(4)   
# b = [1, [2], 4], a = [1, [2]]
a[1].append(3)
# b = [1, [2], 4], a = [1, [2, 3]]
```

**列表生成式**：通过表达式和for循环创建列表（可以加入筛选）：

```python
[x * x for x in range(1, 11)]
#[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
[x * x for x in range(1, 11) if x % 2 == 0]
#[4, 16, 36, 64, 100]
[m + n for m in 'ABC' for n in 'XYZ']
#['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ']
L = ['Hello', 'World', 18, 'Apple', None]
[s for s in L if isinstance(s, int)]
#[18]
```

**相关函数**：

| 函数                            | 功能                     |
| ----------------------------- | ---------------------- |
| `append(value)`               | 在列表末尾加入元素              |
| `extend(list)`                | 添加其他列表的元素              |
| `insert(index, velue)`        | 插入元素                   |
| `remove(value)`               | 删除元素                   |
| `reverse()`                   | 反向                     |
| `index(value[, start[,end]])` | 查询（第一处）索引              |
| `len(x)`                      | 返回列表长度                 |
| `max(list)`、`min(list)`       | 返回列表中的最大、最小值           |
| `list(seq)`                   | 元组转列表（反向用`tuple(seq)`） |
| `count(value)`                | 某元素出现次数                |
| `pop([index = -1])`           | 从末尾删除元素                |

`map(function, sequence)`：将一个列表（元组）映射到另一个列表（元组）。

```python
def abc(a,b,c):
    return a * 100 + b * 10 + c
l1 = [1,2,3]
l2 = [4,5,6]
l3 = [7,8,9]
x = list(map(abc, l1, l2, l3))
print(x) # >>> [147, 258, 369]
```

`filter(function, sequence)`：按照所定义的函数过滤掉列表（元组）中的一些元素。

`reduce(function, iterable[, initializer])`：将一个列表按某个函数累积起来。

```python
from functools import reduce
def f(x, y):
    return x+y
l = [1, 2, 3, 4, 5]
print(reduce(f, l))    # >>> 15
print(reduce(f, l, 10))# >>> 25
```

比大小逻辑同元组。列表支持`sort`和`sorted`。`sort`函数接受一个比较函数/过滤器，以关键字参数`key`的形式给出，可以传入函数和 lambda 表达式。

```python
def myKey(x):
    rturn x % 10
a = [25,7,16,33,4,1,2]
a.sort(key = myKey)   # >>> [1,2,33,4,25,16,7]
sorted("This is a test string from Andrew".split(), key = str.lower)
# >>> ['a', 'Andrew', 'from', 'is', 'string', 'test', 'This']
# 不区分大小写排序
```

```python
from operator import *
students = [('John', 'A', 15), ('Mike', 'B', 12),
            ('Mike', 'C', 18), ('Bom', 'D', 10)]
students.sort(key = lambda x : x[2])    # 按年龄排序
sorted(students, key = itemgetter(0, 1))# 先按姓名后按成绩排序
students.sort(key = lambda x : x[1], reverse = True)
# 按成绩从大到小排序
```

#### 五）字典dict

字典的元素是“键值对”，可以根据“键”来查找“值”。“键”必须是可哈希的。

格式：`d = {key1 : value1, key2 : value2}`

查找的平均时间复杂度是`O(1)`，不同元素的键必须不同且不可变。

创建：

```python
scope = {}    # 空字典
scope['a'] = 1# 添加元素 ’a‘ : 1
items = [('name', 'Gumby'), ('age', 42)]
d1 = dict(items)# {'name' : 'Gumby', 'age' : 42}
d2 = dict(name='Gumby', age=42)
# {'name' : 'Gumby', 'age' : 42}
```

**相关函数**：

| 函数                    | 功能                  |
| --------------------- | ------------------- |
| `dict.items()`        | 取字典元素的集合（元素是键值对/元组） |
| `dict.keys()`         | 取字典的键集合             |
| `dict.values()`       | 取字典的值集合             |
| `dict.clear()`        | 清空                  |
| `dict.copy()`         | 浅拷贝                 |
| `copy.deepcopy(dict)` | 深拷贝                 |

#### 六）集合set

集合中的元素是可修改的且不重复的。元素没有顺序，且插入时会自动去重。

集合也可以进行快速查找，查找平均复杂度为`O(1)`。

| 函数                          | 功能                |
| --------------------------- | ----------------- |
| `s.add(x)`                  | 添加x到s中            |
| `s.update(x)`               | 将集合/列表/元组/字典等x并入s |
| `s.discard(x)`              | 从s中移除x，无异常        |
| `s.remove(x)`               | 从s中移除x，不存在x会引发异常  |
| `s.clear()`                 | 清空                |
| `s.pop()`                   | 随机删除并返回           |
| `x in s`                    | 判断x是否在s中          |
| `s.union(x)`                | 取s与x的并集，不改变s和x    |
| `s.intersection(x)`         | 取s与x的交集           |
| `s.difference(x)`           | 取在s中但不在x中的元素集合    |
| `s.symmetric_difference(x)` | 取s与x的对称差集         |
| `s.issubset(x)`             | 判断s是不是x的子集        |
| `s.issuperset(x)`           | 判断x是不是s的子集        |

#### 七）函数

类似c++，但是并不需要声明参数和返回值的类型，可以（以元组形式）返回多个值，形参是实际参数的一个拷贝，默认参数和实参带名字。

Python函数可以接受个数不定的参数，例如：

```python
def func1(a, *b):   # * 将列表/元组解包为位置参数
    print(b)
c = [1,2,3]
func1(1, 2, 'ok', c)# >>> (2, 'ok', [1,2,3])
```

```python
def func2(**b):# ** 将字典解包为关键词
    print(b)
a = dict(p1=2, p2=3, p3=4)
func2(**a)     # >>> {'p1':2, 'p2':3, 'p3':4}
```

```python
def func(a, b, c):
    print(a, b, c)
params = {"a": 1, "b": 2, "c": 3}
func(**params) # 等价于 func(a=1, b=2, c=3)
```

函数中的参数默认为局部变量，调用全局变量需要加`global`声明。

#### 八）Python内置函数、退出程序和跨文件

python内置函数，包括：基本类型转换函数（见上）、`max/min`函数、`print`函数等。

退出程序：`exit()`。

跨文件：

```python
# t.py
def hello()
    print('Hello from t')
haha = "ok"
```

```python
# a.py
from t import hello, haha
# or: from t import *
hello()                # >>> Hello from t
print(f'haha = {haha}')# >>> ok
```

[BACK](#TOP)

# <a id="3">Part03</a>

#### 面向对象编程（评价是不如c++）

python中所有类派生自object类，有以下成员函数：

| 函数           | 功能                          | 函数                | 功能                      |
| ------------ | --------------------------- | ----------------- | ----------------------- |
| `__init__`   | 构造函数                        | `__del__`         | 析构函数                    |
| `__eq__`     | equal：==<br/>只构造eq的对象是不可哈希的 | `__hash__`        | hash:<br/>返回对象的哈希值，使可哈希 |
| `__lt__`     | less than：<                 | `__le__`          | less or equal：<=        |
| `__gt__`     | greater than：>              | `__ge__`          | greater or equal：>=     |
| `__ne__`     | not equal：!=                | `__add__`：+       | `__sub__`：-             |
| `__mul__`：*乘 | `__pow__`：**                | `__truediv__`：/   | `__floordiv__`：//       |
| `__mod__`：%模 | `__lshift__`：<<左移           | `__rshift__`：>>右移 | `__and__`：and与          |
| `__or__`：\|或 | `__xor__`：^异或               | `__invert__`：~否   | 后面六个是位运算                |
| `__str__`    | 强制转字符串                      | `__repr__`        | 强制转换可执行字符串              |

补：+=是`__iadd__`；`__add__`对象在前，对象在后使用`__radd__`；重载索引`[]`用`__getitem__`；`__call__`类似于c++中的`operator()`，可以将对象视为函数。

一个类的构造函数和析构函数只能有一个。

类的成员变量可以随时添加，`self.{name} = `.。

静态成员变量不需要加`self.`，类似于c++的静态变量，为类所有。

- `xx`：公有变量；

- `_xx`：约定私有变量，类对象和子类可以访问，`import`无法访问，通过`__all__ = ["_xx"]`显式地允许`import`

- `__xx`：完全私有变量，会触发Python的名称重整机制，不可直接访问，可以在类内或在外部通过`_ClassName__xx`访问。

`property`我觉得没什么用，暂留（

python类内方法有实例方法、静态方法和类方法。

- **实例方法**：第一个参数通常为`self`，通过实例对象调用。

- **静态方法**：通过装饰器`@staticmethod`声明，不与类的实例绑定，也不与实例的属性直接交互，直接通过类名调用，不能访问类或实例的任何属性或方法。

- **类方法**：通过装饰器`@classmethod`声明，且第一个参数为`cls`，表示类本身，可以在没有实例的情况下调用，主要用途包括访问和修改类级别的属性和方法，实现多个构造函数（工厂方法），以及执行与类相关的操作，只能操作静态变量。

由于Python函数不会显式地声明类型，所以任何函数都是相当于模板。

继承和多态同c++（略）（当然也包括基类/派生类指针的关系）

```python
class A:
    pass
class B(A):
    pass
a, b = A(), B()
print(isinstance(a, A)) # >>> True
print(isinstance(b, A)) # >>> True
print(isinstance(a, B)) # >>> False
print(isinstance(b, B)) # >>> True
```

#### 函数式程序设计

- 函数可以作为变量

- 函数可以作为函数的参数

- lambda 表达式可以作为函数的参数和返回值

#### 迭代器(Iteration)

可迭代对象：可以用`for i in x:`形式遍历的对象，必须实现迭代器协议，即实现：

- `__iter__()`：返回对象本身（迭代器）

- `__next__()`：返回下一个元素

```python
x = [1,2,3,4]
it = iter(x)
while True:
    try:
        print(next(it))
    except StopIteration:
        break
# >>> 1 2 3 4 (注意分行)
```

迭代器的实现可以在类内实现，也可以单独实现迭代器类：

```python
class MyRange:
    def __init__(self, n):
        self.idx = 0
        self.n = n
    def __iter__(self):
        return self
    def __next__(self):
        if self.idx < self.n:
            val = self.idx
            self.idx += 1
            return val
        raise StopIteration()
```

```python
class MyRange:
    def __init__(self, n):
        self.n = n
    def __iter__(self):
        return MyRangeIteration(self.n)
class MyRangeIteration:
    def __init__(self, n):
        self.i = 0
        self.n = n
    def __iter__(self):
        return self
    def __next__(self):
        if self.i < self.n:
            i = self.i
            self.i += 1
            return i
        else:
            raise StopIteration
```

#### 生成器(Generator)

生成器：一种延时求值对象，内部包含计算过程，真正需要时才完成计算。

```python
a = (i * i for i in range(5))
print(a) #  <generator object <genexpr> at 0x02436C38>
for x in a:
    print(x, end=" ")
# >>> 0 1 4 9 16
```

```python
matrix = ((i*3+j for j in range(3)) for i in range(3))
# matrix 是一个以生成器为元素的生成器
for x in matrix:
    for y in x:
        print(y, end=" ")
# >>> 0 1 2 3 4 5 6 7 8
```

yield语句：将所在函数变成一个生成器，调用时不会立刻执行，而是以yield作为“断点”，遇到yield就暂停，并且返回（抛出）yield所在行的值。（byd这么个破玩意搞这么难懂 ，[参考]([python中yield的用法详解——最简单，最清晰的解释_yield python-CSDN博客](https://blog.csdn.net/mieleizhi0522/article/details/82142856))）

注：没有执行`next`或`send(None)`前，不能`send(x)`(x非None)

可以用`next()`或for循环逐步进行，也可以通过`send(x)`传入参数。下举两例：

```python
def foo():
    print("starting...")
    while True:
        res = yield 4
        print("res:",res)
g = foo()
print(next(g)) # >>> staarting... >>> 4
print("*"*20)  # >>> ********************
print(next(g)) # >>> res: None    >>> 4
```

```python
# 实现斐波那契数列
def fibonacci(n):  # 生成器函数 - 用于求斐波那契数列前 n 项
    a, b, counter = 0, 1, 0
    while counter <= n:
        yield a
        a, b = b, a + b
        counter += 1

f = fibonacci(10)  # f 是一个迭代器，由生成器返回生成
while True:
    try:
        print(next(f), end=" ")
    except StopIteration:
        break
```

┬─┬ ノ('-'ノ)想要更多案例……自己去看课件(╯°Д°)╯︵ ┻━┻（反正我看不出来这东西有什么用）

[BACK](#TOP)

# <a id="4">Part04</a>

[BACK](#TOP)

---

tmd不想施工了

烦死了
