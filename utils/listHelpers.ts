// src/utils/listHelpers.ts

// keyExtractor — stable key prevents unnecessary re-renders
export const keyExtractor = (item: { id: string }) => item.id;

// getItemLayout for fixed-height lists — skips measuring each row
// Only use when all items have the SAME height
export const getItemLayout =
  (itemHeight: number) =>
  (_: any, index: number) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });

// Recommended FlatList performance props
export const FLATLIST_PERFORMANCE_PROPS = {
  removeClippedSubviews: true,    // unmount off-screen items (Android)
  maxToRenderPerBatch: 8,         // render 8 items per batch
  updateCellsBatchingPeriod: 50,  // batch updates every 50ms
  windowSize: 10,                 // render 5 screens above + below
  initialNumToRender: 6,          // render 6 items on first paint
} as const;