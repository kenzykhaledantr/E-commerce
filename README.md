# Elite Retail — React Native E-Commerce App

A production-ready, fully-animated mobile e-commerce application built with **React Native (Expo)** and **TypeScript**, powered by a **Firebase** backend. Designed and built across 9 progressive development phases.

---

## Screenshots

| Home | Product Detail | Cart | Checkout | Profile |
|------|---------------|------|----------|---------|
| Hero banner, categories, product grid | Images, rating, add to cart | Item management, delivery | 3-step wizard | Orders, addresses, settings |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 52 |
| Language | TypeScript |
| Backend | Firebase (Auth + Firestore + Storage) |
| State — client | Zustand |
| State — server | TanStack React Query |
| Navigation | React Navigation v6 |
| Animations | React Native Animated API |
| Notifications | Expo Notifications |
| Storage | AsyncStorage (theme persistence) |
| UI | Custom component library |

---

## Features

### Authentication
- Email / password registration and login
- Firebase Auth with JWT token management
- Persistent sessions — stays logged in after app restart
- Protected route system — automatic redirect based on auth state

### Home Screen
- Auto-scrolling hero banner with 3 slides and dot indicators
- Category filter strip — Bags, Clothes, Electronics, Footwear, Watches, Accessories
- New Arrivals horizontal scroll with skeleton loaders
- 2-column product grid with pull-to-refresh
- Animated section transitions on load

### Product System
- Full product catalogue stored in Firestore
- Product cards with images, ratings, discount badges, and favourite toggle
- Detailed product page with image, description, tags, and quantity selector
- Add to cart with animated toast confirmation
- Animated heart pop on favourite

### Cart & Checkout
- Cart with swipe-to-delete animation
- Quantity management with animated +/− buttons
- Delivery method selector (Standard / Express)
- 3-step checkout wizard — Shipping → Delivery → Payment
- Shipping address loaded from saved Firebase addresses
- Order saved to Firestore on completion
- Order confirmation notification fires on success

### Profile
- **My Orders** — full order history with status filter chips, order cards with product image previews, and detailed order view with progress tracker
- **Saved Addresses** — add, edit, delete, and set default shipping addresses with Firestore persistence
- **Payment Methods** — add cards with live visual card preview, auto card-type detection (Visa / Mastercard / Amex), and card flip animation on CVV entry
- **Account Settings** — edit display name, change password, and dark mode toggle

### Dark Mode
- Full app-wide dark theme system
- Persisted to AsyncStorage — remembered across app restarts
- Reactive — one toggle switches every screen instantly

### Notifications
- Permission request on first launch
- Welcome notification on registration
- Order confirmation notification on checkout
- Price drop alert from Saved Items screen
- Notification tap → navigates to relevant screen

### UX Polish
- Offline detection banner — slides in/out automatically
- Error Boundary — catches JS crashes and shows recovery screen
- Toast component — slides in from top with success/error/info states
- Skeleton loaders on all data-fetching screens
- Empty states on all list screens with action buttons
- Animated splash screen on launch
- Form validation with inline field errors
- Keyboard avoiding on all forms

---

## Project Structure

```
EliteRetail/
├── src/
│   ├── api/                    # React Query hooks
│   │   ├── useProducts.ts
│   │   ├── useOrders.ts
│   │   ├── useAddresses.ts
│   │   └── useCards.ts
│   │
│   ├── components/
│   │   ├── common/             # Shared UI components
│   │   │   ├── AppHeader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── FormInput.tsx
│   │   │   ├── LoadingButton.tsx
│   │   │   ├── OfflineBanner.tsx
│   │   │   ├── QuantityControl.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── SkeletonCard.tsx
│   │   │   └── Toast.tsx
│   │   ├── address/
│   │   │   ├── AddressCard.tsx
│   │   │   └── AddressFormModal.tsx
│   │   ├── cart/
│   │   │   └── CartItemCard.tsx
│   │   ├── order/
│   │   │   ├── OrderCard.tsx
│   │   │   └── OrderStatusBadge.tsx
│   │   └── payment/
│   │       ├── CardFormModal.tsx
│   │       ├── CardItem.tsx
│   │       └── VisualCard.tsx
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useAddToCartAnimation.ts
│   │   ├── useNetworkStatus.ts
│   │   ├── useNotifications.ts
│   │   ├── usePullToRefresh.ts
│   │   ├── useScreenAnimation.ts
│   │   ├── useTheme.ts
│   │   └── useToast.ts
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx    # Root stack (wraps tabs + shared screens)
│   │   ├── AuthNavigator.tsx   # Login / Register / Splash
│   │   ├── HomeNavigator.tsx   # Home tab stack
│   │   ├── MainNavigator.tsx   # Bottom tabs
│   │   └── RootNavigator.tsx   # Auth gate
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── main/
│   │       ├── HomeScreen.tsx
│   │       ├── ProductDetailScreen.tsx
│   │       ├── CartScreen.tsx
│   │       ├── CheckoutScreen.tsx
│   │       ├── OrderSuccessScreen.tsx
│   │       ├── CategoriesScreen.tsx
│   │       ├── SavedScreen.tsx
│   │       ├── ProfileScreen.tsx
│   │       ├── MyOrdersScreen.tsx
│   │       ├── OrderDetailScreen.tsx
│   │       ├── SavedAddressesScreen.tsx
│   │       ├── PaymentMethodsScreen.tsx
│   │       └── AccountSettingsScreen.tsx
│   │
│   ├── services/               # Firebase service layer
│   │   ├── firebase.ts         # Firebase initialisation
│   │   ├── authService.ts      # Auth operations
│   │   ├── productService.ts   # Product CRUD
│   │   ├── orderService.ts     # Order CRUD
│   │   ├── addressService.ts   # Address CRUD
│   │   ├── cardService.ts      # Card CRUD
│   │   ├── notificationService.ts
│   │      
│   │
│   ├── store/                  # Zustand stores
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   ├── favoritesStore.ts
│   │   └── themeStore.ts
│   │
│   ├── types/
│   │   ├── index.ts            # Domain types
│   │   └── navigation.ts       # Navigation param lists
│   │
│   └── utils/
│       ├── constants.ts        # Colors, spacing, radius
│       ├── listHelpers.ts      # FlatList performance props
│       ├── queryErrorHandler.ts
│       └── validation.ts       # Form validators
│
├── assets/
├── App.tsx
├── app.json
└── babel.config.js
```

---

## Build Phases

| Phase | What was built |
|-------|---------------|
| 1 | Expo + TypeScript setup, folder architecture, type definitions |
| 2 | Navigation system — Stack + Tabs + protected routes |
| 3 | Firebase Auth — register, login, logout, Firestore user profile |
| 4 | Product system — Firestore CRUD, React Query hooks, cart store |
| 5 | Home screen — hero banner, categories, product grid, skeleton loaders |
| 6 | Animations — card press scale, badge bounce, heart pop, screen stagger |
| 7 | Cart screen + 3-step checkout + Firestore orders + order success |
| 8 | Notifications + Saved screen + Categories screen + Toast + UX polish |
| 9 | Error boundary + offline banner + performance optimisation + production config |
| + | Saved addresses, payment methods, account settings, dark mode, my orders |

---

## Licence

MIT — free to use for personal and commercial projects.

- Backend via [Firebase](https://firebase.google.com)
- Built with [Expo](https://expo.dev)
