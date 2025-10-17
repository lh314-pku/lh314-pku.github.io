# 二叉树Binary Cross Tree

## 1. 概念

由节点的有限集合组成。可以是空集。

根节点（root）、左子树和右子树（left / right subtree）

5种基本类型：空、独根、空左、空右、左右都不空。

**节点**：

- 子结点、父结点、最左子结点

- 兄弟结点

- 分支结点、叶结点（树叶、终端结点，没有子树）

**边**：两个结点的有序对

**路径**：连接 祖先 <---> 后代。

**层数**：根结点为 0 层

**深度**：最大层数

**高度**：深度 + 1

**满二叉树**：任何结点，或者是树叶，或者恰有两棵非空子树，则此二叉树称作满二叉树。

```textile
    A
   / \
  B   C
     / \
    D   E
   / \ / \
  F  G H  I
```

**完全二叉树**：最多只有最下面的两层结点度数可以小于2，且最下一层的结点都集中最左边。

```textile
       A
     /  \
    B    C
  /  \  /  \
 D   E  F   G
/ \ /  /
H I J L
```

**扩充二叉树**：所有空子树，都增加空树叶。

**外部路径长度**（所有外部结点到根结点的路径长度之和 $E$，**内部路径长度**（所有内部结点到根节点的路径长度之和）$I$，有：$E = I + 2n$（n为内部结点个数）

性质：

- 二叉树第 i 层最多有 2^i 个结点

- 深度 k 的二叉树最多有 2^{k+1}-1 个结点

- 终端结点数 n_0，高度 2 的结点数 n_2，则 n_0=n_2+1

- 满二叉树定理：非空**满二叉树**树叶数目等于其分支结点数加1

- 推论：一个非空二叉树的空子树数目等于其结点数加1

- n 个结点的完全二叉树高度为：$\lceil \log_2 (n+1) \rceil$

## 2. 抽象数据类型ADT

逻辑结构+ 运算。

对于整棵树：初始化、合并

对于结点：访问子结点、父节点、存储数据

二叉树结点ADT：

```cpp
template <class T>
class BinaryTreeNode {
    // 声明二叉树类为友元类
    friend class BinaryTree<T>;
private:
    T info;  // 二叉树结点数据域
public:
    BinaryTreeNode();  // 缺省构造函数
    BinaryTreeNode(const T& ele);  // 给定数据的构造
    BinaryTreeNode(const T& ele, BinaryTreeNode<T>* l, BinaryTreeNode<T>* r);  // 子树构造结点

    T value() const;  // 返回当前结点数据
    BinaryTreeNode<T>* leftchild() const;  // 返回左子树
    BinaryTreeNode<T>* rightchild() const;  // 返回右子树
    void setLeftchild(BinaryTreeNode<T>*);  // 设置左子树
    void setRightchild(BinaryTreeNode<T>*);  // 设置右子树
    void setValue(const T& val);  // 设置数据域
    bool isLeaf() const;  // 判断是否为叶结点
    BinaryTreeNode<T>& operator=(const BinaryTreeNode<T>& Node);  // 重载赋值操作符
};
```

在此条件下，有二叉树ADT：

```cpp
template <class T>
class BinaryTree {
private:
    BinaryTreeNode<T>* root;  // 二叉树根结点

public:
    BinaryTree() { root = NULL; }  // 构造函数
    ~BinaryTree() { DeleteBinaryTree(root); }  // 析构函数
    bool isEmpty() const;  // 判断二叉树是否为空树
    BinaryTreeNode<T>* Root() { return root; }  // 返回根结点

    BinaryTreeNode<T>* Parent(BinaryTreeNode<T>* current);  // 返回父
    BinaryTreeNode<T>* LeftSibling(BinaryTreeNode<T>* current);  // 左兄
    BinaryTreeNode<T>* RightSibling(BinaryTreeNode<T>* current);  // 右兄

    void CreateTree(const T& info, BinaryTree<T>& leftTree, BinaryTree<T>& rightTree);  // 构造新树
    void PreOrder(BinaryTreeNode<T>* root);  // 前序遍历二叉树或其子树
    void InOrder(BinaryTreeNode<T>* root);  // 中序遍历二叉树或其子树
    void PostOrder(BinaryTreeNode<T>* root);  // 后序遍历二叉树或其子树
    void LevelOrder(BinaryTreeNode<T>* root);  // 按层次遍历二叉树或其子树
    void DeleteBinaryTree(BinaryTreeNode<T>* root);  // 删除二叉树或其子树
};
```

