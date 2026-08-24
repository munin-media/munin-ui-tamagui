/**
 * @munin-media/ui-native-tamagui
 * Tamagui-styled Munin UI components for React Native and web.
 * Wraps @munin-media/ui-core headless logic with Tamagui styled() components.
 */

// Config & Provider
export { MuninProvider, useMuninTokens, defaultTokens } from './config.js'
export type { MuninTamaguiTokens } from './config.js'

// Types
export type { TamaguiComponentProps, TokenColor } from './types.js'

// Components
export { RatingInput } from './RatingInput.js'
export type { TamaguiRatingInputProps } from './RatingInput.js'

export { ProgressBar } from './ProgressBar.js'
export type { TamaguiProgressBarProps } from './ProgressBar.js'

export { ContinueWatching } from './ContinueWatching.js'
export type { TamaguiContinueWatchingProps } from './ContinueWatching.js'

export { SeriesTracker } from './SeriesTracker.js'
export type { TamaguiSeriesTrackerProps } from './SeriesTracker.js'

export { CollectionList } from './CollectionList.js'
export type { TamaguiCollectionListProps } from './CollectionList.js'

export { RecommendationCard } from './RecommendationCard.js'
export type { TamaguiRecommendationCardProps } from './RecommendationCard.js'
