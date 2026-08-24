import { describe, it, expect } from 'vitest'
import {
  computeProgressBarState,
  getProgressBarAccessibility,
  validateProgressBarProps,
} from '@munin-media/ui-core'

describe('ProgressBar (headless logic)', () => {
  it('computes display percent correctly', () => {
    const state = computeProgressBarState({ percent: 0.5, isCompleted: false })
    expect(state.displayPercent).toBe(50)
    expect(state.formattedPercent).toBe('50%')
    expect(state.isComplete).toBe(false)
  })

  it('marks complete when isCompleted is true', () => {
    const state = computeProgressBarState({ percent: 0.73, isCompleted: true })
    expect(state.isComplete).toBe(true)
    expect(state.displayPercent).toBe(73)
  })

  it('marks complete when percent >= 1', () => {
    const state = computeProgressBarState({ percent: 1.0, isCompleted: false })
    expect(state.isComplete).toBe(true)
    expect(state.displayPercent).toBe(100)
  })

  it('clamps percent above 1', () => {
    const state = computeProgressBarState({ percent: 1.5, isCompleted: false })
    expect(state.displayPercent).toBe(100)
  })

  it('clamps percent below 0', () => {
    const state = computeProgressBarState({ percent: -0.5, isCompleted: false })
    expect(state.displayPercent).toBe(0)
  })

  it('generates accessibility props', () => {
    const props = { percent: 0.73, isCompleted: false, label: 'Movie progress' }
    const state = computeProgressBarState(props)
    const a11y = getProgressBarAccessibility(props, state)
    expect(a11y.role).toBe('progressbar')
    expect(a11y.valueNow).toBe(73)
    expect(a11y.valueMin).toBe(0)
    expect(a11y.valueMax).toBe(100)
    expect(a11y.label).toBe('Movie progress')
  })

  it('uses default label when none provided', () => {
    const props = { percent: 0.42, isCompleted: false }
    const state = computeProgressBarState(props)
    const a11y = getProgressBarAccessibility(props, state)
    expect(a11y.label).toBe('Progress: 42%')
  })

  it('validates correct props', () => {
    expect(validateProgressBarProps({ percent: 0.5, isCompleted: false })).toBe(true)
    expect(validateProgressBarProps({ percent: 0.5, isCompleted: true, showLabel: true })).toBe(true)
  })

  it('rejects invalid props', () => {
    expect(validateProgressBarProps(null)).toBe(false)
    expect(validateProgressBarProps({})).toBe(false)
    expect(validateProgressBarProps({ percent: '50%', isCompleted: false })).toBe(false)
  })
})
