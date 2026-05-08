// src/utils/releaseChecklist.ts
// Run through this before every release

const CHECKLIST = {
  firebase: [
    '✅ Firestore security rules deployed',
    '✅ Firebase Auth email/password enabled',
    '✅ .env not committed to git',
    '✅ Firebase project on Blaze plan for notifications',
  ],
  performance: [
    '✅ React.memo on ProductCard, CartItemCard',
    '✅ useCallback on renderItem functions',
    '✅ FlatList performance props applied',
    '✅ Images use resizeMode="cover"',
    '✅ No console.log in production',
  ],
  ux: [
    '✅ All screens handle empty state',
    '✅ All screens handle loading state',
    '✅ All screens handle error state',
    '✅ Keyboard avoiding on all forms',
    '✅ SafeAreaView on all screens',
    '✅ Back button works on Android',
  ],
  build: [
    '✅ app.json version bumped',
    '✅ App icon added (1024x1024)',
    '✅ Splash screen configured',
    '✅ orientation: portrait locked',
    '✅ Android permissions declared',
  ],
};