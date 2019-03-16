import { RectangleCollideElement } from '.'
import { CollideElement } from '..'
import { TriangleCollideElement } from '../triangle'
import { Segment, Point } from '../segment'

export class Rectangle implements RectangleCollideElement {
  public shape: 'rectangle' = 'rectangle'

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  collide(other: CollideElement): boolean {
    if (other.shape === 'rectangle') {
      return this.collideWithRectangle(other)
    } else if (other.shape === 'segment') {
      return other.collide(this)
    } else if (other.shape === 'circle') {
      return other.collide(this)
    } else if (other.shape === 'triangle') {
      return this.collideWithTriangle(other)
    }
    console.error(`collide(...) of ${this} not implemented with ${other}`)
    return false
  }

  get segments() {
    return [
      new Segment(
        new Point(this.x, this.y),
        new Point(this.x + this.width, this.y)
      ),
      new Segment(
        new Point(this.x + this.width, this.y),
        new Point(this.x + this.width, this.y + this.height)
      ),
      new Segment(
        new Point(this.x + this.width, this.y + this.height),
        new Point(this.x, this.y + this.height)
      ),
      new Segment(
        new Point(this.x, this.y + this.height),
        new Point(this.x, this.y)
      ),
    ]
  }

  collideWithTriangle(other: TriangleCollideElement) {
    for (const point of other.points) {
      const falseRect: RectangleCollideElement = {
        collide: () => false,
        shape: 'rectangle',
        x: point.x,
        y: point.y,
        height: 0,
        width: 0,
      }
      if (this.collideWithRectangle(falseRect)) {
        return true
      }
    }
    for (const mySegment of this.segments) {
      for (const otherSegment of other.segments) {
        if (mySegment.collide(otherSegment)) {
          return true
        }
      }
    }
    return false
  }

  collideWithRectangle(other: RectangleCollideElement) {
    const collideInX =
      this.x + this.width > other.x && this.x < other.x + other.width
    const collideInY =
      this.y + this.height > other.y && this.y < other.y + other.height

    if (collideInX && collideInY) {
      return true
    } else {
      return false
    }
  }
}
