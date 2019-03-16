import { Rectangle } from '.'

describe('rectangle', () => {
  test('collideWithRectangle(...)', () => {
    const rect1 = new Rectangle(0, 0, 10, 10)
    const rect2 = new Rectangle(10, 10, 10, 10)

    expect(rect1.collideWithRectangle(rect2)).toBe(false)
    expect(rect2.collideWithRectangle(rect1)).toBe(false)

    rect1.x = 1
    rect1.y = 1

    expect(rect1.collideWithRectangle(rect2)).toBe(true)
    expect(rect2.collideWithRectangle(rect1)).toBe(true)

    rect1.x = 15
    rect1.y = 15
    rect1.width = 5
    rect1.height = 5

    expect(rect1.collideWithRectangle(rect2)).toBe(true)
    expect(rect2.collideWithRectangle(rect1)).toBe(true)
  })
})
