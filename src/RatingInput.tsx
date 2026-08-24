import { useState, useCallback } from 'react'
import { XStack, YStack, Text, styled } from 'tamagui'
import {
  computeRatingInputState,
  getRatingInputAccessibility,
  type RatingInputProps,
  type RatingResult,
} from '@munin-media/ui-core'
import { useMuninTokens } from './config.js'
import type { TamaguiComponentProps } from './types.js'

// --- Styled components ---

const StarButton = styled(XStack, {
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  cursor: 'pointer',
})

const TagChip = styled(XStack, {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
  borderWidth: 1,
  alignItems: 'center',
  variants: {
    selected: {
      true: { opacity: 1 },
      false: { opacity: 0.6 },
    },
  } as const,
})

// --- Props ---

export interface TamaguiRatingInputProps extends RatingInputProps, TamaguiComponentProps {
  /** Called when a tag is toggled */
  onTagToggle?: (tag: string) => void;
}

// --- Component ---

export function RatingInput(props: TamaguiRatingInputProps) {
  const { onRate, onTagToggle, testID, suggestedTags = [], ...rest } = props
  const tokens = useMuninTokens()
  const state = computeRatingInputState(props)
  const a11y = getRatingInputAccessibility(props, state)
  const variant = props.variant ?? 'stars'

  const [currentValue, setCurrentValue] = useState(state.currentValue)
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>(state.selectedTags)

  const displayValue = hoveredValue ?? currentValue

  const handleStarPress = useCallback((value: number) => {
    setCurrentValue(value)
    onRate?.({ score: value, tags: selectedTags })
  }, [onRate, selectedTags])

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
      onTagToggle?.(tag)
      return next
    })
  }, [onTagToggle])

  return (
    <YStack
      testID={testID}
      gap={8}
      accessibilityRole="adjustable"
      accessibilityLabel={a11y.label}
      accessibilityValue={{
        min: a11y.valueMin,
        max: a11y.valueMax,
        now: displayValue,
      }}
    >
      {variant === 'stars' && (
        <XStack gap={4} alignItems="center">
          {state.steps.map((step) => (
            <StarButton
              key={step}
              onPress={() => handleStarPress(step)}
              onHoverIn={() => setHoveredValue(step)}
              onHoverOut={() => setHoveredValue(null)}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${step} of ${state.steps.length}`}
            >
              <Text
                fontSize={20}
                color={step <= displayValue ? tokens.interactive : tokens.border}
              >
                ★
              </Text>
            </StarButton>
          ))}
          <Text color={tokens.textSecondary} fontSize={14} marginLeft={8}>
            {displayValue}/{state.steps.length}
          </Text>
        </XStack>
      )}

      {variant === 'numeric' && (
        <XStack gap={4} alignItems="center" flexWrap="wrap">
          {state.steps.map((step) => (
            <StarButton
              key={step}
              onPress={() => handleStarPress(step)}
              backgroundColor={step === currentValue ? tokens.interactive : tokens.surface}
              borderRadius={6}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${step}`}
            >
              <Text
                color={step === currentValue ? tokens.surface : tokens.textPrimary}
                fontSize={14}
                fontWeight={step === currentValue ? '700' : '400'}
              >
                {step}
              </Text>
            </StarButton>
          ))}
        </XStack>
      )}

      {variant === 'slider' && (
        <XStack gap={8} alignItems="center">
          <Text color={tokens.textSecondary} fontSize={12}>
            {state.steps[0]}
          </Text>
          <XStack flex={1} height={4} backgroundColor={tokens.surfaceInset} borderRadius={2}>
            <XStack
              height={4}
              borderRadius={2}
              backgroundColor={tokens.interactive}
              width={`${((currentValue - (state.steps[0] ?? 1)) / (state.steps.length - 1)) * 100}%`}
            />
          </XStack>
          <Text color={tokens.textSecondary} fontSize={12}>
            {state.steps[state.steps.length - 1]}
          </Text>
          <Text color={tokens.textPrimary} fontSize={14} fontWeight="600">
            {currentValue}
          </Text>
        </XStack>
      )}

      {suggestedTags.length > 0 && (
        <XStack gap={6} flexWrap="wrap" marginTop={4}>
          {suggestedTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <TagChip
                key={tag}
                selected={isSelected}
                borderColor={isSelected ? tokens.interactive : tokens.border}
                backgroundColor={isSelected ? tokens.interactive : 'transparent'}
                onPress={() => handleTagToggle(tag)}
                accessibilityRole="button"
                accessibilityLabel={`Tag: ${tag}${isSelected ? ', selected' : ''}`}
              >
                <Text
                  fontSize={12}
                  color={isSelected ? tokens.surface : tokens.textSecondary}
                >
                  {tag}
                </Text>
              </TagChip>
            )
          })}
        </XStack>
      )}
    </YStack>
  )
}
