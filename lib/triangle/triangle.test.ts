import { Triangle } from '.'
import { Point } from '../segment'

describe('triangle', () => {
  test('collideWithTriangle(...)', () => {
    const tri1 = new Triangle(
      new Point(100, 300),
      new Point(50, 350),
      new Point(150, 350)
    )
    const tri2 = new Triangle(
      new Point(155, 340),
      new Point(170, 360),
      new Point(140, 360)
    )

    expect(tri1.collide(tri2)).toBe(true)
    expect(tri2.collide(tri1)).toBe(true)
  })
})
