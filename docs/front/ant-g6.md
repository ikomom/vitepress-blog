- [ ] [批量添加节点](https://g6.antv.antgroup.com/api/Graph#graphoptionsautopaint)?
- [x] [Item所有方法学习](https://g6.antv.antgroup.com/api/Items/item-methods)
- [x] [基础动画](https://g6.antv.antgroup.com/manual/middle/animation#%E5%9C%86%E7%82%B9%E8%BF%90%E5%8A%A8)
- [x] [状态 State](https://g6.antv.antgroup.com/manual/middle/states/state)
- [ ] [G6 状态管理的最佳实践](https://g6.antv.antgroup.com/manual/advanced/state-new)



## 基础

### 元素(Item)

图的[元素（Item）](https://g6.antv.antgroup.com/api/Items/item-properties)

- 节点 Node
- 边 Edge 
- Combo 

每个图元素（item）由一个或多个 [图形（Shape）](https://g6.antv.antgroup.com/zh/docs/manual/middle/elements/shape/shape-keyshape) 组成，都会有自己的**唯一关键图形（keyShape）**

图元素具有公共的通用属性和通用方法

- 样式属性，通过 `style` 字段对象进行配置，和元素的关键图形相关，例如 `fill`，`stroke`。可在[元素状态](https://g6.antv.antgroup.com/zh/docs/manual/middle/states/state)改变时被改变
- 其他属性，例如 `id`、`type`，不能在元素状态改变是进行改变，可通过 [graph.updateItem](https://g6.antv.antgroup.com/zh/docs/api/graph-func/item#graphupdateitemitem-model-stack) 进行手动更新。完整的元素属性列表参考：[元素配置项](https://g6.antv.antgroup.com/zh/docs/api/Items/item-properties)。除了各类元素共有的通用属性外，每种节点/边/ Combo 都有各自的特有属性。

图元素实例上具有对元素进行**更新、销毁、获取属性、修改状态**等[通用方法](https://g6.antv.antgroup.com/zh/docs/api/Items/item-methods)，同时，对于实例的变更也可以通过调用 [graph](https://g6.antv.antgroup.com/zh/docs/api/Graph) 上的方法进行。



#### 图形 Shape

Shape 指 G6 中**的图形、形状**，它可以是圆形、矩形、路径等。

每种节点/边/ Combo 都会有自己的唯一关键图形 keyShape，下图中三个节点的 keyShape 都是蓝绿色的圆，keyShape 主要用于交互检测、样式随[状态](https://g6.antv.antgroup.com/zh/docs/manual/middle/states/state)自动更新等，见  [keyShape](https://g6.antv.antgroup.com/manual/middle/elements/shape/shape-keyshape#keyshape)。

![image-20240325220015549](D:\Project\web\private\vitepress-blog\docs\front\assets\image-20240325220015549.png)

##### KeyShape

每一种节点/边/ Combo 都有一个唯一的关键图形 keyShape。

keyShape 是在节点/边/ Combo 的 `draw()` 方法或 `drawShape()` 方法中返回的图形对象。它有两个主要特点：

- 响应样式
  - 内置节点/边/ Combo 配置项中的 `style` 只体现在它的 keyShape 上
- 决定包围盒：边的连线是否靠近

##### Shape 的生命周期

- 初始化渲染；
- 更新；
- 操作；
- 销毁。

销毁可以交给 Graph 来处理，所以在定义 Shape 时不需要考虑，仅需要考虑三个阶段即可：

- 绘制：从无到有的绘制 Shape 及文本；
- 更新：数据发生改变导致 Shape 及文本发生变化；
- 操作：给 Shape 添加状态，如：selected，active 等。

所以我们在设计自定义节点/边/ Combo 时，定义了三个方法，若需要自定义节点/边/ Combo ，需要有选择性地复写它们：

- `draw(cfg, group)`: 绘制，提供了绘制的配置项（数据定义时透传过来）和图形容器，**必须**返回合理的图形作为 keyShape；
- `update(cfg, n)`: 更新，更新时的配置项（更新的字段和原始字段的合并）和元素对象；
- `setState(name, value, item)`: 响应节点/边/ Combo 状态的变化。

关于自定义节点和边的更多方法请参考 [自定义节点与边 API](https://g6.antv.antgroup.com/zh/docs/api/register-item)。

##### 图形分组 Group

图形分组 Group 与 [节点分组 Combo](https://g6.antv.antgroup.com/zh/docs/manual/middle/elements/combos/default-combo) 属于不同层次的概念。

- 图形分组针对 [图形 Shape](https://g6.antv.antgroup.com/zh/docs/manual/middle/elements/shape/shape-keyshape) 层次的分组；
- [节点分组 Combo](https://g6.antv.antgroup.com/zh/docs/manual/middle/elements/combos/default-combo) 是针对 [节点](https://g6.antv.antgroup.com/zh/docs/manual/middle/elements/nodes/default-node) 的分组，与数据结构中的层次、分组对应。

图形分组 group，是用来组合图形对象的容器

- 添加变换（例如剪裁、旋转、放缩、平移等）会**应用到其所有的子元素**上
- 在 group 上添加属性（例如颜色、位置等）会被其所有的子元素继承
-  group 可以多层嵌套使用，因此可以用来定义复杂的对象。

在 G6 中，Graph 的一个实例中的所有节点属于（父级）同一个变量名为 `nodeGroup` 的 group，所有的边属于同一个变量名为 `edgeGroup` 的 group

节点 group 在视觉上的层级（zIndex）高于边 group，即**所有节点会绘制在所有边**的上层

### 节点

#### 自定义节点

- Q：节点/边更新时，没有按照在 `nodeDefinition` 中自定义实现的 `draw` 或 `drawShape` 逻辑更新。例如，有些图形没有被更新，增加了没有在 `draw` 或 `drawShape` 方法中定义的图形等。
- A：由于继承了 `extendedNodeType`，且在 `nodeDefinition` 中没有复写 `update` 方法，导致节点/边更新时执行了 `extendedNodeType` 中的 `update` 方法，从而与自定义的 `draw` 或 `drawShape` 有出入。可以通过复写 `update` 方法为 `undefined` 解决。当 `update` 方法为 `undefined` 时，节点/边的更新将会执行 `draw` 或 `drawShape` 进行重绘。



#### 操作

##### 获取元素的容器。

> ```javascript
> // 获取元素的容器
> const group = item.getContainer();
> 
> // 等价于
> const group = item.get('group');
> ```

##### 获取元素的关键形状

获取元素的关键形状，用于计算节点大小、连线截距等。

```js
// 获取元素的 keyShape
const keyShape = item.getKeyShape();

// 等价于
const keyShape = item.get('keyShape');
```




## 链接

- [点击单选或多选](https://g6.antv.antgroup.com/examples/interaction/select#click)
- [无到有的边(动画)](https://g6.antv.antgroup.com/examples/scatter/edge#lineGrowth)
- [圆点沿边运动](https://g6.antv.antgroup.com/examples/scatter/edge#pointInLine)
- [最短路径](https://g6.antv.antgroup.com/examples/algorithm/algoDemos#shortestPath)
- [聚类包裹](https://g6.antv.antgroup.com/api/graph-func/hull#removehullhull-string--hull)
- [用轮廓包裹节点集合](https://g6.antv.antgroup.com/examples/interaction/hull/#hull)
- [切换节点图片](https://g6.antv.antgroup.com/examples/interaction/label#changeImg)
- [边上添加额外图形](https://g6.antv.antgroup.com/examples/item/customEdge#extraShape)
- [toolbar【redo, undo, zoom】](https://github.com/antvis/G6/blob/master/packages/plugin/src/toolBar/index.ts#L208)
- [扩展现有边](https://g6.antv.antgroup.com/manual/middle/elements/edges/custom-edge)



## 需求

不同类型**交换机**，每个交换机代表一个节点，两两中的连线代表一个交换机向另一个发送ping请求的过程

交换机类型有3个；每个交换机下还有用户机；每个交换机上有监控点。



假设有三个场景

### 场景1

默认所有节点都是绿色

选择两个节点，算出最短路径

1. 从起始节点播放动画，圆球沿着所有子节点边运动，运动后节点变红
2. 沿着最短路径，运动到结束节点，往回播放动画，也沿着所有子节点运动，节点变蓝
3. 到达起始节点结束，其他子边的动画还在播放



节点运动动画需要有轮廓

1. 红色（一开始）
2. 蓝色（回来时）

### 场景2

在一的基础上，等圆球动画到达结束节点时，再从开始节点发送圆球，两者碰到，停止动画

### 场景3

在二的基础上，两个动画停止运动时，再从开始节点发送圆球，碰到后让僵持圆球继续走



- 提前准备好数据，边要双向的

- 确认是否扩散？



## demo

### 多条边

```js
import G6 from "@antv/g6";

const edgeTypeColorMap = {
  type1: ["#531dab", "#391085", "#391085"],
  type2: ["#d9d9d9", "#bfbfbf", "#8c8c8c"],
  type3: ["#d3adf7", "#b37feb", "#9254de"]
};

const defaultConf = {
  style: {
    lineAppendWidth: 5,
    lineDash: [0, 0],
    lineDashOffset: 0,
    opacity: 1,
    labelCfg: {
      style: {
        fillOpacity: 1
      }
    }
  },
  /**
   * 绘制边
   * @override
   * @param  {Object} cfg   边的配置项
   * @param  {G.Group} group 边的容器
   * @return {G.Shape} 图形
   */
  drawShape(cfg, group) {
    const item = group.get("item");
    const shapeStyle = this.getShapeStyle(cfg, item);
    const shape = group.addShape("path", {
      className: "edge-path",
      attrs: shapeStyle
    });
    return shape;
  },
  drawLabel(cfg, group) {
    const labelCfg = cfg.labelCfg || {};
    const labelStyle = this.getLabelStyle(cfg, labelCfg, group);
    const text = group.addShape("text", {
      attrs: {
        ...labelStyle,
        text: cfg.label,
        fontSize: 12,
        fill: "#404040",
        cursor: "pointer"
      },
      className: "edge-label"
    });

    return text;
  },

  /**
   * 获取图形的配置项
   * @internal 仅在定义这一类节点使用，用户创建和更新节点
   * @param  {Object} cfg 节点的配置项
   * @return {Object} 图形的配置项
   */
  getShapeStyle(cfg, item) {
    const { startPoint, endPoint } = cfg;
    const type = item.get("type");

    const defaultStyle = this.getStateStyle("default", true, item);

    if (type === "node") {
      return Object.assign({}, cfg.style, defaultStyle);
    }

    const controlPoints = this.getControlPoints(cfg);
    let points = [startPoint]; // 添加起始点
    // 添加控制点
    if (controlPoints) {
      points = points.concat(controlPoints);
    }
    // 添加结束点
    points.push(endPoint);
    const path = this.getPath(points);

    const style = Object.assign({}, { path }, cfg.style, defaultStyle);
    return style;
  },
  getControlPoints(cfg) {
    let controlPoints = cfg.controlPoints; // 指定controlPoints

    if (!controlPoints || !controlPoints.length) {
      const { startPoint, endPoint } = cfg;
      const innerPoint = G6.Util.getControlPoint(
        startPoint,
        endPoint,
        0.5,
        cfg.edgeOffset || 30
      );
      controlPoints = [innerPoint];
    }
    return controlPoints;
  },
  /**
   * 获取三次贝塞尔曲线的path
   *
   * @param {array} points 起始点和两个控制点
   * @returns
   */
  getPath(points) {
    const path = [];
    path.push(["M", points[0].x, points[0].y]);
    path.push(["Q", points[1].x, points[1].y, points[2].x, points[2].y]);
    return path;
  },
  /**
   * 根据不同状态，获取不同状态下的样式值
   * @param {string} name
   * @param {string} value
   * @param {Item} item
   */
  getStateStyle(name, value, item) {
    const model = item.getModel();
    const { style = {} } = model;

    const defaultStyle = Object.assign({}, this.style);

    // 更新颜色
    return {
      ...defaultStyle,
      lineWidth: 1,
      stroke:
        edgeTypeColorMap[model.edgeType] && edgeTypeColorMap[model.edgeType][0],
      ...style
    };
  }
};

G6.registerEdge("quadratic-label-edge", defaultConf, "quadratic");

const INNER_CIRCLE_CLASS = "node-inner-circle";
const GRAPH_CONTAINER = "container";
const data = {
  nodes: [
    {
      id: "node1",
      x: 100,
      y: 150,
      label: "node1"
    },
    {
      id: "node2",
      x: 300,
      y: 150,
      label: "node2"
    }
  ],
  edges: [
    {
      source: "node1",
      target: "node2",
      edgeType: "type1"
    },
    {
      source: "node2",
      target: "node1",
      edgeType: "type2"
    },
    {
      source: "node2",
      target: "node1",
      edgeType: "type3",
      edgeOffset: -20
    }
  ]
};

const width = document.getElementById("container").scrollWidth;
const height = document.getElementById("container").scrollHeight || 500;
const graph = new G6.Graph({
  container: GRAPH_CONTAINER,
  width,
  height,
  modes: {
    default: [
      {
        type: "drag-node",
        delegate: false
      }
    ]
  },
  defaultNode: {
    style: {
      fill: "#DEE9FF",
      stroke: "#5B8FF9"
    },
    labelCfg: {
      style: {
        fontSize: 12
      }
    }
  },
  defaultEdge: {
    type: "quadratic-label-edge"
  }
});

graph.data(data);
graph.render();

```



### 大规模数据

```js
import G6 from '@antv/g6';

const mapNodeSize = (nodes, propertyName, visualRange) => {
  let minp = 9999999999;
  let maxp = -9999999999;
  nodes.forEach((node) => {
    node[propertyName] = Math.pow(node[propertyName], 1 / 3);
    minp = node[propertyName] < minp ? node[propertyName] : minp;
    maxp = node[propertyName] > maxp ? node[propertyName] : maxp;
  });
  const rangepLength = maxp - minp;
  const rangevLength = visualRange[1] - visualRange[0];
  nodes.forEach((node) => {
    node.size = ((node[propertyName] - minp) / rangepLength) * rangevLength + visualRange[0];
  });
};

const container = document.getElementById('container');
const descriptionDiv = document.createElement('div');
descriptionDiv.innerHTML = `正在渲染大规模数据，请稍等……`;
container.appendChild(descriptionDiv);

const width = container.scrollWidth;
const height = container.scrollHeight || 500;
const graph = new G6.Graph({
  container: 'container',
  width,
  height,
  defaultNode: {
    size: 2,
    style: {
      fill: '#C6E5FF',
      stroke: '#5B8FF9',
      lineWidth: 0.3,
    },
    labelCfg: {
      style: {
        fontSize: 3,
      },
      position: 'right',
      offset: 1,
    },
  },
  defaultEdge: {
    size: 0.1,
    color: '#333',
    type: 'line',
  },
  nodeStateStyles: {
    selected: {
      fill: 'steelblue',
      stroke: '#000',
      lineWidth: 1,
    },
    hover: {
      fill: 'red',
      stroke: '#000',
      lineWidth: 1,
    },
  },
  modes: {
    default: [
      {
        type: 'zoom-canvas',
        enableOptimize: true,
        optimizeZoom: 0.9,
      },
      {
        type: 'drag-canvas',
        enableOptimize: true,
      },
      'drag-node',
      'brush-select',
    ], // 'drag-canvas',
  },
});

fetch('https://gw.alipayobjects.com/os/basement_prod/0b9730ff-0850-46ff-84d0-1d4afecd43e6.json')
  .then((res) => res.json())
  .then((data) => {
    data.nodes.forEach((node) => {
      node.label = node.olabel;
      node.labelCfg.style = {
        fontSize: 1.3,
      };
      node.degree = 0;
      data.edges.forEach((edge) => {
        if (edge.source === node.id || edge.target === node.id) {
          node.degree++;
        }
      });
    });
    console.log('原始数据', data.nodes.length, data.edges.length);
    mapNodeSize(data.nodes, 'degree', [1, 15]);
    // console.log(data.nodes);
    graph.data(data);
    graph.render();
    graph.on('node:mouseenter', (e) => {
      const { item } = e;
      graph.setItemState(item, 'hover', true);
    });
    graph.on('node:mouseleave', (e) => {
      const { item } = e;
      graph.setItemState(item, 'hover', false);
    });

    const graphData = graph.save();
    const nodeLen = graphData.nodes.length;
    const edgeLen = graphData.edges.length;
    descriptionDiv.innerHTML = `节点数量：${nodeLen}, 边数量：${edgeLen}, 图元数量：${
      nodeLen * 2 + edgeLen
    }`;
  });

if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };

```

