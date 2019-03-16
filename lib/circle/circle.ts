import { CircleCollideElement } from '.'
import { CollideElement } from '..'
import { RectangleCollideElement } from '..'
import { circleSegment } from './circleSegment'

export class Circle implements CircleCollideElement {
  public shape: 'circle' = 'circle'

  constructor(public x: number, public y: number, public radius: number) {}

  collide(other: CollideElement): boolean {
    if (other.shape === 'circle') {
      return this.collideWithCircle(other)
    } else if (other.shape === 'rectangle') {
      return this.collideWithRectangle(other)
    } else if (other.shape === 'segment') {
      return circleSegment(this, other)
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
    const circleDistance = {
      x: Math.abs(this.x - (other.x + other.width / 2)),
      y: Math.abs(this.y - (other.y + other.height / 2)),
    }

    if (circleDistance.x > other.width / 2 + this.radius) {
      return false
    }
    if (circleDistance.y > other.height / 2 + this.radius) {
      return false
    }
    if (circleDistance.x <= other.width / 2) {
      return true
    }
    if (circleDistance.y <= other.height / 2) {
      return true
    }
    const cornerDistanceSq =
      (circleDistance.x - other.width / 2) ** 2 +
      (circleDistance.y - other.height / 2) ** 2
    return cornerDistanceSq <= this.radius ** 2
  }

  collideWithCircle(other: CircleCollideElement) {
    if (
      (other.x - this.x) ** 2 + (other.y - this.y) ** 2 <=
      (other.radius + this.radius) ** 2
    ) {
      return true
    } else {
      return false
    }
  }
}
