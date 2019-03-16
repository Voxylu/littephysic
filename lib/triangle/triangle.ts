import { TriangleCollideElement } from '.'
import { Point, Segment, SegmentCollideElement } from '../segment'
import { CollideElement } from '..'
import { pointInPolygon } from './pointInPolygon'
import { CircleCollideElement } from '../circle'

export class Triangle implements TriangleCollideElement {
  public shape: 'triangle' = 'triangle'

  constructor(
    public point1: Point,
    public point2: Point,
    public point3: Point
  ) {}

  collide(other: CollideElement): boolean {
    if (other.shape === 'triangle') {
      return this.collideWithTriangle(other)
    } else if (other.shape === 'segment') {
      return this.collideWithSegment(other)
    } else if (other.shape == 'circle') {
      return this.collideWithCircle(other)
    }
    return false
  }

  get points() {
    return [this.point1, this.point3, this.point2]
  }

  get segments() {
    return [
      new Segment(this.point1, this.point2),
      new Segment(this.point2, this.point3),
      new Segment(this.point3, this.point1),
    ]
  }

  collideWithCircle(other: CircleCollideElement) {
    if (pointInPolygon(this.points, new Point(other.x, other.y))) {
      return true
    }
    for (const segment of this.segments) {
      if (other.collide(segment)) {
        return true
      }
    }
    return false
  }

  collideWithSegment(other: SegmentCollideElement) {
    if (pointInPolygon(this.points, other.point1)) {
      return true
    } else if (pointInPolygon(this.points, other.point2)) {
      return true
    }

    for (const mySegment of this.segments) {
      if (other.collide(mySegment)) {
        return true
      }
    }
    return false
  }

  collideWithTriangle(other: TriangleCollideElement) {
    for (const othePoint of other.points) {
      if (pointInPolygon(this.points, othePoint)) {
        return true
      }
    }
    for (const mySegment of this.segments) {
      for (const otherSegment of other.segments) {
        if (mySegment.collideWithSegment(otherSegment)) {
          return true
        }
      }
    }
    return false
  }
}
