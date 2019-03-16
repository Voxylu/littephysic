import { CircleCollideElement } from '.'
import { SegmentCollideElement, Point } from '../segment'

class Vector2D {
  constructor(public x: number, public y: number) {}

  static fromPoints(A: Point, B: Point) {
    return new Vector2D(B.x - A.x, B.y - A.y)
  }

  dot(vector: Vector2D) {
    return this.x * vector.x + this.y * vector.y
  }

  static mult(vector: Vector2D, scalar: number) {
    return new Vector2D(vector.x * scalar, vector.y * scalar)
  }
}

export const circleSegment = (
  circle: CircleCollideElement,
  { point1: E, point2: L }: SegmentCollideElement
) => {
  // test if a point is inside
  if ((E.x - circle.x) ** 2 + (E.y - circle.y) ** 2 <= circle.radius ** 2) {
    return true
  }

  const C = new Point(circle.x, circle.y)
  const r = circle.radius

  const d = Vector2D.fromPoints(E, L)
  const f = Vector2D.fromPoints(C, E)

  let a = d.dot(d)
  let b = 2 * f.dot(d)
  let c = f.dot(f) - r * r

  let discriminant = b * b - 4 * a * c

  if (discriminant < 0) {
    return false
  } else {
    discriminant = Math.sqrt(discriminant)

    let t1 = (-b - discriminant) / (2 * a)
    let t2 = (-b + discriminant) / (2 * a)

    if (t1 >= 0 && t1 <= 1) {
      return true
    }
    if (t2 >= 0 && t2 <= 1) {
      return true
    }
    return false
  }
}
