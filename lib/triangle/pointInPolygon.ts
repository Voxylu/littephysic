import { Point } from '../segment'
import { Vector2D } from '../circle/circleSegment'

export const pointInPolygon = (points: Point[], P: Point) => {
  for (let i = 0; i < points.length; i++) {
    const A = points[i]
    let B
    if (i === points.length - 1) {
      B = points[0]
    } else {
      B = points[i + 1]
    }
    const D = new Vector2D(B.x - A.x, B.y - A.y)
    const T = new Vector2D(P.x - A.x, P.y - A.y)
    const d = D.x * T.y - D.y * T.x

    if (d <= 0) {
      return false
    }
  }
  return true
}
