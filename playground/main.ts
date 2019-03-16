import { createVancas } from 'vancas'
import { MouseCalculator } from './mouse'
import { CollideElement, Triangle } from '../lib'
import { Circle, Segment, Point, Rectangle } from '../lib'
import { pointInPolygon } from '../lib/triangle/pointInPolygon'

const root = document.getElementById('root')
const vancas = createVancas({ height: 500, width: 500 })

if (root) {
  root.innerHTML = ''
  root.appendChild(vancas.canvasEl)
}

const mouse = new MouseCalculator(vancas.canvasEl.getBoundingClientRect())

const bgElems: (CollideElement & { color: string })[] = [
  Object.assign(new Rectangle(80, 50, 100, 200), { color: 'blue' }),
  Object.assign(new Segment(new Point(200, 50), new Point(300, 450)), {
    color: 'green',
  }),
  Object.assign(new Circle(50, 50, 15), { color: 'red ' }),
  Object.assign(
    new Triangle(new Point(100, 300), new Point(50, 350), new Point(150, 350)),
    { color: 'orange' }
  ),
]

let colliderColor = 'white'
// const collider = new Rectangle(0, 0, 10, 10)
// const collider = new Segment(new Point(0, 0), new Point(0, 0))
// const collider = new Point(0, 0)
const collider = new Triangle(new Point(0, 0), new Point(0, 0), new Point(0, 0))
// const collider = new Circle(0, 0, 10)

// mouse.onClick(() => {
//   collider.point1.x = mouse.x
//   collider.point1.y = mouse.y
// })

vancas.update = () => {
  // collider.point2.x = mouse.x
  // collider.point2.y = mouse.y
  // collider.x = mouse.x
  // collider.y = mouse.y

  collider.point1.x = mouse.x
  collider.point1.y = mouse.y
  collider.point2.x = mouse.x - 10
  collider.point2.y = mouse.y + 10
  collider.point3.x = mouse.x + 10
  collider.point3.y = mouse.y + 10

  let hasCollide = false
  for (const elem of bgElems) {
    if (elem.collide(collider)) {
      colliderColor = elem.color
      hasCollide = true
    }
  }
  if (hasCollide === false) {
    colliderColor = 'white'
  }
}

vancas.render = () => {
  vancas.clear()
  vancas.background('black')

  bgElems.forEach((elem) => {
    if (elem.shape === 'rectangle') {
      vancas.rect(elem)
    } else if (elem.shape === 'segment') {
      vancas.line({
        x1: elem.point1.x,
        y1: elem.point1.y,
        x2: elem.point2.x,
        y2: elem.point2.y,
        color: elem.color,
      })
    } else if (elem.shape === 'circle') {
      vancas.circle(elem)
    } else if (elem.shape === 'triangle') {
      vancas.triangle({
        x1: elem.point1.x,
        y1: elem.point1.y,
        x2: elem.point2.x,
        y2: elem.point2.y,
        x3: elem.point3.x,
        y3: elem.point3.y,
        color: elem.color,
      })
    }
  })
  // vancas.line({
  //   x1: collider.point1.x,
  //   y1: collider.point1.y,
  //   x2: collider.point2.x,
  //   y2: collider.point2.y,
  //   color: colliderColor,
  // })
  // vancas.rect({ ...collider, color: colliderColor })
  // vancas.circle({ ...collider, color: colliderColor })
  // vancas.circle({
  //   x: collider.x,
  //   y: collider.y,
  //   radius: 5,
  //   color: colliderColor,
  // })
  vancas.triangle({
    x1: collider.point1.x,
    y1: collider.point1.y,
    x2: collider.point2.x,
    y2: collider.point2.y,
    x3: collider.point3.x,
    y3: collider.point3.y,
    color: colliderColor,
  })
}

vancas.start()
