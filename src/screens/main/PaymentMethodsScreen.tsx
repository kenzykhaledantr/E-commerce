// src/screens/main/PaymentMethodsScreen.tsx
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  useCards,
  useAddCard,
  useDeleteCard,
  useSetDefaultCard,
} from '../../../api/useCards';
import CardItem      from '../../../components/payment/CardItem';
import CardFormModal from '../../../components/payment/CardFormModal';
import VisualCard    from '../../../components/payment/VisualCard';
import { SPACING, RADIUS } from '../../../utils/constants';
import { useTheme } from '../../../hook/useTheme';
import type { PaymentCard } from '../../../types';
import CustomAlert      from '../../../components/common/CustomAlert';
import { useCustomAlert } from '../../../hook/useCustomAlert';

export default function PaymentMethodsScreen() {
  const navigation = useNavigation<any>();
  const { colors: C } = useTheme();

  const { data: cards, isLoading } = useCards();
  const addCard    = useAddCard();
  const deleteCard = useDeleteCard();
  const setDefault = useSetDefaultCard();

  const [modalVisible, setModalVisible] = useState(false);
  const { alertState, hideAlert, showError } = useCustomAlert();

  const handleSave = async (cardData: Omit<PaymentCard, 'id'>) => {
    try {
      await addCard.mutateAsync(cardData);
      setModalVisible(false);
    } catch (e: any) {
      showError(
        'Could not save card',
        e.message ?? 'Please try again.'
      );
    }
  };

  // Default card for hero display
  const defaultCard = cards?.find((c) => c.isDefault) ?? cards?.[0];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>PAYMENT METHODS</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: C.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.addBtnText, { color: C.textInverse }]}>+ ADD</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : (
        <FlatList
          data={cards ?? []}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() =>
            <View style={{ height: SPACING.md }} />
          }
          ListHeaderComponent={
            <View>
              {/* Hero default card */}
              {defaultCard && (
                <View style={styles.heroSection}>
                  <Text style={[styles.heroLabel, { color: C.textSecondary }]}>DEFAULT CARD</Text>
                  <VisualCard card={defaultCard} />
                </View>
              )}

              {/* Cards list header */}
              {cards && cards.length > 0 && (
                <Text style={[styles.listTitle, { color: C.textSecondary }]}>ALL CARDS</Text>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="card-outline" size={56} color={C.textLight} />
              <Text style={[styles.emptyTitle, { color: C.text }]}>No payment methods</Text>
              <Text style={[styles.emptySubtitle, { color: C.textSecondary }]}>
                Add a card for faster checkout
              </Text>
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: C.primary }]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={[styles.emptyBtnText, { color: C.textInverse }]}>
                  + ADD YOUR FIRST CARD
                </Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <CardItem
              card={item}
              onDelete={() => deleteCard.mutate(item.id)}
              onSetDefault={() => setDefault.mutate(item.id)}
            />
          )}
          ListFooterComponent={
            cards && cards.length > 0 ? (
              <TouchableOpacity
                style={[styles.addNewBtn, { backgroundColor: C.card, borderColor: C.border }]}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="add-circle-outline" size={22} color={C.textSecondary} />
                <Text style={[styles.addNewText, { color: C.textSecondary }]}>Add New Card</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}

      {/* Card Form Modal */}
      <CardFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        isSaving={addCard.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
    borderBottomWidth: 0.5,
  },
  backText:    { fontSize: 24, width: 40 },
  headerTitle: {
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 3,
  },
  addBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical:   6,
    borderRadius:      RADIUS.full,
  },
  addBtnText: {
    fontSize:      11,
    fontWeight:    '700',
    letterSpacing: 1,
  },
  loadingContainer: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  listContent: {
    padding:       SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  heroSection: {
    gap:           SPACING.sm,
    marginBottom:  SPACING.lg,
    alignItems:    'center',
  },
  heroLabel: {
    fontSize:      10,
    letterSpacing: 3,
    fontWeight:    '700',
    alignSelf:     'flex-start',
  },
  listTitle: {
    fontSize:      10,
    letterSpacing: 3,
    fontWeight:    '700',
    marginBottom:  SPACING.sm,
  },
  emptyContainer: {
    alignItems:        'center',
    justifyContent:    'center',
    paddingTop:        80,
    gap:               SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon:     { fontSize: 56, marginBottom: SPACING.sm },
  emptyTitle: {
    fontSize:   20,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize:  14,
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop:         SPACING.lg,
    paddingVertical:   14,
    paddingHorizontal: SPACING.xl,
    borderRadius:      RADIUS.md,
  },
  emptyBtnText: {
    fontWeight:    '700',
    fontSize:      12,
    letterSpacing: 2,
  },
  addNewBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             SPACING.sm,
    marginTop:       SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth:     1.5,
    borderRadius:    RADIUS.md,
    borderStyle:     'dashed',
  },
  addNewIcon: { fontSize: 20 },
  addNewText: {
    fontSize:   15,
    fontWeight: '600',
  },
});