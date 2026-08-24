# @munin-media/ui-native-tamagui

Tamagui-styled Munin UI components for React Native and web. Wraps `@munin-media/ui-core` headless logic with Tamagui `styled()` components.

## Installation

```bash
yarn add @munin-media/ui-native-tamagui
```

### Peer Dependencies

- `@munin-media/ui-core` ^1.0.0
- `tamagui` >=1.100.0
- `react` >=18.0.0
- `react-native` >=0.72.0

## Usage

```tsx
import { MuninProvider, ProgressBar, RatingInput } from '@munin-media/ui-native-tamagui'

function App() {
  return (
    <MuninProvider tokens={{ interactive: '$blue10' }}>
      <ProgressBar percent={0.73} isCompleted={false} showLabel />
      <RatingInput
        value={7}
        suggestedTags={['action', 'sci-fi']}
        onRate={(result) => console.log(result)}
      />
    </MuninProvider>
  )
}
```

## Components

| Component | Description |
|-----------|-------------|
| `ProgressBar` | Animated progress bar with track/fill |
| `RatingInput` | Star rating (1-10) with tag chips, supports stars/slider/numeric variants |
| `ContinueWatching` | Horizontal scrollable list of in-progress titles |
| `SeriesTracker` | Season/episode grid with expand/collapse |
| `CollectionList` | Grid of saved collections |
| `RecommendationCard` | Title card with match score and reason |

## Token Customization

Wrap your app with `MuninProvider` to override default Tamagui token mappings:

```tsx
<MuninProvider tokens={{
  interactive: '$blue10',
  success: '$green10',
  surface: '$background',
}}>
  {children}
</MuninProvider>
```

Default tokens map to standard Tamagui theme tokens (`$interactive`, `$border`, etc.).

## Architecture

- **Headless logic** from `@munin-media/ui-core` (compute functions, accessibility, validation)
- **Styled rendering** with Tamagui primitives (`XStack`, `YStack`, `Text`, `styled`)
- **Token theming** via `MuninProvider` context
- **Platform-agnostic** — works on React Native and Expo web

## Development

```bash
yarn install
yarn typecheck
yarn test
yarn build
```

## License

MIT
