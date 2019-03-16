import { SegmentCollideElement } from '.'
import { CollideElement } from '..'
import { RectangleCollideElement } from '../rectangle'

export class Point {
  constructor(public x: number, public y: number) {}
}

export class Segment implements SegmentCollideElement {
  public shape: 'segment' = 'segment'

  constructor(public point1: Point, public point2: Point) {}

  get length() {
    return Math.sqrt(
      (this.point1.x - this.point2.x) ** 2 +
        (this.point1.y - this.point2.y) ** 2
    )
  }

  collide(other: CollideElement): boolean {
    if (other.shape === 'segment') {
      const res = this.collideWithSegment(other)
      if (res) {
        return true
      } else {
        return false
      }
    } else if (other.shape === 'rectangle') {
      return this.collideWithRectangle(other)
    } else if (other.shape === 'circle') {
      return other.collide(this)
    } else if (other.shape === 'triangle') {
      return other.collide(this)
    }

    console.error(
      `collide(...) of ${JSON.stringify(
        this
      )} not implemented with ${JSON.stringify(other)}`
    )
    return false
  }

  collideWithRectangle(other: RectangleCollideElement) {
    const point1InX =
      this.point1.x > other.x && this.point1.x < other.x + other.width
    const point1InY =
      this.point1.y > other.y && this.point1.y < other.y + other.height

    if (point1InX && point1InY) {
      return true
    }

    const otherSegments = [
      new Segment(
        new Point(other.x, other.y),
        new Point(other.x + other.width, other.y)
      ),
      new Segment(
        new Point(other.x + other.width, other.y),
        new Point(other.x + other.width, other.y + other.height)
      ),
      new Segment(
        new Point(other.x + other.width, other.y + other.height),
        new Point(other.x, other.y + other.height)
      ),
      new Segment(
        new Point(other.x, other.y + other.height),
        new Point(other.x, other.y)
      ),
    ]
    for (const segment of otherSegments) {
      const res = this.collideWithSegment(segment)
      if (res) {
        return true
      }
    }
    return false
  }

  /** From stack overflow (lol) */
  collideWithSegment(other: SegmentCollideElement) {
    let s1_x = this.point2.x - this.point1.x
    let s1_y = this.point2.y - this.point1.y
    let s2_x = other.point2.x - other.point1.x
    let s2_y = other.point2.y - other.point1.y

    let s =
      (-s1_y * (this.point1.x - other.point1.x) +
        s1_x * (this.point1.y - other.point1.y)) /
      (-s2_x * s1_y + s1_x * s2_y)
    let t =
      (s2_x * (this.point1.y - other.point1.y) -
        s2_y * (this.point1.x - other.point1.x)) /
      (-s2_x * s1_y + s1_x * s2_y)

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      // Collision detected
      let intX = this.point1.x + t * s1_x
      let intY = this.point1.y + t * s1_y
      return new Point(intX, intY)
    }
    return false
  }
}
