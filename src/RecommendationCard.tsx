import { XStack, YStack, Text, styled } from 'tamagui'
import {
  computeRecommendationCardState,
  getRecommendationCardAccessibility,
  type RecommendationCardProps,
} from '@munin-media/ui-core'
import { useMuninTokens } from './config.js'
import type { TamaguiComponentProps } from './types.js'

// --- Styled components ---

const CardContainer = styled(YStack, {
  borderRadius: 10,
  borderWidth: 1,
  overflow: 'hidden',
  cursor: 'pointer',
})

const ScoreBadge = styled(XStack, {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
  alignItems: 'center',
})

const TagPill = styled(XStack, {
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 10,
  borderWidth: 1,
})

// --- Props ---

export interface TamaguiRecommendationCardProps extends RecommendationCardProps, TamaguiComponentProps {
  /** Title text (not from core — provided by consuming app with metadata) */
  title?: string;
  /** Release year */
  year?: number;
  /** Genre labels */
  genres?: string[];
}

// --- Component ---

export function RecommendationCard(props: TamaguiRecommendationCardProps) {
  const { testID, onPress, onDismiss, title, year, genres = [] } = props
  const tokens = useMuninTokens()
  const state = computeRecommendationCardState(props)
  const a11y = getRecommendationCardAccessibility(props, state)

  return (
    <CardContainer
      testID={testID}
      borderColor={tokens.border}
      backgroundColor={tokens.surface}
      onPress={() => onPress?.(state.titleId)}
      accessibilityRole="button"
      accessibilityLabel={a11y.label}
    >
      <YStack padding={12} gap={8}>
        {/* Header: title + score */}
        <XStack alignItems="center" justifyContent="space-between">
          <YStack flex={1} marginRight={8}>
            {title && (
              <Text
                color={tokens.textPrimary}
                fontSize={15}
                fontWeight="600"
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
            {year && (
              <Text color={tokens.textSecondary} fontSize={12}>
                {year}
              </Text>
            )}
          </YStack>
          <ScoreBadge backgroundColor={tokens.interactive}>
            <Text color={tokens.surface} fontSize={12} fontWeight="700">
              {state.formattedScore}
            </Text>
          </ScoreBadge>
        </XStack>

        {/* Genres */}
        {genres.length > 0 && (
          <XStack gap={6} flexWrap="wrap">
            {genres.map((genre) => (
              <Text key={genre} color={tokens.textSecondary} fontSize={11}>
                {genre}
              </Text>
            ))}
          </XStack>
        )}

        {/* Matching tags */}
        {state.visibleTags.length > 0 && (
          <XStack gap={4} flexWrap="wrap">
            {state.visibleTags.map((tag) => (
              <TagPill key={tag} borderColor={tokens.border}>
                <Text color={tokens.textSecondary} fontSize={10}>
                  {tag}
                </Text>
              </TagPill>
            ))}
            {state.hasMoreTags && (
              <Text color={tokens.textSecondary} fontSize={10}>
                +more
              </Text>
            )}
          </XStack>
        )}

        {/* Reason */}
        <Text color={tokens.textSecondary} fontSize={12} opacity={0.8}>
          {state.reason}
        </Text>

        {/* Dismiss button */}
        {onDismiss && (
          <XStack justifyContent="flex-end">
            <Text
              color={tokens.textSecondary}
              fontSize={11}
              onPress={(e) => {
                e.stopPropagation?.()
                onDismiss(state.titleId)
              }}
              cursor="pointer"
            >
              Dismiss
            </Text>
          </XStack>
        )}
      </YStack>
    </CardContainer>
  )
}
