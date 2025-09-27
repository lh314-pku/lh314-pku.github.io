# Lecture02 线性表

**线性结构**：二元组，即**节点**与**前驱/后继关系**。有唯一的开始结点（无前驱）和终止结点（无后驱），其他均为内部结点。

## 线性表

**逻辑结构**：长度、表头Head，表尾Tail，当前位置(Current position)

**存储结构**：

- 顺序表：按索引值从小到大存放在一片相邻的连续区域，存储密度为1；

- 链表：分为单链表、双链表、循环链表等

**分类(按操作)**：

- 线性表：不限制操作

- 栈：在同一端操作

- 队列：在两端操作

线性表模板：

```cpp
template <class T> 
class List {
    void clear();                         // 置空线性表
    bool isEmpty();                       // 线性表为空时，返回true
    bool append(const T value);           // 在表尾添加一个元素value，表的长度增1
    bool insert(const int p, const T value); // 在位置p上插入一个元素value，表的长度增1
    bool delete(const int p);             // 删除位置p上的元素，表的长度减1
    bool getPos(int& p, const T value);   // 查找值为value的元素并返回其位置
    bool getValue(const int p, T& value); // 把位置p元素值返回到变量value
    bool setValue(const int p, const T value); // 用value修改位置p的元素值
};
```

## 顺序表（vector/array）

固定长度的一维数组，定义：‘

```cpp
class arrList : public List<T> { // 顺序表，向量
private:                        // 线性表的取值类型和取值空间
    T* aList;                   // 私有变量，存储顺序表的实例
    int maxSize;                // 私有变量，顺序表实例的最大长度
    int curLen;                 // 私有变量，顺序表实例的当前长度
    int position;               // 私有变量，当前处理位置
public:
    int length();                                  // 返回当前实际长度
    bool append(const T value);                    // 在表尾添加元素v
    bool insert(const int p, const T value);       // 插入元素
    bool delete(const int p);                      // 删除位置p上的元素
    bool setValue(const int p, const T value);     // 设置元素值
    bool getValue(const int p, T& value);          // 返回元素
    bool getPos(int& p, const T value);            // 查找元素
};
```

插入和删除操作的主要代价体现在表中元素的移动，时间代价均为$O(n)$。

优点是不需要附加空间、可以通过下标随机存取；

缺点是难以估计大小所以需要分配足够大的连续空间，更新操作的代价很大。

## 链表

链表存储利用指针实现，动态地按照需要为表中新的元素分配存储空间。

**分类**：单链、双链、循环链；

### 1.单链表

在单链表中查找任何一个元素，都必须从第一个元素开始：

```cpp
p = head;
while(not target)
    p = p->next;
```

对链表来说，查找元素的时间复杂度都是$O(n)$，但插入和删除元素都是$O(1)$的。

### 2.双链表（插入/删除）

- 向`p`后插入节点`q`：

```cpp
new q;
q->next = p->next;
q->prev = p;
p->next = q;
q->next->prev = q;
```

- 删除节点`p`：

```cpp
p->prev->next = p->next;
p->next->prev = p->prev;
p->next = NULL;
p->prev = NULL;
```
