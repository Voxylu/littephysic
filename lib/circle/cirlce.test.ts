import { Circle } from './circle'
import { Rectangle } from '..'

describe('circle', () => {
  test('collideWithCircle(...)', () => {
    const circ1 = new Circle(0, 0, 10)
    const circ2 = new Circle(0, 0, 5)

    expect(circ1.collideWithCircle(circ2)).toBe(true)
    expect(circ2.collideWithCircle(circ1)).toBe(true)

    circ1.x = 20

    expect(circ1.collideWithCircle(circ2)).toBe(false)
    expect(circ2.collideWithCircle(circ1)).toBe(false)
  })

  test('collideWithRectangle(...)', () => {
    const circ = new Circle(0, 0, 10)
    const rect = new Rectangle(11, 11, 10, 10)

    expect(circ.collideWithRectangle(rect)).toBe(false)

    rect.x = 5
    rect.y = 5

    expect(circ.collideWithRectangle(rect)).toBe(true)

    circ.x = 5
    circ.y = 5
    rect.x = 0
    rect.y = 0

    expect(circ.collideWithRectangle(rect)).toBe(true)
  })
})
