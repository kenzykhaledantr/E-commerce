// src/screens/main/PaymentMethodsScreen.tsx
import React, { useState } from 'react';
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
import { COLORS, SPACING, RADIUS } from '../../../utils/constants';
import type { PaymentCard } from '../../../types';

export default function PaymentMethodsScreen() {
  const navigation = useNavigation<any>();

  const { data: cards, isLoading } = useCards();
  const addCard    = useAddCard();
  const deleteCard = useDeleteCard();
  const setDefault = useSetDefaultCard();

  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = async (cardData: Omit<PaymentCard, 'id'>) => {
    try {
      await addCard.mutateAsync(cardData);
      setModalVisible(false);
    } catch (e: any) {
      Alert.alert(
        'Could not save card',
        e.message ?? 'Please try again.'
      );
    }
  };

  // Default card for hero display
  const defaultCard = cards?.find((c) => c.isDefault) ?? cards?.[0];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PAYMENT METHODS</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBtnText}>+ ADD</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
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
                  <Text style={styles.heroLabel}>DEFAULT CARD</Text>
                  <VisualCard card={defaultCard} />
                </View>
              )}

              {/* Cards list header */}
              {cards && cards.length > 0 && (
                <Text style={styles.listTitle}>ALL CARDS</Text>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💳</Text>
              <Text style={styles.emptyTitle}>No payment methods</Text>
              <Text style={styles.emptySubtitle}>
                Add a card for faster checkout
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.emptyBtnText}>
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
                style={styles.addNewBtn}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.addNewIcon}>+</Text>
                <Text style={styles.addNewText}>Add New Card</Text>
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
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm,
    backgroundColor:   COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  backText:    { fontSize: 24, color: COLORS.textPrimary, width: 40 },
  headerTitle: {
    fontSize:      12,
    fontWeight:    '700',
    letterSpacing: 3,
    color:         COLORS.textPrimary,
  },
  addBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical:   6,
    backgroundColor:   COLORS.primary,
    borderRadius:      RADIUS.full,
  },
  addBtnText: {
    fontSize:      11,
    fontWeight:    '700',
    color:         COLORS.white,
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
    color:         COLORS.textSecondary,
    alignSelf:     'flex-start',
  },
  listTitle: {
    fontSize:      10,
    letterSpacing: 3,
    fontWeight:    '700',
    color:         COLORS.textSecondary,
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
    color:      COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize:  14,
    color:     COLORS.textSecondary,
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop:         SPACING.lg,
    backgroundColor:   COLORS.primary,
    paddingVertical:   14,
    paddingHorizontal: SPACING.xl,
    borderRadius:      RADIUS.md,
  },
  emptyBtnText: {
    color:         COLORS.white,
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
    borderColor:     COLORS.border,
    borderRadius:    RADIUS.md,
    borderStyle:     'dashed',
    backgroundColor: COLORS.white,
  },
  addNewIcon: { fontSize: 20, color: COLORS.textSecondary },
  addNewText: {
    fontSize:   15,
    fontWeight: '600',
    color:      COLORS.textSecondary,
  },
});