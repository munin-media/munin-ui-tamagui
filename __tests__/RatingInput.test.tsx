import { describe, it, expect } from 'vitest'
import {
  computeRatingInputState,
  getRatingInputAccessibility,
  validateRatingInputProps,
} from '@munin-media/ui-core'

describe('RatingInput (headless logic)', () => {
  it('computes state with defaults (1-10)', () => {
    const state = computeRatingInputState({ value: 5 })
    expect(state.currentValue).toBe(5)
    expect(state.steps).toHaveLength(10)
    expect(state.steps[0]).toBe(1)
    expect(state.steps[9]).toBe(10)
    expect(state.displayValue).toBe(5)
    expect(state.hoveredValue).toBeNull()
    expect(state.isInteracting).toBe(false)
  })

  it('defaults value to min when unset', () => {
    const state = computeRatingInputState({})
    expect(state.currentValue).toBe(1)
    expect(state.displayValue).toBe(1)
  })

  it('respects custom min/max', () => {
    const state = computeRatingInputState({ min: 1, max: 5, value: 3 })
    expect(state.steps).toHaveLength(5)
    expect(state.steps).toEqual([1, 2, 3, 4, 5])
    expect(state.currentValue).toBe(3)
  })

  it('populates selectedTags from props', () => {
    const state = computeRatingInputState({
      value: 7,
      selectedTags: ['action', 'thriller'],
    })
    expect(state.selectedTags).toEqual(['action', 'thriller'])
  })

  it('defaults selectedTags to empty array', () => {
    const state = computeRatingInputState({ value: 5 })
    expect(state.selectedTags).toEqual([])
  })

  it('generates accessibility props for stars variant', () => {
    const props = { value: 7, variant: 'stars' as const }
    const state = computeRatingInputState(props)
    const a11y = getRatingInputAccessibility(props, state)
    expect(a11y.role).toBe('slider')
    expect(a11y.valueNow).toBe(7)
    expect(a11y.valueMin).toBe(1)
    expect(a11y.valueMax).toBe(10)
    expect(a11y.label).toContain('7')
    expect(a11y.label).toContain('stars')
  })

  it('generates accessibility props for numeric variant', () => {
    const props = { value: 3, variant: 'numeric' as const, min: 1, max: 5 }
    const state = computeRatingInputState(props)
    const a11y = getRatingInputAccessibility(props, state)
    expect(a11y.valueMin).toBe(1)
    expect(a11y.valueMax).toBe(5)
    expect(a11y.label).toContain('numeric')
  })

  it('validates correct props', () => {
    expect(validateRatingInputProps({})).toBe(true)
    expect(validateRatingInputProps({ value: 5, min: 1, max: 10 })).toBe(true)
    expect(validateRatingInputProps({ variant: 'stars' })).toBe(true)
    expect(validateRatingInputProps({ variant: 'slider' })).toBe(true)
    expect(validateRatingInputProps({ variant: 'numeric' })).toBe(true)
  })

  it('rejects invalid props', () => {
    expect(validateRatingInputProps(null)).toBe(false)
    expect(validateRatingInputProps({ min: 'hello' })).toBe(false)
    expect(validateRatingInputProps({ variant: 'invalid' })).toBe(false)
  })
})
