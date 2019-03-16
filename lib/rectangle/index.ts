import { BaseCollideElement } from '..'

export interface RectangleCollideElement extends BaseCollideElement {
  x: number
  y: number
  width: number
  height: number
  shape: 'rectangle'
}

export * from './rectangle'
