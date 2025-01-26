import { describe, it, expect, beforeEach } from 'vitest'
import { Canvas, Circle, Arc } from './main'

describe('Canvas', () => {
  let canvas, context

  beforeEach(() => {
    context = {
      clearRect: vi.fn(),
      draw: vi.fn(),
    }
    canvas = new Canvas(context)
  })

  it('should add a Circle element', () => {
    const params = { id: 'circle1' }
    const element = canvas.addElement('circle', params)
    expect(element).toBeInstanceOf(Circle)
    expect(canvas.elements).toContain(element)
  })

  it('should add an Arc element', () => {
    const params = { id: 'arc1' }
    const element = canvas.addElement('arc', params)
    expect(element).toBeInstanceOf(Arc)
    expect(canvas.elements).toContain(element)
  })

  it('should remove an element', () => {
    const params = { id: 'circle1' }
    const element = canvas.addElement('circle', params)
    canvas.removeElement(element)
    expect(canvas.elements).not.toContain(element)
  })

  it('should get an element by id', () => {
    const params = { id: 'circle1' }
    const element = canvas.addElement('circle', params)
    const foundElement = canvas.getElementById('circle1')
    expect(foundElement).toBe(element)
  })

  it('should append a child element and draw it', () => {
    const element = { draw: vi.fn() }
    canvas.appendChild(element)
    expect(canvas.elements).toContain(element)
    expect(element.draw).toHaveBeenCalledWith(context)
  })

  it('should clear and draw all elements', () => {
    const element = { draw: vi.fn() }
    canvas.appendChild(element)
    canvas.draw()
    expect(context.clearRect).toHaveBeenCalled()
    expect(element.draw).toHaveBeenCalledWith(context)
  })
})