import { ScrollView } from 'react-native'
import { XStack, YStack, Text, styled } from 'tamagui'
import {
  computeContinueWatchingState,
  getContinueWatchingAccessibility,
  getContinueWatchingItemAccessibility,
  type ContinueWatchingProps,
} from '@munin-media/ui-core'
import { useMuninTokens } from './config.js'
import { ProgressBar } from './ProgressBar.js'
import type { TamaguiComponentProps } from './types.js'

// --- Styled components ---

const Card = styled(YStack, {
  width: 160,
  borderRadius: 8,
  overflow: 'hidden',
  borderWidth: 1,
})

const PosterPlaceholder = styled(YStack, {
  width: '100%',
  height: 90,
  alignItems: 'center',
  justifyContent: 'center',
})

// --- Props ---

export interface TamaguiContinueWatchingProps extends ContinueWatchingProps, TamaguiComponentProps {
  /** Render custom poster for a title */
  renderPoster?: (titleId: string) => React.ReactNode;
}

// --- Component ---

export function ContinueWatching(props: TamaguiContinueWatchingProps) {
  const { testID, onResume, renderPoster } = props
  const tokens = useMuninTokens()
  const state = computeContinueWatchingState(props)
  const a11y = getContinueWatchingAccessibility(props, state)

  if (state.isEmpty) {
    return (
      <YStack testID={testID} padding={16} alignItems="center">
        <Text color={tokens.textSecondary} fontSize={14}>
          {props.emptyMessage ?? 'Nothing to continue watching'}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack testID={testID} accessibilityRole="list" accessibilityLabel={a11y.label}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap={12} paddingVertical={8} paddingHorizontal={4}>
          {state.visibleItems.map((item) => {
            const itemA11y = getContinueWatchingItemAccessibility(item)
            return (
              <Card
                key={item.titleId}
                borderColor={tokens.border}
                backgroundColor={tokens.surface}
                onPress={() => onResume?.(item.titleId)}
                cursor="pointer"
                accessibilityRole="button"
                accessibilityLabel={itemA11y.label}
              >
                <PosterPlaceholder backgroundColor={tokens.surfaceInset}>
                  {renderPoster ? (
                    renderPoster(item.titleId)
                  ) : (
                    <Text color={tokens.textSecondary} fontSize={11}>
                      {item.titleId}
                    </Text>
                  )}
                </PosterPlaceholder>
                <YStack padding={8} gap={4}>
                  <Text
                    color={tokens.textSecondary}
                    fontSize={11}
                    numberOfLines={1}
                  >
                    {item.formattedResumeTime} • {item.percent}%
                  </Text>
                  <ProgressBar
                    percent={item.percent / 100}
                    isCompleted={false}
                    trackHeight={3}
                  />
                </YStack>
              </Card>
            )
          })}
        </XStack>
      </ScrollView>
    </YStack>
  )
}
