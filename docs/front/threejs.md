# threejs

## 0. 学习资料

[官方文档](https://threejs.org/docs/)

[Bruno Simon的three.js教程--b站](https://www.bilibili.com/video/BV1wY4y1h765?p=9&vd_source=5d93cf65b051f3058e10e71c0b4d4358)

> 视频版本 r124  最新版本 r154  显著变化如下，文件位置移位不管
>
> 1. [Difference between buffer geometry and geometry](https://stackoverflow.com/questions/54673268/difference-between-buffer-geometry-and-geometry)：移除了Geometry
> 2.  r134 因为标准不同，移除了[DeviceOrientationControls](https://www.reddit.com/r/threejs/comments/tlppag/alternatives_to_deviceorientationcontrolsjs_in/)
> 3. 

万向锁

四元数 quaterion

[【瞎鼓捣】web前端全景直播](https://blog.csdn.net/SusiiaRomon/article/details/125419979)

## 1. 视频学习心得

### Basic 基础

初始化

```js
import * as THREE from 'three'
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl')
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 100);
scene.add(camera)

// Scene
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
```

添加CameraHelper，生成辅助线，辅助开发

```js
const helper = new THREE.CameraHelper(camera);
const colorBlue = new THREE.Color('blue')
helper.setColors(colorBlue, colorBlue, colorBlue, colorBlue, colorBlue)
scene.add(helper);
```



### Transforms Object 转换对象

修改position、rotation、scale

 THREE.Group组，可以添加多个对象

### Animations 动画

动画loop

```js
function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()
```

使用clock计算*deltaTime*，抹平不同电脑帧率限制

使用[gsap](https://greensock.com)改变位置，添加动画

```js
gsap.to(group.position, {y: 2, duration: 1, delay: 1})
gsap.to(group.position, {y: 0, duration: 1, delay: 2})
```

### Cameras 相机



- PerspectiveCamera：透视相机

- OrthographicCamera：正交相机



- CubeCamera：立方相机
- StereoCamera：双透视相机

### Fullscreen and Resizing 全屏和变换窗口

双击全屏

```js
  const fullScreen = {
    get enabled() {
      return !!(document.fullscreenElement || document.webkitFullscreenElement)
    },
    request() {
      let element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) { // IE11
        element.msRequestFullscreen()
      } else {
        window.alert('your browser not support requestFullscreen')
      }
    },
    exit() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else {
        window.alert('your browser not support exitFullscreen')
      }
    }
  }

  window.addEventListener('dblclick', () => {
    console.log('dbclick', document.fullscreenElement)
    if (fullScreen.enabled) {
      fullScreen.exit()
    } else {
      fullScreen.request()
    }
  })

```

更新比例

```js
  window.addEventListener('resize', () => {
    Object.assign(sizes, {
      width: window.innerWidth,
      height: window.innerHeight
    })
    console.log('resize', sizes)
    // camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // size
    renderer.setSize(sizes.width, sizes.height)
    // handle different screen move
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

```

### Geometries 几何体

