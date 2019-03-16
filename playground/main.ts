import { createVancas } from 'vancas'
import { MouseCalculator } from './mouse'
import { CollideElement } from '../lib'
import { Circle, Segment, Point, Rectangle } from '../lib'

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
]

let colliderColor = 'white'
// const collider = new Rectangle(0, 0, 10, 10)
const collider = new Segment(new Point(0, 0), new Point(0, 0))
// const collider = new Circle(0, 0, 10)/*

mouse.onClick(() => {
  collider.point1.x = mouse.x
  collider.point1.y = mouse.y
})

vancas.update = () => {
  collider.point2.x = mouse.x
  collider.point2.y = mouse.y
  // collider.x = mouse.x
  // collider.y = mouse.y

  let hasCollide = false
  for (const elem of bgElems) {
    if (collider.collide(elem)) {
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
    }
  })
  vancas.line({
    x1: collider.point1.x,
    y1: collider.point1.y,
    x2: collider.point2.x,
    y2: collider.point2.y,
    color: colliderColor,
  })
  // vancas.rect({ ...collider, color: colliderColor })
  // vancas.circle({ ...collider, color: colliderColor })
}

vancas.start()
