import { Segment, Point } from './segment'
import { Rectangle } from '../rectangle'

describe('segment', () => {
  test('collideWithSegment(...)', () => {
    const seg1 = new Segment(new Point(0, 0), new Point(10, 10))
    const seg2 = new Segment(new Point(10, 0), new Point(0, 10))

    expect(seg1.collideWithSegment(seg2)).toBeTruthy()
    expect(seg2.collideWithSegment(seg1)).toBeTruthy()

    seg2.point1 = new Point(0, 0)

    expect(seg1.collideWithSegment(seg2)).toBeTruthy()
    expect(seg2.collideWithSegment(seg1)).toBeTruthy()

    seg2.point1 = new Point(1, 1)
    seg2.point2 = new Point(9, 9)

    expect(seg1.collideWithSegment(seg2)).toBe(false)
    expect(seg2.collideWithSegment(seg1)).toBe(false)

    seg1.point2 = new Point(0, 10)
    seg2.point1 = new Point(-5, 5)
    seg2.point2 = new Point(5, 5)

    expect(seg1.collideWithSegment(seg2)).toBeTruthy()
    expect(seg2.collideWithSegment(seg1)).toBeTruthy()
  })

  test('collideWithRectangle(...)', () => {
    const seg = new Segment(new Point(0, 0), new Point(10, 10))
    const rect = new Rectangle(10, 10, 10, 10)

    expect(seg.collideWithRectangle(rect)).toBe(true)

    seg.point2 = new Point(9, 9)

    expect(seg.collideWithRectangle(rect)).toBe(false)

    seg.point1 = new Point(11, 11)
    seg.point2 = new Point(19, 19)

    expect(seg.collideWithRectangle(rect)).toBe(true)

    seg.point1 = new Point(0, 15)
    seg.point2 = new Point(15, 15)

    expect(seg.collideWithRectangle(rect)).toBe(true)
  })
})
