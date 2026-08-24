import { XStack, YStack, Text, styled } from 'tamagui'
import {
  computeCollectionListState,
  getCollectionListAccessibility,
  getCollectionItemAccessibility,
  type CollectionListProps,
} from '@munin-media/ui-core'
import { useMuninTokens } from './config.js'
import type { TamaguiComponentProps } from './types.js'

// --- Styled components ---

const CollectionCard = styled(YStack, {
  borderRadius: 10,
  overflow: 'hidden',
  borderWidth: 1,
  cursor: 'pointer',
})

const Thumbnail = styled(YStack, {
  width: '100%',
  height: 80,
  alignItems: 'center',
  justifyContent: 'center',
})

// --- Props ---

export interface TamaguiCollectionListProps extends CollectionListProps, TamaguiComponentProps {
  /** Number of columns in the grid */
  columns?: number;
  /** Render custom thumbnail for a collection */
  renderThumbnail?: (collectionId: string) => React.ReactNode;
}

// --- Component ---

export function CollectionList(props: TamaguiCollectionListProps) {
  const { testID, onSelect, onDelete, columns = 2, renderThumbnail } = props
  const tokens = useMuninTokens()
  const state = computeCollectionListState(props)
  const a11y = getCollectionListAccessibility(props, state)

  if (state.isEmpty) {
    return (
      <YStack testID={testID} padding={16} alignItems="center">
        <Text color={tokens.textSecondary} fontSize={14}>
          {props.emptyMessage ?? 'No collections yet'}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack testID={testID} accessibilityRole="list" accessibilityLabel={a11y.label}>
      <XStack flexWrap="wrap" gap={12}>
        {state.items.map((item) => {
          const itemA11y = getCollectionItemAccessibility(item)
          return (
            <CollectionCard
              key={item.collectionId}
              width={`${Math.floor(100 / columns) - 2}%`}
              borderColor={tokens.border}
              backgroundColor={tokens.surface}
              onPress={() => onSelect?.(item.collectionId)}
              accessibilityRole="button"
              accessibilityLabel={itemA11y.label}
            >
              <Thumbnail backgroundColor={tokens.surfaceInset}>
                {renderThumbnail ? (
                  renderThumbnail(item.collectionId)
                ) : (
                  <Text color={tokens.textSecondary} fontSize={20}>
                    📁
                  </Text>
                )}
              </Thumbnail>
              <YStack padding={10} gap={2}>
                <Text
                  color={tokens.textPrimary}
                  fontSize={13}
                  fontWeight="600"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <XStack alignItems="center" justifyContent="space-between">
                  <Text color={tokens.textSecondary} fontSize={11}>
                    {item.formattedCount}
                  </Text>
                  <Text color={tokens.textSecondary} fontSize={10}>
                    {item.type}
                  </Text>
                </XStack>
              </YStack>
            </CollectionCard>
          )
        })}
      </XStack>
    </YStack>
  )
}
