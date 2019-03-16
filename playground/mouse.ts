import { Vancas } from 'vancas'

export class MouseCalculator {
  public x = 0
  public y = 0

  constructor(private rect: ClientRect | DOMRect) {
    window.addEventListener('mousemove', this.handleMouve)
    // window.addEventListener('click', this.handleMouve)
    window.addEventListener('mousedown', this.handleClick)
  }

  destroy() {
    window.removeEventListener('mousemove', this.handleMouve)
    // window.removeEventListener('click', this.handleMouve)
    window.removeEventListener('mousedown', this.handleClick)
  }

  private fn = () => {}

  handleClick = () => {
    this.fn()
  }

  onClick(fn: () => any) {
    this.fn = fn
  }

  handleMouve = (event: MouseEvent) => {
    this.x = event.clientX - this.rect.left
    this.y = event.clientY - this.rect.top
  }
}
