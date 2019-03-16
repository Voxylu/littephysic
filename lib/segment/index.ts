import { BaseCollideElement } from '..'
import { Point } from './segment'

export interface SegmentCollideElement extends BaseCollideElement {
  shape: 'segment'
  point1: Point
  point2: Point
}

export * from './segment'
