# godot



## 学习收集

### owner指向节点

[godot中简单使用owner](https://www.bilibili.com/video/BV1ip4y1X7y9/?vd_source=5d93cf65b051f3058e10e71c0b4d4358)

顶部节点owner为null

多层嵌套子节点，owner指向当前场景的顶部节点

### 用代码保存场景到磁盘

必须给子节点指定owner

```python
func saveNode():
	var n1 := Node.new()
	var n2 := Node.new()
	var n3 := Node.new()
	n1.name = "亚托克斯"
	n2.name = "剑魔"
	n3.name = "走失了"
	
	n1.add_child(n2)
	n2.add_child(n3)
	# 指定owner
	n2.owner = n1
	n3.owner = n1
	
	var sence_pack := PackedScene.new()
	var result := sence_pack.pack(n1)
	
	if result == OK:
		var error = ResourceSaver.save(sence_pack, "res://test_node_pack.tscn") 
		if error == OK:
			print("保存成功")
		else :
			print("将场景保存到磁盘时出错。")		
	else :
		print("pack失败")

```



### MainLoop和SceneTree

https://www.bilibili.com/video/BV1684y147h4?p=21&vd_source=5d93cf65b051f3058e10e71c0b4d4358

- 每帧（物理和空闲）的delta是距上次调用时间，单位是秒



### 引擎free(), queue_free()和remove_child()的区别

- [ ] https://www.bilibili.com/video/BV15v4y1f7mP/?spm_id_from=333.999.0.0&vd_source=5d93cf65b051f3058e10e71c0b4d4358



### load与preload

对比

- preload是在编译时加载资源，也就是说在你的项目开始运行之前，资源就已经被加载好了。load是在运行时加载资源，也就是说在你的代码中调用load函数的时候，才会加载资源。
- preload只能用于GDScript中的常量或全局变量，不能用于局部变量或函数参数。load可以用于任何地方，只要传入一个有效的资源路径。
- 一般来说，preload适合用于加载一些小型或常用的资源，比如纹理、声音、字体等。load适合用于加载一些大型或不常用的资源，比如场景、模型、动画等。

通常加载结果

- 加载sence返回时PackedScence，通过instantiate方法初始化

- 加载图片返回的是CompressdTexture2D



### 获取节点get_node注意

- https://www.bilibili.com/video/BV1684y147h4?p=20&vd_source=5d93cf65b051f3058e10e71c0b4d4358
- [How to destory node](https://godotlearn.com/godot-3-1-how-to-destroy-object-node/)
- [UNDERSTANDING NODE PATHS](https://kidscancode.org/godot_recipes/3.x/basics/getting_nodes/index.html)

- [节点生命周期](https://kidscancode.org/godot_recipes/3.x/basics/tree_ready_order/index.html)

  - 子场景也是按这个生命周期顺序
  - 主场景包含多个子场景的，会先按这个顺序加载完所有子场景

  

- `_init`阶段无法获取到其他节点
- 在`_ready`时删除`free`一个节点的引用，在其他节点还是能获取`get_node`到，因为它要在下一帧才释放；虽然可以获取引用，但是再把它添加`add_child`到场景树，也不会起效，因为引用已经被删除
- `$Node` 等于 `get_node("node")`
- 获取节点返回null，会记录一个红色警告，但是不会阻塞代码的运行



## AI问答

开场白 `我是前端开发者，想要学习godot, ...`



### 当节点嵌套时的，节点生命周期调用顺序

- [额外学习](https://kidscancode.org/godot_recipes/3.x/basics/tree_ready_order/index.html)

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

### 物理帧、进程帧区别

> 您好，这是Bing。😊
>
> 根据搜索结果¹，`_process()`和`_physics_process()`的区别是：
>
> - `_process()`是与图形相关的，它每帧都会被调用，调用频率取决于CPU速度和VSync设置。您可以用它来处理任何与图形相关的事情，比如动画、UI、声音等。
> - `_physics_process()`是与物理相关的，它每个物理帧都会被调用，调用频率取决于Physics FPS设置。Godot会在计算物理响应之前调用`_physics_process()`，因此要获取正确的物理响应，您应该用它来处理任何与物理相关的事情，比如移动、碰撞、射线等。
>
> 如果您想要在代码中获取当前的物理帧和进程帧，您可以使用`Engine.get_physics_frames()`和`Engine.get_frames()`函数。例如：
>
> ```
> func _process(delta):
>     print("Process frame: ", Engine.get_frames())
> func _physics_process(delta):
>     print("Physics frame: ", Engine.get_physics_frames())
> ```
>
> 源: 与必应的对话， 2023/5/1
> (1) Difference between _process() and _physics_process() - Godot Engine - Q&A. https://godotengine.org/qa/140210/difference-between-_process-and-_physics_process.
> (2) godot - Difference between _process(delta) and _physics_process(delta .... https://gamedev.stackexchange.com/questions/192180/difference-between-processdelta-and-physics-processdelta.
> (3) Godot: _process () vs _physics_process (): I need a valuable example. https://stackoverflow.com/questions/73098693/godot-process-vs-physics-process-i-need-a-valuable-example.
> (4) Please what's the difference between the process and the physics .... https://www.reddit.com/r/godot/comments/hxfjk9/please_whats_the_difference_between_the_process/.

### set_notify_transform什么作用；一般什么时候发出；全局变换什么意思

> 根据Godot文档¹，set_notify_transform是一个方法，用于启用或禁用节点的变换通知。变换通知是当节点的变换发生变化时触发的回调，例如当节点被移动、旋转或缩放时。回调函数是_notification (NOTIFICATION_TRANSFORM_CHANGED)，它可以在脚本中重写，以便在节点的变换发生变化时执行自定义逻辑。
>
> 然而，似乎有一个bug²，导致一旦使用Tween来调整节点的变换，就无法接收到变换通知。这个bug还没有被修复，所以如果你依赖于变换通知来处理你的节点，你可能要避免使用Tween。
>
> 一般来说，当节点的局部变换或全局变换发生改变时，就会发出变换通知。局部变换是相对于父节点的变换，全局变换是相对于场景根节点的变换。你可以使用get_transform()和get_global_transform()方法来获取节点的局部和全局变换。全局变换是一个Transform对象，它包含了位置、旋转和缩放三个属性。
>
> 源: 与必应的对话， 2023/5/2
> (1) Godot notifications — Godot Engine (stable) documentation in English. https://docs.godotengine.org/en/stable/tutorials/best_practices/godot_notifications.html.
> (2) Transform notifications (NOTIFICATION_TRANSFORM_CHANGED) are no longer .... https://github.com/godotengine/godot/issues/34740.
> (3) Transform — Godot Engine (3.0) documentation in English. https://docs.godotengine.org/en/3.0/classes/class_transform.html.