遍历 or 周游(travelsal)：二叉树结点的线性化。

### 2.1 DFS

- 前序法（tLR，preorder travelsal）
  访问根节点、前序遍历左子树、前序遍历右子树

- 中序法（LtR，inorder travelsal）
  中序访问左子树、访问根节点、中序遍历右子树

- 后序法（LRt，postorder travelsal）
  后序遍历左子树、后序遍历右子树、访问根结点

e.g.：

```textile
        A
       / \
      B   C
     / \   \
    D   E   F
       /   / \
      G   H   I
```

- 前序：A B D E G C F H I

- 中序：D B G E A C H F I

- 后序：D G E B H I F C A

表达式二叉树：

```textile
       -
     /   \
    +     *
   / \   / \
  *   c a   +
 / \       / \
a   b     b   c
```

- 前序：- + * a b c * a + b c

- 中序：a * b + c - a * b + c

- 后序：a b * c + a b c + * -

#### 2.1.1 递归实现

```cpp
// 递归实现：
void BinaryTree<T>::DepthOrder(BinaryTreeNode<T>* root){
    if (root != NULL){
        Visit(root); // 前序
        DepthOrder(root->leftchild());
        // Visit(root); // 中序
        DepthOrder(root->rightchild());
        // Visit(root); // 后序
    }
}
```

- 如果已知一棵二叉树的**前序序列**和**中序序列**，可以唯一地确定这棵二叉树。

- 如果已知一棵二叉树的**中序序列**和**后序序列**，也可以唯一地确定这棵二叉树。

- 已知二叉树的「中序遍历序列」和「层序遍历序列」，也可以唯一地确定一棵二叉树。

- 但已知前序序列和后序序列，无法唯一确定。（当且仅当二叉树中每个节点度为 $2$ 或者 $0$ 的时候，已知前序遍历序列和后序遍历序列，才能唯一地确定一颗二叉树）

#### 非递归实现

非递归前序遍历：

- 遇到一个结点，就访问该结点，并把此结点的非空右结点推入栈中，然后下降去遍历它的左子树；

- 遍历完左子树后，从栈顶托出一个结点，并按照它的右链接指示的地址再去遍历该结点的右子树结构。

非递归中序遍历：

- 遇到一个结点–>把它推入栈中–>遍历其左子树

- 遍历完左子树–>从栈顶托出该结点并访问之–>按照其右链地址遍历该结点的右子树

非递归后序遍历：

同上。

实质上三种遍历都只是“访问节点数据”在左子树和右子树之间的位置的变化关系。只需要改变访问/压栈顺序即可。

时间复杂度：O(n)（非递归前序、中序不超过O(n)）

空间复杂度：最好O(log n)，最差O(n)

### 2.2 BFS

使用队列进行维护。

```cpp
void BinaryTree<T>::LevelOrder(BinaryTreeNode<T>* root) {
    using std::queue;  // 使用STL的队列
    queue<BinaryTreeNode<T>*> aQueue;
    BinaryTreeNode<T>* pointer = root;  // 保存输入参数
    if (pointer) aQueue.push(pointer);  // 根结点入队列
    while (!aQueue.empty()) {  // 队列非空
        pointer = aQueue.front();  // 取队列首结点
        aQueue.pop();  // 当前结点出队列
        Visit(pointer->value());  // 访问当前结点
        if (pointer->leftchild()) 
            aQueue.push(pointer->leftchild());  // 左子树进队列
        if (pointer->rightchild()) 
            aQueue.push(pointer->rightchild());  // 右子树进队列
    }
}
```

时间复杂度：O(n)；

空间复杂度：最好O(1)，最差O(n)

## 3. 存储结构

二叉链表：指针left、right和信息info

三叉链表：指针left、right、parent和信息info

存储密度$\alpha\le1$，表示数据结构存储的效率：

$$
\alpha = \frac{数据本身的存储量}{整个结构的存储总量}
$$

结构性开销$\gamma=1-\alpha$。

## 4. 二叉搜索树BST

空树 or 有如下性质的二叉树：

- 任何一个节点，值为K；

- 左子树的所有节点都 小于K；

- 右子树的所有结点都 大于 K；

- 左右子树也是BST。

性质：中序遍历为正序的。



## 5. 堆、优先队列

## 6. Huffman树
