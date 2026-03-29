# nextRN — React Native Product Listing App

A fast, lightweight product listing app built with Expo and React Native, targeting low-end mobile devices (1–2GB RAM).

---

## How I Used AI to Build This

I didn't just ask Claude to "build me an app." I directed it like a technical lead — giving it constraints, rejecting approaches I didn't agree with, and iterating on problems as they surfaced.

**The prompts that shaped the project:**

- _"Create a React Native app within the folder, follow CLAUDE.md"_ — I wrote the spec first in CLAUDE.md before generating a single line of code. This forced the AI to work within my constraints (feature-based folders, specific packages, FlashList for rendering, no class components) rather than its defaults.
- _"Add pagination but when flipped on, the app should load 1000+ items. Your app must not crash, freeze, or drop frames while scrolling."_ — I gave it a performance requirement, not just a feature request.
- _"When I click the item multiple times, it navigates to viewing products yet it's flickering and I need to press back multiple times."_ — Real bug caught during testing. I tracked this down myself — multiple rapid taps were pushing duplicate routes onto the stack. I fixed it by adding a `useRef` navigation guard that blocks subsequent taps for 800ms after the first, avoiding a re-render that `useState` would have caused.

- _"On Image use expo-image instead and optimize it."_ — I knew the built-in `Image` had no disk cache. I directed the change specifically.
- _"When I scroll fast it still shows a white screen before showing items."_ — Switched to FlashList which solved it at the architecture level. FlashList recycles cells natively instead of going through the JS thread, eliminating the blank screen problem entirely.
- _"VirtualizedList: You have a large list that is slow to update."_ — React Native warning caught in testing. Root cause: `useRouter()` inside every `ProductCard` subscribed to navigation state, causing all visible cards to re-render on any navigation event. Fixed by lifting router out of the card entirely.
- _"The sorting needs to talk with the API."_ — I initially accepted client-side sort, then pushed back. Sort params now flow through the query key, API call, and React Query cache — each sort combination is cached separately.
- _"The size of the skeleton and the actual size of the card is not the same."_ — Caught a 2px mismatch caused by border rendering. Fixed by exporting `cardStyle` from `ProductCard` and importing it directly into `ProductCardSkeleton` so both share one source of truth.

---

## Architecture

```
app/
├── _layout.jsx          # Root layout: QueryClientProvider + Stack nav
├── index.jsx            # Product list screen
└── product/
    └── [id].jsx         # Product detail screen (dynamic route)

src/
├── lib/
│   ├── axios.js         # Axios instance + Slow 3G interceptor
│   └── queryClient.js   # React Query config (stale/gc times)
└── features/products/
    ├── api.js           # All API calls (fetch, search, fetchAll)
    ├── store.js         # Zustand store (search, page, sort, favorites, toggles)
    ├── hooks/
    │   ├── useProducts.js           # Paginated query
    │   ├── useProduct.js            # Single product query
    │   ├── useSearchProducts.js     # Search query
    │   ├── useStressProducts.js     # Infinite query for 1000+ stress test
    │   └── useNavigateToProduct.js  # Stable navigation handler
    └── components/
        ├── ProductCard.jsx
        ├── ProductCardSkeleton.jsx
        ├── ProductDetailSkeleton.jsx
        ├── SkeletonBox.jsx
        ├── SearchBar.jsx
        ├── Pagination.jsx
        ├── SortBar.jsx
        ├── FavoriteButton.jsx
        ├── Slow3GToggle.jsx
        └── StressTestToggle.jsx
```

**Why feature-based folders?** Flat component folders collapse fast. Putting `api.js`, `store.js`, `hooks/`, and `components/` all under `features/products/` means everything related to products lives together. Adding a `cart` feature means adding `features/cart/` — nothing else moves.

**Why Zustand over Redux?** The state here is simple: a search string, a page number, sort fields, a Set of IDs, two booleans. Redux would add actions, reducers, selectors, and a provider for state that fits in 20 lines. Zustand also lets you call `useProductStore.getState()` outside React — used in the Axios interceptor to read `slow3G` without hooks.

