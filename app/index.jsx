import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, RefreshControl, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useProducts,
  PAGE_SIZE,
} from "../src/features/products/hooks/useProducts";
import { useStressProducts } from "../src/features/products/hooks/useStressProducts";
import { useSearchProducts } from "../src/features/products/hooks/useSearchProducts";
import { useProductStore } from "../src/features/products/store";
import ProductCard, {
  ITEM_HEIGHT,
} from "../src/features/products/components/ProductCard";

import ProductCardSkeleton from "../src/features/products/components/ProductCardSkeleton";
import SearchBar from "../src/features/products/components/SearchBar";
import Pagination from "../src/features/products/components/Pagination";
import StressTestToggle from "../src/features/products/components/StressTestToggle";
import Slow3GToggle from "../src/features/products/components/Slow3GToggle";
import SortBar from "../src/features/products/components/SortBar";
import useNavigateToProduct from "../src/features/products/hooks/useNavigateToProduct";

const SKELETON_KEYS = Array.from({ length: 7 }, (_, i) => i);

// Defined outside the component — truly stable reference, never recreated on re-render.
// ProductCard.memo comparison works correctly because onPress is stable per item (see useNavigateToProduct).
const keyExtractor = (item) =>
  item._key !== undefined ? item._key.toString() : item.id.toString();

export default function ProductListScreen() {
  const listRef = useRef(null);
  const navigateTo = useNavigateToProduct();
  const searchQuery = useProductStore((s) => s.searchQuery);
  const page = useProductStore((s) => s.page);
  const setPage = useProductStore((s) => s.setPage);
  const stressTest = useProductStore((s) => s.stressTest);
  const sortBy = useProductStore((s) => s.sortBy);
  const sortOrder = useProductStore((s) => s.sortOrder);
  const isSearching = searchQuery.trim().length > 1;

  const { data, isLoading, isError, isFetching, refetch } = useProducts(
    page,
    sortBy,
    sortOrder,
  );
  const stress = useStressProducts(stressTest, sortBy, sortOrder);
  const searchResult = useSearchProducts(searchQuery, sortBy, sortOrder);

  // Flatten stress pages — use _key for FlatList uniqueness, keep real id for navigation
  const stressProducts = useMemo(() => {
    if (!stress.data) return [];
    let index = 0;
    return stress.data.pages.flatMap((p) =>
      p.products.map((item) => ({ ...item, _key: index++ })),
    );
  }, [stress.data]);

  const products = useMemo(
    () =>
      stressTest
        ? stressProducts
        : isSearching
          ? (searchResult.data?.products ?? [])
          : (data?.products ?? []),
    [stressTest, stressProducts, isSearching, searchResult.data, data],
  );

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;
  const showPagination = !stressTest && !isSearching;

  const isInitialLoading = stressTest
    ? stress.isLoading
    : isLoading || isFetching;
  const isErrorAny = stressTest ? stress.isError : isError;
  const isFetchingMore = stressTest && stress.isFetchingNextPage;

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  const handlePrev = useCallback(() => {
    setPage(page - 1);
    scrollToTop();
  }, [page, setPage, scrollToTop]);

  const handleNext = useCallback(() => {
    setPage(page + 1);
    scrollToTop();
  }, [page, setPage, scrollToTop]);

  const handleEndReached = useCallback(() => {
    if (stressTest && stress.hasNextPage && !stress.isFetchingNextPage) {
      stress.fetchNextPage();
    }
  }, [stressTest, stress]);

  const renderItem = useCallback(
    ({ item }) => <ProductCard product={item} onPress={navigateTo} />,
    [navigateTo],
  );

  const footer = useMemo(
    () =>
      isFetchingMore ? (
        <View>
          {SKELETON_KEYS.map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </View>
      ) : null,
    [isFetchingMore],
  );

  if (isErrorAny) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.fixedHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Products</Text>
            <View style={styles.toggles}>
              <Slow3GToggle />
              <StressTestToggle />
            </View>
          </View>
          <SearchBar />
          <SortBar />
        </View>
        <View style={styles.center}>
          <Text style={styles.errorText}>
            Failed to load products. Check your connection.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      {/* Fixed header — lives outside FlatList so its reference never changes */}
      <View style={styles.fixedHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            {stressTest && stressProducts.length > 0 ? `Products` : "Products"}
          </Text>
          <View style={styles.toggles}>
            <Slow3GToggle />
            <StressTestToggle />
          </View>
        </View>
        <SearchBar />
        <SortBar />
      </View>

      {isInitialLoading ? (
        <View style={styles.skeletonContainer}>
          {SKELETON_KEYS.map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlashList
          ref={listRef}
          data={products}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={ITEM_HEIGHT}
          // Tell FlashList exact item size — eliminates layout recalculation
          overrideItemLayout={(layout) => {
            layout.size = ITEM_HEIGHT;
          }}
          // Render 1500px ahead/behind viewport — reduces blank cells during fast flings
          drawDistance={1500}
          contentContainerStyle={styles.list}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={footer}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refetch}
              tintColor="#6366f1"
            />
          }
        />
      )}

      {showPagination && !isInitialLoading && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f9fafb" },
  fixedHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#f9fafb",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  toggles: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  list: { paddingHorizontal: 16, paddingBottom: 8 },
  skeletonContainer: { paddingHorizontal: 16 },
  footerLoader: { paddingVertical: 16, alignItems: "center" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorText: { color: "#6b7280", textAlign: "center" },
  emptyText: { color: "#9ca3af", marginTop: 64 },
});
