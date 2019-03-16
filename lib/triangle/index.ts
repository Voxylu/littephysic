import { BaseCollideElement, Point } from '..'
import { Segment } from '../segment'

export interface TriangleCollideElement extends BaseCollideElement {
  shape: 'triangle'
  point1: Point
  point2: Point
  point3: Point
  points: Point[]
  segments: Segment[]
}

export * from './triangle'
