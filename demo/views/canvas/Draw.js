export class Draw {
  constructor() {
    this.timeId = null
    this.animateArr = []
  }
  init(element, width, height) {
    this.element = element
    this.canvas = this.element.getContext('2d')
    this.element.width = width
    this.element.height = height

    const c = this.canvas
    const el = this.element

    let isDrag = false

    c.lineWidth = 2
    c.lineJoin = 'round'
    c.shadowColor = '#000'
    c.shadowBlur = 4

    el.onmousedown = () => {
      isDrag = true
      c.beginPath()
    }
    el.onmousemove = (e) => {
      if (isDrag) {
        const {left, top} = el.getBoundingClientRect()
        const x = e.clientX - left
        const y = e.clientY - top
        console.log('e',{x,y, px: e.pageX, py: e.pageY, oY: el.offsetTop})
        c.lineTo(x, y)
        c.stroke()
        this.animateArr.push([x, y])
      }
    }
    el.onmouseup = () => {
      isDrag = false
      this.animateArr.push(-1)
    }
    el.onmouseout = () => {
      el.onmouseup()
    }
  }
  animateGo() {
    const {canvas:c} = this
    this.clear()
    c.beginPath()
    const loop = (animate, i) => {
      if (i < animate.length - 1) {
        const arr = animate[i]
        if (arr === -1) {
          c.beginPath()
        } else {
          c.lineTo(arr[0], arr[1])
          c.stroke()
        }
        i++
        this.timeId = setTimeout(() => {
          loop(animate, i)
        } ,10)
      }
    }
    loop(this.animateArr, 0)
  }
  clear() {
    const {canvas:c} = this
    const {width, height} = this.element
    c.clearRect(0, 0, width, height)
  }
}
