import { Circle } from './circle'
import { Segment, Point } from '..'
import { circleSegment } from './circleSegment'

test('circleSegment(...)', () => {
  const circ = new Circle(0, 0, 10)
  const seg = new Segment(new Point(0, 0), new Point(20, 0))

  expect(circleSegment(circ, seg)).toBe(true)

  seg.point1 = new Point(-5, 0)
  seg.point2 = new Point(5, 0)

  expect(circleSegment(circ, seg)).toBe(true)

  seg.point1 = new Point(0, 11)
  seg.point2 = new Point(0, 21)

  expect(circleSegment(circ, seg)).toBe(false)
})
