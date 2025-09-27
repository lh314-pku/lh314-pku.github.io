# 栈与队列

**线性结构**：二元组，都是操作受限的线性表。

- 栈：运算只在表的一端进行；

- 队列：运算只在表的两端进行；

## 栈(Stack)

**后进先出(LIFO)**，主要操作有**进栈(push)** 和 **出栈(pop)**

```cpp
template <class T>
class Stack {
public:
    void clear();                    // 栈的运算集，变为空栈
    bool push(const T item);         // item入栈，成功返回true，否则返回false
    bool pop(T& item);               // 返回栈顶内容并弹出，成功返回true，否则返回false
    bool top(T& item);               // 返回栈顶但不弹出，成功返回true，否则返回false
    bool isEmpty();                  // 若栈已空返回true
    bool isFull();                   // 若栈已满返回true
};
```

### 1.顺序栈（Array-based Stack）

本质是顺序表的简化版，关键在于用哪一端作为栈顶。

```cpp
template <class T> class arrStack : public Stack <T> {
private:          
    // 栈的顺序存储
    int mSize;     // 栈中最多可存放的元素个数
    int top;       // 栈顶位置，应小于mSize
    T *st;         // 存放栈元素的数组
public:
    arrStack (int size) {      // 创建一个给定长度的顺序栈实例
        mSize = size; top = -1; st = new T[mSize];
    }
    arrStack () {              // 创建一个顺序栈的实例
        top = -1;
    }
    ~arrStack () { delete [] st; } // 析构函数，释放内存
    void clear() { top = -1; }     // 清空栈
};
```

顺序栈会出现上溢Overflow、下溢Underflow的问题。前者是对已经有`maxsize`个元素的栈做进栈操作；后者是对空栈做出栈运算。

```cpp
bool arrStack<T>::push(const T item){
    if(top == mSize - 1){
        cout << "overflow" << endl;
        return false;
    } else{
        top++;
        st[top] = item;
        return true;
    }
}
bool arrStack<T>::pop(T & item){
    if(top == -1){
        cout << "underflow" << endl;
        return false;
    } else{
        item = st[top];

        return true;
    }
}
```

### 2.链式栈（LinkedStack）

用单链表方式存储，其中指针的方向是从栈顶向下链接

## 队列(Queue)
