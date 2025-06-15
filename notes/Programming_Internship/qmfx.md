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

常量：True、False（对应1，0，是特殊的整数类型）

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
```

#### 输入&输出
