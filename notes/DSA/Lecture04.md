# 字符串

## 1.字符串

特殊的线性表，以字符为元素。

字符编码：8 bits，ASCII（GB、CJK、UNICODE）

字串Substring：字符串的连续片段

| 操作类别  | 方法              | 描述                |
| ----- | --------------- | ----------------- |
| 子串    | substr()        | 返回一个串的子串          |
| 拷贝/交换 | swap()          | 交换两个串的内容          |
|       | copy()          | 将一个串拷贝到另一个串中      |
| 赋值    | assign()        | 把一个串、一个字符串、一个子串赋值 |
|       | =               | 把一个串或一个字符赋值给另一个串中 |
| 插入/追加 | insert()        | 在给定位置插入一个字符串、多个字符 |
|       | append()/+=     | 将一个或多个字符追加到另一个串后面 |
| 拼接    | +               | 通过将一个串放置到另一个串后面构新 |
| 查询    | find()          | 找到并返回一个子串的开始位置    |
| 替换/清除 | replace()       | 替换一个字符串或一个串的子串    |
|       | clear()         | 清除串中的所有字符         |
| 统计    | size()/length() | 返回串中的字符数量         |
|       | max_size()      | 返回串允许的最大长度        |

- `char& string::operator[](int n);`：重载`[]`，下标访问

- `int string::find(char c,int start=0);`：按字符定位下标；

- `int string::rfind(char c,int pos=0);`：反向寻找，定位尾部出现的字符。

## 2.存储结构及算法实现

```cpp
private:   // 具体实现的字符串存储结构
char *str; // 数据表示
int size;  // 串的当前长度
```

例如：`String s1 = "Hello";`，`str`：H、e、l、l、0、\0。`size`：5.

字符串比较：

```cpp
int strcmp(const char *s1, const char *s2) {
    int i = 0;
    while (s2[i] != '\0' && s1[i] != '\0') {
        if (s1[i] > s2[i])
            return 1;
        else if (s1[i] < s2[i])
            return -1;
        i++;
    }
    if (s1[i] == '\0' && s2[i] != '\0')
        return -1;
    else if (s2[i] == '\0' && s1[i] != '\0')
        return 1;
    return 0;
}
// 或者采用更加简单的：
int strcmp_1(char *d, char *s) {
    int i;
    for (i = 0; d[i] == s[i]; ++i) {
        if (d[i] == '\0' && s[i] == '\0')
            return 0; // 两个字符串相等
    }
    // 不等, 比较第一个不同的字符
    return (d[i] - s[i]) / abs(d[i] - s[i]);
}
```

## 3.模式匹配

模式匹配：在目标T中寻找一个给定的模式P的过程。

### 3.1 朴素算法（穷举法）

```cpp
int FindPat1(string S, string P, int startindex) {
    // 从S末尾倒数一个模式长度位置
    int LastIndex = S.length() - P.length();
    int count = P.length();
    // 开始匹配位置startindex的值过大，匹配无法成功
    if (LastIndex < startindex)
        return (-1);
    // g为的游标，用模式P和S第g位置子串比较，若失败则继续循环
    for (int g = startindex; g <= LastIndex; g++) {
        if (P == S.substr(g, count))
            return g;
    }
    // 若for循环结束，则整个匹配失败，返回值为负
    return (-1);
}
int FindPat2(string T, string P, int startindex) {
    // 从末尾倒数一个模板长度位置
    int LastIndex = T.length() - P.length();
    // 开始匹配位置startindex的值过大，匹配无法成功
    if (LastIndex < startindex) return (-1);
    // i是指向T内部字符的游标，j是指向P内部字符的游标
    int i = startindex, j = 0;
    while (i < T.length() && j < P.length()) {  // “<=”呢？
        if (P[j] == T[i]) {
            i++;
            j++;
        } else {
            i = i - j + 1;
            j = 0;
        }
    }
    // 若匹配成功，则返回该子串的开始位置；若失败，函数返回值为负
    if (j >= P.length())     // “<” 可以吗？
        return (i - j);
    else
        return -1;
}
```

以上是穷举法的两种实现，以及一种更加简洁的表示：

```cpp
int FindPat_3(string T, string P, int startindex) {
    // g为T的游标，用模板P和T第g位置子串比较，
    // 若失败则继续循环
    for (int g = startindex; g <= T.length() - P.length(); g++) {
        for (int j = 0; ((j < P.length()) && (T[g + j] == P[j])); j++)
            ;
        if (j == P.length())
            return g;
    }
    return (-1);  // for结束，或startindex值过大，则匹配失败
}
```

但是穷举法最坏情况下的开销是$O(m\cdot n)$，效率低下。于是有了**KMP算法**。

### 3.2 KMP算法

（略）