**Why React Query over `useEffect` + `useState`?** Every `useEffect` data-fetch reinvents caching, loading states, error states, deduplication, and retries. React Query gives all of that for free. The 5-minute `staleTime` means navigating back to the list never re-fetches if the data is fresh. The 10-minute `gcTime` keeps data in memory even after the component unmounts — instant re-render when you navigate back.

---

## Performance Strategy

### Why FlashList

`@shopify/flash-list` uses a native recycling mechanism (similar to Android's `RecyclerView`). Cells are reused natively rather than unmounted and remounted through JS. Fast flings don't produce white screens because rendering isn't gated on the JS thread catching up.

### `overrideItemLayout` + `estimatedItemSize`

```js
estimatedItemSize={ITEM_HEIGHT}
overrideItemLayout={(layout) => {
  layout.size = ITEM_HEIGHT;
}}
```

`estimatedItemSize` gives FlashList an initial size hint for layout calculations. `overrideItemLayout` gives it the exact size — eliminating any measurement or recalculation per item. Both point to the same `ITEM_HEIGHT` constant exported from `ProductCard`.

**The constraint this creates:** Every list item must be exactly `ITEM_HEIGHT` pixels tall. `ProductCard` uses `StyleSheet` (not Tailwind classes) to guarantee this. The same `cardStyle` object is shared with `ProductCardSkeleton` so both are always pixel-identical.

### `drawDistance={1500}`

FlashList renders content 1500px ahead of and behind the visible viewport. On a fast fling, there's already a large buffer of rendered cells before the scroll position reaches blank space. Default is 250px — too shallow for aggressive scrolling through 1000 items.

### Fixed header outside FlashList

The header (title + toggles + search bar + sort bar) lives in a plain `View` above FlashList, not in `ListHeaderComponent`. The reason: any time `ListHeaderComponent` receives a new object reference, the list remeasures its header and can reset scroll position. Moving the header out of the list entirely eliminates the problem at the root.

### `renderItem` and `keyExtractor` outside the component

```js
// Module level — zero allocation cost on re-renders
const keyExtractor = (item) =>
  item._key !== undefined ? item._key.toString() : item.id.toString();
```

`renderItem` is `useCallback` with `[navigateTo]` as its only dependency. `navigateTo` comes from `useNavigateToProduct` which is stable for the lifetime of the screen. This means `renderItem` never gets a new reference between renders, so FlashList never re-renders cells unnecessarily.

In stress test mode, items use a `_key` field for list uniqueness while keeping the real `product.id` for navigation — so tapping any card opens the correct product detail.

### `useRouter` lifted out of `ProductCard`

`useRouter()` subscribes to navigation state. Every navigation event (pushing a route, going back) caused every mounted `ProductCard` to re-render — defeating `React.memo` entirely. The fix: `ProductCard` accepts a plain `onPress` prop. A single `useNavigateToProduct` hook in the screen handles routing, and its stable reference is passed down once.

---

## Skeleton Loading

Every loading state in the app shows skeleton cards — no spinners anywhere.

| State                         | Skeleton shown                                         |
| ----------------------------- | ------------------------------------------------------ |
| Initial product list load     | 7 `ProductCardSkeleton` cards                          |
| Pagination page change        | 7 `ProductCardSkeleton` cards (replaces full list)     |
| Stress test incremental fetch | 7 `ProductCardSkeleton` cards in `ListFooterComponent` |
| Product detail load           | `ProductDetailSkeleton` (mirrors full detail layout)   |

**Why skeletons over spinners?** Spinners communicate "something is happening" but give no hint of what's coming. Skeletons communicate the shape of the content, which reduces perceived load time and eliminates layout shift when real content arrives — the space is already reserved.

**Skeleton sizing:** `ProductCardSkeleton` imports `cardStyle` directly from `ProductCard`. Both share one style object, so the skeleton is guaranteed to be the same height as the real card. When the skeleton is inside `ListFooterComponent`, it inherits `paddingHorizontal: 16` from `contentContainerStyle` so no extra padding is added.

---

## Image Optimization

Using `expo-image` instead of React Native's built-in `Image`:

```jsx
<Image
  source={product.thumbnail}
  style={styles.image}
  contentFit="cover"
  transition={0}
  cachePolicy="memory-disk"
  recyclingKey={product.id.toString()}
/>
```

**`cachePolicy="memory-disk"`** — Images are decoded and stored in both memory (instant access while app is open) and disk (survives app restart). Scrolling back through a list never re-downloads an image.

**`recyclingKey={product.id}`** — FlashList aggressively recycles cell components (the same `ProductCard` instance renders different products as you scroll). Without `recyclingKey`, expo-image might briefly show the previous product's image in a recycled cell. The key tells expo-image to treat this as a new image load when the product changes.

**`transition={0}`** — Initially set to 150ms fade. Removed because during fast scrolling the fade made each image appear to flash in, which looked worse than an instant render from cache.

**`source={product.thumbnail}`** — expo-image accepts a plain string URI directly. No `{ uri: string }` wrapper needed.

---

## Preventing Memory Issues

### `useRouter` removed from list items

With 200 `ProductCard` instances in memory during scrolling, having each one subscribed to navigation state via `useRouter()` meant every navigation event triggered ~200 re-renders. `useNavigateToProduct` centralises this into one hook at the screen level.

### Zustand selector isolation for favorites

```js
// In FavoriteButton — only this component re-renders when its ID changes
const isFav = useProductStore((s) => s.favorites.has(id));
```

Each `FavoriteButton` subscribes to only its own boolean. When a favorite is toggled, Zustand re-runs all selectors but only re-renders components whose selector returned a different value. Toggling one heart never re-renders other cards on screen.

### Stress test: incremental fetch with `useInfiniteQuery`

The 1000-item stress test doesn't load 1000 items upfront. It uses `useInfiniteQuery` to fetch 20 items at a time as you scroll, cycling through the API's real product list using modulo wrapping:

```js
const apiSkip = pageParam.apiTotal
  ? pageParam.virtualLoaded % pageParam.apiTotal
  : 0;
```

`staleTime: Infinity` means once the stress data is fetched it's never refetched. The query key includes `sortBy` and `sortOrder` so changing the sort invalidates and rebuilds the dataset with the new ordering.

### Navigation guard with `useRef`

```js
const navigating = useRef(false);

return useCallback(
  (id) => {
    if (navigating.current) return;
    navigating.current = true;
    router.push(`/product/${id}`);
    setTimeout(() => {
      navigating.current = false;
    }, 800);
  },
  [router],
);
```

Multiple rapid taps push multiple routes onto the stack — each requiring its own API fetch, component tree, and memory allocation. The ref blocks subsequent taps after the first without triggering a re-render (unlike `useState`).

### React Query cache settings

```js
staleTime: 1000 * 60 * 5,   // 5 minutes — don't re-fetch fresh data
gcTime: 1000 * 60 * 10,     // 10 minutes — keep cache after unmount
retry: 2,                    // don't hammer a failing API
refetchOnWindowFocus: false, // don't re-fetch when switching apps
```

The `gcTime` is the key memory setting. When you navigate away from the product list, React Query keeps the cached pages in memory for 10 minutes. Navigate back and the list renders instantly from cache. Each unique combination of `[page, sortBy, sortOrder]` is a separate cache entry.

---

## Search & Sort

**Search debounce:** `SearchBar` uses a `useRef` timer — no library needed. Every keystroke clears the previous timeout and starts a 300ms one. The store and API are only updated once the user pauses typing.

**Server-side sort:** Sort params flow all the way to the API:

```
SortBar (UI) → store (sortBy, sortOrder)
             → useProducts(page, sortBy, sortOrder)
             → fetchProducts(skip, sortBy, order)
             → GET /products?sortBy=price&order=asc
```

The query key includes sort state, so each sort combination is cached separately. Switching between sort options and back is instant from cache.

Sorting works across all three modes: normal pagination, search results, and the 1000+ stress test.

---

## Running the App

### Android APK (quickest)

This project uses Expo SDK 55 canary, which isn't supported by the Play Store version of Expo Go yet. The APK is a standalone build that runs without Expo Go or any local setup:

**[Download APK](https://expo.dev/accounts/pauljacobalcaraz/projects/nextRN/builds/2de20ad3-164e-459a-97cc-4b1bad7139cc)**

### Run locally

```bash
npm install
npx expo start
```
# ProductDummyRN
