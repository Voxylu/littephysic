import { BaseCollideElement } from '..'

export interface CircleCollideElement extends BaseCollideElement {
  x: number
  y: number
  radius: number
  shape: 'circle'
}

export * from './circle'
