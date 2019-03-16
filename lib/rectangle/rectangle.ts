import { RectangleCollideElement } from '.'
import { CollideElement } from '..'

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
    }

    console.error(`collide(...) of ${this} not implemented with ${other}`)
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
