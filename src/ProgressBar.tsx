import { XStack, YStack, Text, styled } from 'tamagui'
import {
  computeProgressBarState,
  getProgressBarAccessibility,
  type ProgressBarProps,
} from '@munin-media/ui-core'
import { useMuninTokens } from './config.js'
import type { TamaguiComponentProps } from './types.js'

// --- Styled components ---

const Track = styled(XStack, {
  height: 6,
  borderRadius: 3,
  overflow: 'hidden',
  width: '100%',
})

const Fill = styled(XStack, {
  height: '100%',
  borderRadius: 3,
})

// --- Props ---

export interface TamaguiProgressBarProps extends ProgressBarProps, TamaguiComponentProps {
  /** Height of the progress track */
  trackHeight?: number;
  /** Called when the bar is pressed */
  onPress?: () => void;
}

// --- Component ---

export function ProgressBar(props: TamaguiProgressBarProps) {
  const { testID, trackHeight = 6, onPress, ...rest } = props
  const tokens = useMuninTokens()
  const state = computeProgressBarState(props)
  const a11y = getProgressBarAccessibility(props, state)

  const fillColor = state.isComplete ? tokens.success : tokens.interactive

  return (
    <YStack testID={testID} gap={4} onPress={onPress} cursor={onPress ? 'pointer' : undefined}>
      <Track
        height={trackHeight}
        borderRadius={trackHeight / 2}
        backgroundColor={tokens.surfaceInset}
        accessibilityRole="progressbar"
        accessibilityLabel={a11y.label}
        accessibilityValue={{
          min: a11y.valueMin,
          max: a11y.valueMax,
          now: a11y.valueNow,
        }}
      >
        <Fill
          width={`${state.displayPercent}%`}
          height={trackHeight}
          borderRadius={trackHeight / 2}
          backgroundColor={fillColor}
        />
      </Track>
      {props.showLabel && (
        <Text color={tokens.textSecondary} fontSize={12}>
          {state.formattedPercent}
        </Text>
      )}
    </YStack>
  )
}
