import { useState, useCallback } from 'react'
import { XStack, YStack, Text, styled } from 'tamagui'
import {
  computeSeriesTrackerState,
  getSeriesTrackerAccessibility,
  getSeasonAccessibility,
  type SeriesTrackerProps,
  type EpisodeDisplayState,
} from '@munin-media/ui-core'
import { useMuninTokens } from './config.js'
import type { TamaguiComponentProps } from './types.js'

// --- Styled components ---

const SeasonHeader = styled(XStack, {
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 6,
  cursor: 'pointer',
})

const EpisodeCell = styled(XStack, {
  width: 36,
  height: 36,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  cursor: 'pointer',
})

// --- Props ---

export interface TamaguiSeriesTrackerProps extends SeriesTrackerProps, TamaguiComponentProps {
  /** Called when a season header is toggled */
  onSeasonToggle?: (seasonNumber: number) => void;
}

// --- Component ---

export function SeriesTracker(props: TamaguiSeriesTrackerProps) {
  const { testID, onEpisodeSelect, onSeasonToggle } = props
  const tokens = useMuninTokens()
  const [expandedSeason, setExpandedSeason] = useState<number | undefined>(props.expandedSeason)

  const computeProps = { ...props, expandedSeason }
  const state = computeSeriesTrackerState(computeProps)
  const a11y = getSeriesTrackerAccessibility(computeProps, state)

  const handleSeasonToggle = useCallback((seasonNumber: number) => {
    setExpandedSeason((prev) => (prev === seasonNumber ? undefined : seasonNumber))
    onSeasonToggle?.(seasonNumber)
  }, [onSeasonToggle])

  const getEpisodeCellColor = (episode: EpisodeDisplayState) => {
    switch (episode.status) {
      case 'completed':
        return tokens.success
      case 'in-progress':
        return tokens.warning
      default:
        return tokens.surfaceInset
    }
  }

  return (
    <YStack testID={testID} gap={4} accessibilityLabel={a11y.label}>
      {/* Overall progress */}
      <XStack alignItems="center" justifyContent="space-between" paddingHorizontal={12}>
        <Text color={tokens.textPrimary} fontSize={14} fontWeight="600">
          {state.formattedOverall} complete
        </Text>
        <Text color={tokens.textSecondary} fontSize={12}>
          {state.completedEpisodes}/{state.totalEpisodes} episodes
        </Text>
      </XStack>

      {/* Season list */}
      {state.seasons.map((season) => {
        const seasonA11y = getSeasonAccessibility(season)
        return (
          <YStack key={season.seasonNumber} gap={4}>
            <SeasonHeader
              backgroundColor={tokens.surface}
              onPress={() => handleSeasonToggle(season.seasonNumber)}
              accessibilityRole="button"
              accessibilityLabel={seasonA11y.label}
            >
              <Text color={tokens.textPrimary} fontSize={13} fontWeight="500">
                Season {season.seasonNumber}
              </Text>
              <XStack gap={8} alignItems="center">
                <Text color={tokens.textSecondary} fontSize={12}>
                  {season.completedEpisodes}/{season.totalEpisodes}
                </Text>
                <Text color={tokens.textSecondary} fontSize={12}>
                  {season.isExpanded ? '▲' : '▼'}
                </Text>
              </XStack>
            </SeasonHeader>

            {season.isExpanded && (
              <XStack flexWrap="wrap" gap={6} paddingHorizontal={12} paddingBottom={8}>
                {season.episodes.map((episode) => (
                  <EpisodeCell
                    key={episode.episodeId}
                    backgroundColor={getEpisodeCellColor(episode)}
                    borderColor={tokens.border}
                    onPress={() => onEpisodeSelect?.(episode.episodeId)}
                    accessibilityRole="button"
                    accessibilityLabel={`Episode ${episode.episodeNumber}: ${episode.status}`}
                  >
                    <Text
                      fontSize={11}
                      fontWeight={episode.status === 'completed' ? '700' : '400'}
                      color={episode.status === 'completed' ? tokens.surface : tokens.textPrimary}
                    >
                      {episode.episodeNumber}
                    </Text>
                  </EpisodeCell>
                ))}
              </XStack>
            )}
          </YStack>
        )
      })}
    </YStack>
  )
}
