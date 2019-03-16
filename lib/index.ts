import { RectangleCollideElement } from './rectangle'
import { SegmentCollideElement } from './segment'
import { CircleCollideElement } from './circle'

export * from './rectangle'
export * from './circle'
export * from './segment'

export interface BaseCollideElement {
  shape: string
  collide(element: CollideElement): boolean
}

export type CollideElement =
  | RectangleCollideElement
  | SegmentCollideElement
  | CircleCollideElement
