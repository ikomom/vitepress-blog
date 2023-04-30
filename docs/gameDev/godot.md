# godot

## AI问答

开场白 `我是前端开发者，想要学习godot, ...`



### 当节点嵌套时的，节点生命周期调用顺序

> godot 节点嵌套时的生命周期调用顺序是这样的：
>
> - 当一个节点被添加到场景树中时，它会收到 NOTIFICATION_ENTER_TREE 通知，并触发 _enter_tree 回调。子节点总是在父节点之后被添加，也就是说，父节点的 _enter_tree 回调会先于子节点的触发¹。
> - 当所有节点都被添加到场景树中后，它们会收到 NOTIFICATION_READY 通知，并触发 _ready 回调。对于一组节点，_ready 回调会按照相反的顺序调用，从子节点开始，然后是父节点¹。
>
> 所以，当你添加一个节点到场景树中时，回调的顺序是这样的：
>
> - 父节点的 _enter_tree
> - 子节点的 _enter_tree
> - 子节点的 _ready
> - 父节点的 _ready
>
> 这个顺序是递归地应用于整个场景树的。
>
> 源: 与必应的对话， 2023/4/30
> (1) Node — Godot Engine (stable) documentation in English. https://docs.godotengine.org/en/stable/classes/class_node.html.
> (2) Nodes and Scenes — Godot Engine (stable) documentation in English. https://docs.godotengine.org/en/stable/getting_started/step_by_step/nodes_and_scenes.html.
> (3) GitHub - semickolon/GodotRx: Reactive extensions for Godot C#. https://github.com/semickolon/GodotRx.

### Rect2(position: Vector2, size: Vector2) 解释

> Rect2(position: Vector2, size: Vector2) 是一种构造函数，用于创建一个 Rect2 类型的对象¹²。Rect2 是一个 2D 轴对齐的边界框，它由一个位置和一个大小组成，通常用于快速的重叠测试¹²。Rect2 的 3D 对应物是 AABB¹²。
>
> 要使用 Rect2，你可以传入两个 Vector2 类型的参数，分别表示位置和大小。例如：
>
> var rect = Rect2(Vector2(10, 10), Vector2(100, 50))
>
> 这样就创建了一个左上角为 (10, 10)，宽度为 100，高度为 50 的矩形。
>
> 你也可以传入四个浮点数类型的参数，分别表示 x 坐标，y 坐标，宽度和高度。例如：
>
> var rect = Rect2(10, 10, 100, 50)
>
> 这样就创建了一个和上面相同的矩形。
>
> Rect2 类有很多实用的方法，你可以查看文档¹²来了解更多。
>
> 源: 与必应的对话， 2023/4/30
> (1) Rect2 — Godot Engine (stable) documentation in English. https://docs.godotengine.org/en/stable/classes/class_rect2.html.
> (2) Rect2 — Godot Engine (stable) 简体中文文档. https://docs.godotengine.org/zh_CN/stable/classes/class_rect2.html.
> (3) What are the uses of a Rect2? - Godot Engine - Q&A. https://godotengine.org/qa/120060/what-are-the-uses-of-a-rect2.
> (4) godot/rect2.h at master · godotengine/godot · GitHub. https://github.com/godotengine/godot/blob/master/core/math/rect2.h.

### 信号如何以前端方式理解呢

> godot 的信号是一种消息，当节点发生特定事件时，它会发出信号，例如按钮被按下¹。其他节点可以连接到该信号，并在事件发生时调用一个函数¹。信号是 godot 内置的委托机制，允许一个游戏对象对另一个游戏对象的变化做出反应，而无需相互引用²。使用信号可以减少耦合，并保持代码的灵活性²。
>
> 如果你是前端开发者，你可以把信号理解为类似于 DOM 事件的概念。例如，当用户点击一个按钮时，它会触发一个 click 事件，你可以在 JavaScript 中监听这个事件，并执行相应的操作。在 godot 中，你可以使用编辑器或代码来连接信号，并定义回调函数¹³。
>
> 源: 与必应的对话， 2023/4/30
> (1) Using signals — Godot Engine (stable) documentation in English. https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html.
> (2) 使用信号 — Godot Engine (latest) 简体中文文档. https://docs.godotengine.org/zh_CN/latest/getting_started/step_by_step/signals.html.
> (3) How to Use Godot's Signals - YouTube. https://www.youtube.com/watch?v=NK_SYVO7lMA.

### 信号和函数调用有什么区别

> 信号和函数调用有一些区别，主要是在以下方面：
>
> - 信号可以连接到多个函数，而函数调用只能调用一个函数¹。
> - 信号可以解耦对象之间的依赖关系，而函数调用需要知道对象的引用¹²。
> - 信号可以与 yield 函数配合使用，实现暂停和恢复的效果，而函数调用不能¹。
> - 信号可以在编辑器中可视化地连接，而函数调用需要在代码中编写¹³。
>
> 一般来说，信号更适合处理上行的通信，即子节点向父节点或祖先节点发送消息。函数调用更适合处理下行的通信，即父节点向子节点或后代节点发送消息⁴。
>
> 源: 与必应的对话， 2023/4/30
> (1) Are signals just function calls between scripts? - Godot. https://godotengine.org/qa/66190/are-signals-just-function-calls-between-scripts.
> (2) Accessing Child Nodes: Signals, or Functions? - Godot Engine - Q&A. https://godotengine.org/qa/101944/accessing-child-nodes-signals-or-functions.
> (3) Signals vs. direct function calls : godot - Reddit. https://www.reddit.com/r/godot/comments/o9n75z/signals_vs_direct_function_calls/.
> (4) Best practices with Godot signals · GDQuest. https://www.gdquest.com/tutorial/godot/best-practices/signals/.
